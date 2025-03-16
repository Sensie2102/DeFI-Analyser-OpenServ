/* eslint-disable prettier/prettier */
import axios from "axios";
import * as dotenv from "dotenv";
import LATEST_TRADES_QUERY from "../query/latestTradeQuery";
import { BitqueryLatestTradesResponse, LatestTrade } from '../interface/latestTrade'

dotenv.config();


const BITQUERY_API_URL = "https://streaming.bitquery.io/graphql";


async function fetchLatestTrades(token: string): Promise<LatestTrade[]> {
    const variables = {
        network: "eth",
        token: token,
        base: "0xdac17f958d2ee523a2206206994597c13d831ec7"
    };

    try {
        const response = await axios.post<BitqueryLatestTradesResponse>(
            BITQUERY_API_URL,
            { query: LATEST_TRADES_QUERY, variables },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.BITQUERY_API_KEY || ""}`
                }
            }
        );


        return response.data.data.EVM.DEXTradeByTokens.map(trade => ({
            Block: { allTime: trade.Block.allTime },
            Trade: {
                Dex: {
                    OwnerAddress: trade.Trade.Dex.OwnerAddress,
                    ProtocolFamily: trade.Trade.Dex.ProtocolFamily,
                    ProtocolName: trade.Trade.Dex.ProtocolName
                },
                Currency: {
                    Symbol: trade.Trade.Currency.Symbol,
                    SmartContract: trade.Trade.Currency.SmartContract,
                    Name: trade.Trade.Currency.Name
                },
                Price: trade.Trade.Price,
                AmountInUSD: trade.Trade.AmountInUSD,
                Amount: trade.Trade.Amount,
                Side: {
                    Type: trade.Trade.Side.Type,
                    Currency: {
                        Symbol: trade.Trade.Side.Currency.Symbol,
                        SmartContract: trade.Trade.Side.Currency.SmartContract,
                        Name: trade.Trade.Side.Currency.Name
                    },
                    AmountInUSD: trade.Trade.Side.AmountInUSD,
                    Amount: trade.Trade.Side.Amount
                }
            }
        }));
    } catch (error) {

        console.error("❌ Error fetching latest trades from Bitquery:", error);
        return [];
    }
}


export async function getDynamicWhaleThreshold(token: string): Promise<number> {
    const trades = await fetchLatestTrades(token);


    const tradeValues: number[] = trades
        .map(t => parseFloat(t.Trade.AmountInUSD))
        .filter(value => !isNaN(value) && value > 0);

    if (tradeValues.length === 0) {
        return 0;
    }


    tradeValues.sort((a, b) => a - b);


    const index = Math.floor(0.90 * tradeValues.length);
    const threshold = tradeValues[index];

    return threshold;
}
