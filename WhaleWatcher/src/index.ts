/* eslint-disable prettier/prettier */
import { z } from 'zod'
import { Agent } from '@openserv-labs/sdk'
import 'dotenv/config'
import { processDexTrades } from './util/whaleTransactions'
import { getTokenAddressByName } from './util/getTokenAddress'



const agent = new Agent({
  port: 3000,
  systemPrompt: 'You are an agent that returns the whale transaction for the token provided to you.'
})


agent.addCapability({
  name: 'getWhaleTransactions',
  description: 'Gets the whale transactions for crypto currency specified by the token symbol string',
  schema: z.object({
    token: z.string(),
  }),
  async run({ args }) {
    try {
      console.log(args.token)
      const tokenAddress = await getTokenAddressByName(args.token);

      if (!tokenAddress) {
        console.error("Token not found.");
        return "Token not found.";
      }

      const result = await processDexTrades(tokenAddress);
      return JSON.stringify(result, null, 2);
    }
    catch (error) {
      return `Error getting whale transactions ${error}`
    }
  }
})


agent.start()

