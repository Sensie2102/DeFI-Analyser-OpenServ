import { z } from 'zod'
import { Agent } from '@openserv-labs/sdk'
import 'dotenv/config'
import { fetchRecentPostsForCurrency } from './util/fetchData'
import { buildSummaryPrompt, generateSummary } from './util/getSummary'

const agent = new Agent({
  port: 8000,
  systemPrompt: 'You are an agent that returns the social media from multiple sources data for a token symbol provided to you.'
})


agent.addCapability({
  name: 'getMediaData',
  description: 'Gets the social media data from various sources by the token symbol provided.',
  schema: z.object({
    tokenSymbol: z.string(),
  }),
  async run({ args }) {
    try {

      const posts = await fetchRecentPostsForCurrency(args.tokenSymbol);
      // console.log("Fetched Posts:", posts);


      const prompt = buildSummaryPrompt(posts);
      // console.log("Prompt for summarization:\n", prompt);


      const summary = await generateSummary(prompt);
      console.log("Generated Summary:\n", summary);
      return summary;
    } catch (error) {
      console.error("Error during processing:", error);
      return "An error occurred while processing";
    }
  }
})


agent.start()