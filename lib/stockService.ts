import axios from 'axios';

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

// Rate limiting: ensure minimum 1 second between requests
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1100; // 1.1 seconds to be safe

async function rateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
}

export interface StockQuote {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  previousClose: number;
}

export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockData {
  quote: StockQuote;
  historicalData: HistoricalDataPoint[];
  companyName?: string;
}

export interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
}

/**
 * Search for stock symbols by company name or symbol
 */
export async function searchSymbol(query: string): Promise<SearchResult[]> {
  try {
    await rateLimit();
    
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: query,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    // Check for rate limit message
    if (response.data.Information) {
      console.error('Alpha Vantage rate limit:', response.data.Information);
      return [];
    }

    const matches = response.data.bestMatches || [];
    
    return matches.map((match: any) => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      type: match['3. type'],
      region: match['4. region'],
    }));
  } catch (error) {
    console.error('Error searching symbol:', error);
    return [];
  }
}

/**
 * Fetches current stock quote from Alpha Vantage
 */
export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    await rateLimit();
    
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol.toUpperCase(),
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    console.log('Alpha Vantage Response:', JSON.stringify(response.data, null, 2));

    // Check for rate limit message
    if (response.data.Information) {
      console.error('Alpha Vantage rate limit:', response.data.Information);
      return null;
    }

    const quote = response.data['Global Quote'];
    
    if (!quote || Object.keys(quote).length === 0) {
      console.error('No quote data found for symbol:', symbol);
      return null;
    }

    return {
      symbol: quote['01. symbol'],
      currentPrice: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      previousClose: parseFloat(quote['08. previous close']),
    };
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    return null;
  }
}

/**
 * Fetches historical daily stock data
 */
export async function getHistoricalData(
  symbol: string,
  outputSize: 'compact' | 'full' = 'compact'
): Promise<HistoricalDataPoint[]> {
  try {
    await rateLimit();
    
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol.toUpperCase(),
        outputsize: outputSize, // compact = last 100 days, full = 20 years
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    // Check for rate limit message
    if (response.data.Information) {
      console.error('Alpha Vantage rate limit:', response.data.Information);
      return [];
    }

    const timeSeries = response.data['Time Series (Daily)'];
    
    if (!timeSeries) {
      return [];
    }

    const historicalData: HistoricalDataPoint[] = [];
    
    for (const [date, values] of Object.entries(timeSeries)) {
      historicalData.push({
        date,
        open: parseFloat((values as any)['1. open']),
        high: parseFloat((values as any)['2. high']),
        low: parseFloat((values as any)['3. low']),
        close: parseFloat((values as any)['4. close']),
        volume: parseInt((values as any)['5. volume']),
      });
    }

    // Sort by date (oldest first)
    return historicalData.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }
}

/**
 * Fetches company overview information
 */
export async function getCompanyOverview(symbol: string) {
  try {
    await rateLimit();
    
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'OVERVIEW',
        symbol: symbol.toUpperCase(),
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    // Check for rate limit message
    if (response.data.Information) {
      console.error('Alpha Vantage rate limit:', response.data.Information);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching company overview:', error);
    return null;
  }
}

/**
 * Get comprehensive stock data
 */
export async function getCompleteStockData(symbol: string): Promise<StockData | null> {
  try {
    const [quote, historicalData, overview] = await Promise.all([
      getStockQuote(symbol),
      getHistoricalData(symbol),
      getCompanyOverview(symbol),
    ]);

    if (!quote) {
      return null;
    }

    return {
      quote,
      historicalData,
      companyName: overview?.Name,
    };
  } catch (error) {
    console.error('Error fetching complete stock data:', error);
    return null;
  }
}
