import { NextRequest, NextResponse } from 'next/server';
import { getCompleteStockData } from '@/lib/stockService';

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol;

    if (!symbol) {
      return NextResponse.json(
        { error: 'Stock symbol is required' },
        { status: 400 }
      );
    }

    const stockData = await getCompleteStockData(symbol);

    if (!stockData) {
      return NextResponse.json(
        { error: 'Stock not found or API limit reached. Please try again later.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      symbol: symbol.toUpperCase(),
      currentPrice: stockData.quote.currentPrice,
      change: stockData.quote.change,
      changePercent: stockData.quote.changePercent,
      volume: stockData.quote.volume,
      previousClose: stockData.quote.previousClose,
      historicalData: stockData.historicalData,
      companyName: stockData.companyName,
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}
