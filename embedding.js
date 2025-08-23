import OpenAI from 'openai';
import { config } from 'dotenv';
config();

const openai = new OpenAI();
openai.apiKey = process.env.OPENAI_API_KEY;


async function main() {
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: "word",
      encoding_format: 'float',
    });
    console.log(embedding)
}

main();