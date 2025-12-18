import { NextRequest, NextResponse } from 'next/server';
import { analyzeStockWithAI } from '@/lib/aiService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symbol, currentPrice, historicalData, companyInfo } = body;

    if (!symbol || !currentPrice || !historicalData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const analysis = await analyzeStockWithAI(
      symbol,
      currentPrice,
      historicalData,
      companyInfo
    );

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error performing AI analysis:', error);
    return NextResponse.json(
      { error: 'Failed to perform AI analysis' },
      { status: 500 }
    );
  }
}
