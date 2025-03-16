/* eslint-disable prettier/prettier */
interface Token {
    chainId: number;
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    logoURI: string;
}

interface TokenList {
    name: string;
    tokens: Token[];
}

export async function getTokenAddressByName(tokenSymbol: string): Promise<string | null> {
    const UNISWAP_TOKEN_LIST_URL = "https://tokens.uniswap.org";

    try {
        const response = await fetch(UNISWAP_TOKEN_LIST_URL);
        if (!response.ok) {
            console.error("Error fetching token list:", response.statusText);
            return null;
        }

        const tokenList = (await response.json()) as TokenList;
        const tokens = tokenList.tokens;


        const symbolName = tokenSymbol.toUpperCase();

        const matches = tokens.filter(
            (token) => token.chainId === 1 && token.symbol.toUpperCase() === symbolName
        );

        if (matches.length === 0) {
            return null;
        } else {
            return matches[0].address;
        }
    } catch (error) {
        console.error("Error during fetch:", error);
        return null;
    }
}
