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
      // normalize each embedding to allow dot product = cosine similarity
      embedding: normalize(embedingObj.embedding),
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
    return [];
  }
}

// normalize vector
function normalize(v) {
  const norm = Math.hypot(...v) || 1;
  return v.map((x) => x / norm);
}

// dot product (same length, normalized)
function dot(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

// Compare input with cosine similarity
async function compare(userInput, embeddedItemList, topK = 3) {
  try {
    const emb = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: userInput,
      encoding_format: 'float',
    });
    const userEmbedding = normalize(emb.data[0].embedding);

    const scores = embeddedItemList.map((it) => ({
      item: it.item,
      score: dot(userEmbedding, it.embedding), // since both normalized, dot = cosine
    }));

    const top = scores.sort((a, b) => b.score - a.score).slice(0, topK);

    console.log('Top similar items:', top);
    return top;
  } catch (err) {
    console.log(err);
    return [];
  }
}

// User input
const userInput = 'peixe';

// run: create embeddings then compare
createEmbeddingList(itemList).then((list) => compare(userInput, list));
