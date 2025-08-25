import OpenAI from 'openai';
import { config } from 'dotenv';
import fs from 'node:fs/promises';
import { itemList } from './itemList.js';
config();

const openai = new OpenAI();
openai.apiKey = process.env.OPENAI_API_KEY;

// Create embedding list
async function createEmbeddingList(inputList) {
  try {
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: inputList,
      encoding_format: 'float',
    });

    const openaiResult = embedding.data;

    const embeddedItemList = openaiResult.map((embedingObj, i) => ({
      item: inputList[i],
      embedding: embedingObj.embedding,
    }));

    await fs.writeFile(
      'result.json',
      JSON.stringify(embeddedItemList, null, 2),
      'utf-8'
    );
    console.log('Embedding generated successfully.');
    return embeddedItemList;
  } catch (err) {
    console.log(err);
  }
}

// normalize vector
function normalize(v) {
  const norm = Math.hypot(...v) || 1;
  return v.map((x) => x / norm);
}

// dot product
function dot(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

// User input
const userInput = 'maçã';

// Compare input with cosine similarity
async function compare(userInput, embeddedItemList) {}

createEmbeddingList(inputList);
