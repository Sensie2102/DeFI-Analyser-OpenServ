import fetch from "node-fetch";
import * as dotenv from "dotenv";
import { fetchRecentPostsForCurrency } from "./fetchData";
dotenv.config();

interface Post {
    title: string;
    published_at: string;
    slug: string;
    currencies: any[];
    id: number;
    url: string;
    created_at: string;
    votes: {
        negative: number;
        positive: number;
        important: number;
        liked: number;
        disliked: number;
        lol: number;
        toxic: number;
        saved: number;
        comments: number;
    };
}




export function buildSummaryPrompt(posts: Post[]): string {
    const postsText = posts
        .map((post, index) => {
            return `Post ${index + 1}:
Title: ${post.title}
Published At: ${post.published_at}
URL: ${post.url}\n`;
        })
        .join("\n");


    const prompt = `You are a financial analysis assistant.
Given the following posts regarding cryptocurrency market sentiment, generate a concise summary that highlights key market signals regarding the token, overall sentiment, and any notable insights:

${postsText}

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



