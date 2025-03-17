# Crypto Whale Tracking & Sentiment Analysis System

This project is built for a hackathon and comprises three AI agents designed to track whale transactions, summarize market sentiment, and analyze crypto news data. The system is specifically designed for the Ethereum Mainnet and integrates real-time whale transactions, market sentiment, and Telegram notifications for traders.

## Agents Overview

### Whale Watcher Agent
- Purpose: Monitors whale transactions on decentralized exchanges (DEX) for a specified token on Ethereum Mainnet.
- Functionality:
  - Fetches and aggregates whale transactions.
  - Calculates market depth for the ever changing markets

### Summarizer Agent
- Purpose: Extracts and summarizes key insights from recent crypto news, market discussions, and social media posts.
- Functionality:
  - Uses an LLM (Hugging Face API) to generate concise summaries.
  - Provides traders with actionable insights.

### Sentiment Analyzer Agent
- Purpose: Analyzes the bullish, bearish, or neutral sentiment from aggregated market data.
- Functionality:
  - Collects and processes up to 50 relevant posts/news.
  - Fetches sentiment data from CryptoPanic API.
  - Classifies sentiment based on news and social media discussions.

## Setup Instructions

### 1. Clone the Repository
    - git clone https://github.com/Sensie2102/DeFI-Analyser-OpenServ.git
    - cd <AGENT>

## Install Dependencies
- Ensure you have node.js installed
- For every agent run:
  - npm install 

## Setup Environment Variables

### Whale Watcher Agent
- BITQUERY_API_KEY=your_api_key

### Sentiment Analysis Agent
- HUGGING_FACE_API_KEY=YOUR_TOKEN
- CRYPTO_PANIC_API_KEY=YOUR_KEY

### Summarizer
- HUGGING_FACE_API_KEY=YOUR_TOKEN

## Running the Agents

### Whale Watcher Agent
- Start monitoring whale transactions on Ethereum:
    - cd whale_watcher
    - npm run dev
This agent will detect large transactions and analyze liquidity impact.

### Summarizer Agent
- Generate market summaries using AI:
    - cd summarizer
    - npm run dev
This agent will summarize whale trades and market sentiment using an LLM model for the given token

### Sentiment Analyzer Agent
- Analyze crypto sentiment and assign risk scores:
    - cd agents/sentiment_analyzer
    - npm run dev
This agent retrieves and processes news from CryptoPanic and Twitter/X.

## Future Enhancements
- Add support for other EVM chains.
- Improve vector search for token standardization.
- Integerate it with telegram bots.