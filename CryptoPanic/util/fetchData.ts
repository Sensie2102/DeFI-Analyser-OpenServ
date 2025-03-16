import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const CRYPTO_AUTH_TOKEN = process.env.CRYPTO_PANIC_API_KEY;
const CRYPTO_PANIC_BASE_URL = "https://cryptopanic.com/api/free/v1/posts/";

export async function fetchRecentPostsForCurrency(tokenSymbol: string) {
    try {
        const pagesToFetch = 3; 
        let combinedPosts: any[] = [];


        for (let page = 1; page <= pagesToFetch; page++) {
            const response = await axios.get(CRYPTO_PANIC_BASE_URL, {
                params: {
                    auth_token: CRYPTO_AUTH_TOKEN,
                    currencies: tokenSymbol.toUpperCase(),
                    page: page, 
                },
                paramsSerializer: (params) =>
                    new URLSearchParams(params).toString(),
            });

            const posts = response.data?.results ?? [];
            console.log(`Page ${page}: Fetched ${posts.length} posts.`);
            combinedPosts = combinedPosts.concat(posts);
        }

        if (!Array.isArray(combinedPosts)) {
            console.log("No valid results found.");
            return [];
        }

        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const filteredPosts = combinedPosts.filter((post) => {
            if (!post.published_at) return false;
            const postTime = new Date(post.published_at).getTime();
            return (now - postTime) <= oneDay;
        });

        const limitedPosts = filteredPosts.slice(0, 50);

        console.log(`Fetched a total of ${combinedPosts.length} posts, kept ${limitedPosts.length} posted in the last 24h.`);
        return limitedPosts;
    } catch (err: any) {
        console.error("Axios Error:", err.response?.data || err.message);
        return [];
    }
}
