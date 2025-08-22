import OpenAI from 'openai';
import { config } from 'dotenv';
import fs from 'node:fs/promises';
config();

const openai = new OpenAI();
openai.apiKey = process.env.OPENAI_API_KEY;

async function createEmbedding(inputFile) {
  try {
    // 1. Receive input
    const inputData = await fs.readFile(inputFile, 'utf-8');
    // 2. Call openai embedding API
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: inputData,
      encoding_format: 'float',
    });
    // 3. Save output on new file
    await fs.writeFile('result.txt', JSON.stringify(embedding), 'utf-8');
    console.log('Embedding generated successfully.');
  } catch (err) {
    console.log(err);
  }
}

createEmbedding('example.txt');
