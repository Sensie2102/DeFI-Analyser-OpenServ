import { z } from 'zod'
import { Agent } from '@openserv-labs/sdk'
import 'dotenv/config';
import { buildSummaryPrompt, generateSummary } from './summarize';
const agent = new Agent({
    systemPrompt: 'You are an agent that returns the summary for the token symbol whose related data like whale transactions and Sentiment analysis is given to you.'
})


agent.addCapability({
    name: 'summarize',
    description: 'Summarizes the given data for the token for better market understanding.',
    schema: z.object({
        whaleTs: z.string(),
        sentimentAnalysis: z.string()
    }),
    async run({ args }) {
        const prompt = buildSummaryPrompt(args.whaleTs, args.sentimentAnalysis)
        const response = await generateSummary(prompt);
        return JSON.stringify(response);
    }
})


agent.start()