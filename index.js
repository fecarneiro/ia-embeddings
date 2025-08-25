import OpenAI from 'openai';
import { config } from 'dotenv';
import fs from 'node:fs/promises';
import { itemList } from './itemList.js';
config();

const openai = new OpenAI();
openai.apiKey = process.env.OPENAI_API_KEY;

// Create embedding list
async function createEmbeddingList(itemList) {
  try {
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: itemList,
      encoding_format: 'float',
    });

    const result = embedding.data;

    const itemWithEmbeddingRef = result.map((embedingObj, i) => ({
      item: itemList[i],
      embedding: embedingObj.embedding,
    }));

    await fs.writeFile(
      'result.json',
      JSON.stringify(itemWithEmbeddingRef, null, 2),
      'utf-8'
    );
    console.log('Embedding generated successfully.');
    return itemWithEmbeddingRef;
  } catch (err) {
    console.log(err);
  }
}

// User input
const userInput = 'maçã';

// Compare input with cosine similarity
async function compare(userInput, itemWithEmbeddingRef) {}

createEmbeddingList(itemList);
