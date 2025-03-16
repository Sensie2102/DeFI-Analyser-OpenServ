/* eslint-disable prettier/prettier */
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();
import { DexTradeByTokensItem, BitqueryTransactionResponse } from "../interface/dexTradeGroup";

import { getDynamicWhaleThreshold } from "./thresholdCalculation";


import DEX_TRADES_QUERY from "../query/dexTradeQuery";

const BITQUERY_API_KEY = process.env.BITQUERY_API_KEY




const BITQUERY_API_URL = "https://streaming.bitquery.io/graphql";



async function fetchDexTrades(tokenTracked: string): Promise<DexTradeByTokensItem[]> {
    const variables = {
        network: "eth",
        token: tokenTracked
    };

    try {
        const response = await axios.post<BitqueryTransactionResponse>(
            BITQUERY_API_URL,
            { query: DEX_TRADES_QUERY, variables },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${BITQUERY_API_KEY || ""}`
                }
            }
        );
        console.log(response.data.errors)
        return response.data.data.EVM.DEXTradeByTokens;
    } catch (error) {
        console.error("Error fetching latest trades from Bitquery:", error);
        return [];
    }
}


export async function processDexTrades(token: string) {

    const dynamicThreshold = await getDynamicWhaleThreshold(token);

    const trades = await fetchDexTrades(token);
    console.log(`Fetched ${trades.length} DEX trades from Bitquery.\n`);
    console.log(`Using Whale Threshold: ${dynamicThreshold.toFixed(2)} USDT\n`);


    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);


    const whaleTrades = trades
        .filter(item => {
            const usdValue = parseFloat(item.Trade.AmountInUSD);
            const tradeTime = new Date(item.Block.allTime);
            return usdValue > dynamicThreshold && tradeTime >= oneHourAgo;
        })
        .sort((a, b) => new Date(b.Block.allTime).getTime() - new Date(a.Block.allTime).getTime());


    return {
        count: whaleTrades.length,
        trades: whaleTrades,
    };
}




