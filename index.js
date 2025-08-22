import OpenAI from 'openai';
import { config } from 'dotenv';
config();

const openai = new OpenAI();
openai.apiKey = process.env.OPENAI_API_KEY;

const embedding = await openai.embeddings.create({
  model: 'text-embedding-3-large',
  input: 'taco de beisebol',
  encoding_format: 'float',
});

console.log(JSON.stringify(embedding.data));
