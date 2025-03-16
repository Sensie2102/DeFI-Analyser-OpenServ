import fetch from "node-fetch";
import * as dotenv from "dotenv";

dotenv.config();




export function buildSummaryPrompt(posts:string, whaleTs:string): string {
    const prompt = `You are a financial analysis assistant.
Given the following posts regarding cryptocurrency market sentiment, generate a concise summary that highlights key market signals regarding the token, overall sentiment, and any notable insights:

${posts}

Use the following Whale Transactions to assist you: ${whaleTs}
Provide your summary in a clear, concise, and actionable format.
Summary:`;
    return prompt;
}


export async function generateSummary(prompt: string): Promise<string> {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + process.env.HUGGING_FACE_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: prompt }),
        }
    );

    const json = await response.json();

    if (Array.isArray(json) && json.length > 0 && json[0].generated_text) {
        return json[0].generated_text;
    }
    return JSON.stringify(json);
}



