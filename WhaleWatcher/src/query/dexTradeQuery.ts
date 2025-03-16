/* eslint-disable prettier/prettier */
const DEX_TRADES_QUERY = `query LatestTrades($network: evm_network, $token: String) {
    EVM(network: $network) {
      DEXTradeByTokens(
        orderBy: {descending: Block_Time}
        limit: {count: 150}
        where: {Trade: {Currency: {SmartContract: {is: $token}}, Price: {gt: 0}}}
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
          AmountInUSD
          Buyer
          Seller
          Side {
            Type
            Buyer
            Seller
          }
          Price
          Amount
          Side {
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
  `

export default DEX_TRADES_QUERY;