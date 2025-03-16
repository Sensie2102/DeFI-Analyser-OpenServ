/* eslint-disable prettier/prettier */
export interface DexTradeByTokensItem {
    Block: {
        allTime: string;
    };
    Trade: {
        Dex: {
            OwnerAddress: string;
            ProtocolFamily: string;
            ProtocolName: string;
        };
        AmountInUSD: string;
        Buyer: string | null;
        Seller: string | null;
        Side: {
            Type: string;
            Buyer: string | null;
            Seller: string | null;
            Currency: {
                Symbol: string;
                SmartContract: string;
                Name: string;
            };
            AmountInUSD: string;
            Amount: string;
        };
        Price: number;
        Amount: string;
    };
}

export interface BitqueryTransactionResponse {
    data: {
        EVM: {
            DEXTradeByTokens: DexTradeByTokensItem[];
        };
    };
    errors?: { message: any }
}

