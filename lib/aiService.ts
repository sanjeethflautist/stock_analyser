import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface AIAnalysisResult {
  analysis: string;
  recommendation: 'BUY' | 'HOLD' | 'SELL';
  confidence: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  keyPoints: string[];
}

/**
 * Analyzes stock data using Google Gemini AI
 */
export async function analyzeStockWithAI(
  symbol: string,
  currentPrice: number,
  historicalData: any[],
  companyInfo?: any
): Promise<AIAnalysisResult> {
  try {
    // Calculate basic metrics
    const recentPrices = historicalData.slice(-30).map(d => d.close);
    const priceChange30d = ((currentPrice - recentPrices[0]) / recentPrices[0]) * 100;
    const volatility = calculateVolatility(recentPrices);
    
    // Create analysis prompt
    const prompt = `Analyze the stock ${symbol} for investment purposes. Here's the data:

Current Price: $${currentPrice}
30-Day Price Change: ${priceChange30d.toFixed(2)}%
30-Day Volatility: ${volatility.toFixed(2)}%
Company: ${companyInfo?.Name || 'Unknown'}
Sector: ${companyInfo?.Sector || 'Unknown'}
Market Cap: ${companyInfo?.MarketCapitalization || 'Unknown'}

Recent price trend (last 10 days): ${recentPrices.slice(-10).map(p => p.toFixed(2)).join(', ')}

Based on this data, provide:
1. Investment recommendation (BUY/HOLD/SELL)
2. Confidence level (0-100)
3. Risk assessment (LOW/MEDIUM/HIGH)
4. 3-5 key points for investors
5. Brief analysis (2-3 paragraphs)

Format your response as JSON with keys: recommendation, confidence, riskLevel, keyPoints (array), analysis (string).
Do NOT include any personal data or make guarantees about future performance. This is for educational purposes only.`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    
    // Try to parse JSON response
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          analysis: parsed.analysis || aiResponse,
          recommendation: parsed.recommendation || 'HOLD',
          confidence: parsed.confidence || 50,
          riskLevel: parsed.riskLevel || 'MEDIUM',
          keyPoints: parsed.keyPoints || [],
        };
      }
    } catch (parseError) {
      // If JSON parsing fails, create structured response from text
      return parseTextResponse(aiResponse, priceChange30d, volatility);
    }

    return parseTextResponse(aiResponse, priceChange30d, volatility);
  } catch (error) {
    console.error('Error analyzing stock with AI:', error);
    
    // Fallback to basic technical analysis
    return performBasicAnalysis(symbol, currentPrice, historicalData);
  }
}

/**
 * Parse text response into structured format
 */
function parseTextResponse(text: string, priceChange: number, volatility: number): AIAnalysisResult {
  const recommendation = text.match(/\b(BUY|SELL|HOLD)\b/i)?.[0].toUpperCase() as any || 'HOLD';
  const confidenceMatch = text.match(/confidence[:\s]+(\d+)/i);
  const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 50;
  
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
  if (volatility > 5) riskLevel = 'HIGH';
  else if (volatility < 2) riskLevel = 'LOW';
  
  const keyPoints: string[] = [];
  const bulletPoints = text.match(/[-•]\s*(.+)/g);
  if (bulletPoints) {
    keyPoints.push(...bulletPoints.slice(0, 5).map(p => p.replace(/^[-•]\s*/, '')));
  }
  
  return {
    analysis: text,
    recommendation,
    confidence,
    riskLevel,
    keyPoints: keyPoints.length > 0 ? keyPoints : [
      `30-day price change: ${priceChange.toFixed(2)}%`,
      `Volatility level: ${volatility.toFixed(2)}%`,
      `AI recommendation: ${recommendation}`
    ],
  };
}

/**
 * Fallback basic technical analysis
 */
function performBasicAnalysis(
  symbol: string,
  currentPrice: number,
  historicalData: any[]
): AIAnalysisResult {
  const recentPrices = historicalData.slice(-30).map(d => d.close);
  const priceChange30d = ((currentPrice - recentPrices[0]) / recentPrices[0]) * 100;
  const volatility = calculateVolatility(recentPrices);
  const sma20 = calculateSMA(recentPrices, 20);
  
  let recommendation: 'BUY' | 'HOLD' | 'SELL' = 'HOLD';
  let confidence = 50;
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
  
  if (currentPrice > sma20 && priceChange30d > 5) {
    recommendation = 'BUY';
    confidence = 65;
  } else if (currentPrice < sma20 && priceChange30d < -5) {
    recommendation = 'SELL';
    confidence = 60;
  }
  
  if (volatility > 5) riskLevel = 'HIGH';
  else if (volatility < 2) riskLevel = 'LOW';
  
  const analysis = `Technical analysis for ${symbol}:
  
The stock is currently trading at $${currentPrice.toFixed(2)}, showing a ${priceChange30d.toFixed(2)}% change over the past 30 days. The 20-day simple moving average is at $${sma20.toFixed(2)}.

Risk Assessment: ${riskLevel} risk based on ${volatility.toFixed(2)}% volatility.

This analysis is based on technical indicators and historical price movements. Always conduct thorough research and consult with financial advisors before making investment decisions.`;
  
  return {
    analysis,
    recommendation,
    confidence,
    riskLevel,
    keyPoints: [
      `Current price: $${currentPrice.toFixed(2)}`,
      `30-day change: ${priceChange30d.toFixed(2)}%`,
      `20-day SMA: $${sma20.toFixed(2)}`,
      `Volatility: ${volatility.toFixed(2)}% (${riskLevel} risk)`,
      `Recommendation: ${recommendation} (${confidence}% confidence)`
    ],
  };
}

/**
 * Calculate volatility (standard deviation)
 */
function calculateVolatility(prices: number[]): number {
  const returns = prices.slice(1).map((price, i) => 
    ((price - prices[i]) / prices[i]) * 100
  );
  
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  
  return Math.sqrt(variance);
}

/**
 * Calculate Simple Moving Average
 */
function calculateSMA(prices: number[], period: number): number {
  const relevantPrices = prices.slice(-period);
  return relevantPrices.reduce((sum, p) => sum + p, 0) / relevantPrices.length;
}
