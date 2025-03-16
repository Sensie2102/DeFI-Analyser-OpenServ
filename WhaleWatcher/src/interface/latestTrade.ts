/* eslint-disable prettier/prettier */
export interface LatestTrade {
    Block: {
        allTime: string;
    };
    Trade: {
        Dex: {
            OwnerAddress: string;
            ProtocolFamily: string;
            ProtocolName: string;
        };
        Currency: {
            Symbol: string;
            SmartContract: string;
            Name: string;
        };
        Price: number;
        AmountInUSD: string; // Provided as string; we'll convert to number.
        Amount: string; // Provided as string; we'll convert to number.
        Side: {
            Type: string;
            Currency: {
                Symbol: string;
                SmartContract: string;
                Name: string;
            };
            AmountInUSD: string; // Provided as string.
            Amount: string; // Provided as string.
        };
    };
}

export interface BitqueryLatestTradesResponse {
    data: {
        EVM: {
            DEXTradeByTokens: LatestTrade[];
        };
    };
}