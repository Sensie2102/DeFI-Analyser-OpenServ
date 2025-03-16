import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";


dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const bot = new TelegramBot(BOT_TOKEN, { polling: true });


const TRIGGER_URL = "https://api.openserv.ai/webhooks/tasks/16204/trigger/2b5d834b35034d76805ad92475224d8d";

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        "Welcome to WhaleTracker! Use /getInfo <TOKEN> to analyze whale transactions."
    );
});


bot.onText(/\/getInfo (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const token = match?.[1]?.toUpperCase();

    if (!token) {
        bot.sendMessage(chatId, "Please provide a token symbol, e.g., /getInfo WBTC.");
        return;
    }

    bot.sendMessage(chatId, `Fetching latest whale transactions and sentiment analysis for ${token}...`);

    try {
        const analysis = await fetchTokenAnalysis(token);
        bot.sendMessage(chatId, formatAnalysisMessage(analysis), { parse_mode: "Markdown" });
    } catch (error) {
        console.error("Error fetching token analysis:", error);
        bot.sendMessage(chatId, `Error fetching data for ${token}. Try again later.`);
    }
});


function formatAnalysisMessage(analysis: any): string {
    return `
*Market Analysis for ${analysis.token || "Unknown Token"}*  
*Market Sentiment:* ${analysis.marketSentiment || "N/A"}  
*Risk Score:* ${analysis.riskScore || "N/A"}/10  
*Key Insights:* ${analysis.keyInsights || "No insights available"}  
*Last Updated:* ${new Date().toLocaleString()}
  `;
}


async function fetchTokenAnalysis(token: string): Promise<any> {
    
    const payload = { token };

    const response = await fetch(TRIGGER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
    }

    
    const data = await response.json();
    return data;
}

console.log("Telegram bot is running...");
