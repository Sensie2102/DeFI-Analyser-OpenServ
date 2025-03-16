/* eslint-disable prettier/prettier */
const LATEST_TRADES_QUERY = `
query LatestTrades($network: evm_network, $token: String, $base: String) {
  EVM(network: $network) {
    DEXTradeByTokens(
      orderBy: {descending: Block_Time}
      limit: {count: 50}
      where: {
        Trade: {
          Side: {Amount: {gt: "0"}, Currency: {SmartContract: {is: $base}}}, 
          Currency: {SmartContract: {is: $token}},
          Price: {gt: 0}
        }
      }
    ) {
      Block {
        allTime: Time
      }
      Trade {
        Dex {
          OwnerAddress
          ProtocolFamily
          ProtocolName
        }
        Currency {
          Symbol
          SmartContract
          Name
        }
        Price
        AmountInUSD
        Amount
        Side {
          Type
          Currency {
            Symbol
            SmartContract
            Name
          }
          AmountInUSD
          Amount
        }
      }
    }
  }
}
`;

export default LATEST_TRADES_QUERY