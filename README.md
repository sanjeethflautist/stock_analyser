# Stock Analyzer - AI-Powered Investment Insights

A modern web application for analyzing stocks with AI-powered predictions and investment recommendations. Built with Next.js 14, TypeScript, and Tailwind CSS, optimized for deployment on Vercel.

## Features

- 📊 **Real-time Stock Data**: Fetch current prices and historical data for any stock
- 🤖 **AI-Powered Analysis**: Get investment recommendations using Google Gemini AI
- 📈 **Interactive Charts**: Visualize 60-day price trends with beautiful charts
- 🎯 **Investment Insights**: Risk assessment, confidence scores, and key points
- 🌓 **Dark Mode Support**: Automatic dark/light theme switching
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🔒 **Privacy-Focused**: No personal data storage or tracking

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Stock Data**: Alpha Vantage API (free tier)
- **AI Analysis**: Google Gemini API (free tier)
- **Deployment**: Vercel

## Free AI Services Used

### Google Gemini (Recommended)
- **Free Tier**: 60 requests per minute
- **Get API Key**: https://makersuite.google.com/app/apikey
- **Features**: Advanced text generation, excellent for financial analysis

### Alternative: Hugging Face
- **Free Tier**: 30,000 requests per month
- **Get Token**: https://huggingface.co/settings/tokens
- **Features**: Multiple AI models available

## Getting Started

### Prerequisites

- Node.js 18+ installed
- API keys for:
  - Alpha Vantage (free): https://www.alphavantage.co/support/#api-key
  - Google Gemini (free): https://makersuite.google.com/app/apikey

### Installation

1. **Clone or navigate to the project**:
   ```bash
   cd stock_analiser
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file and add your API keys**:
   ```
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
   GEMINI_API_KEY=your_gemini_key
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Add environment variables in the Vercel dashboard:
   - `ALPHA_VANTAGE_API_KEY`
   - `GEMINI_API_KEY`
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Add environment variables**:
   ```bash
   vercel env add ALPHA_VANTAGE_API_KEY
   vercel env add GEMINI_API_KEY
   ```

5. **Redeploy with environment variables**:
   ```bash
   vercel --prod
   ```

## Usage

1. **Search for a stock**: Enter a stock symbol (e.g., AAPL, GOOGL, MSFT) in the search bar
2. **View current data**: See real-time price, change, and volume
3. **Analyze charts**: Review 60-day price trends and statistics
4. **Get AI insights**: View AI-powered investment recommendations, risk assessment, and key points

## API Rate Limits

- **Alpha Vantage Free**: 25 requests per day
- **Google Gemini Free**: 60 requests per minute
- **Hugging Face Free**: 30,000 requests per month

## Project Structure

```
stock_analiser/
├── app/
│   ├── api/
│   │   ├── stock/[symbol]/route.ts   # Stock data endpoint
│   │   └── ai-analysis/route.ts      # AI analysis endpoint
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Home page
├── components/
│   ├── StockSearch.tsx               # Search component
│   ├── StockChart.tsx                # Chart component
│   └── AIAnalysis.tsx                # AI analysis display
├── lib/
│   ├── stockService.ts               # Stock data service
│   └── aiService.ts                  # AI analysis service
├── .env.example                      # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## Features Explained

### Stock Data Service
- Fetches real-time quotes
- Retrieves historical daily data
- Gets company overview information
- Handles API errors gracefully

### AI Analysis
- Analyzes price trends and volatility
- Calculates technical indicators (SMA, volatility)
- Provides BUY/HOLD/SELL recommendations
- Assesses risk levels (LOW/MEDIUM/HIGH)
- Generates confidence scores
- Includes fallback to technical analysis if AI fails

### Privacy & Security
- No user authentication required
- No personal data stored
- No tracking or analytics
- API keys stored securely in environment variables
- All data processing happens server-side

## Disclaimer

This application is for educational and informational purposes only. The AI-generated analysis and recommendations should not be considered as financial advice. Always conduct your own research and consult with a qualified financial advisor before making any investment decisions.

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please check:
- Alpha Vantage documentation: https://www.alphavantage.co/documentation/
- Google Gemini documentation: https://ai.google.dev/docs
- Next.js documentation: https://nextjs.org/docs

---

Built with ❤️ using Next.js and AI
# stock_analyser
