import OpenAI from 'openai';
import { config } from 'dotenv';
import fs from 'node:fs/promises';
import { itemList } from './itemList.js';
config();

const openai = new OpenAI();
openai.apiKey = process.env.OPENAI_API_KEY;

// Create embedding list
async function createEmbeddingList(inputList) {
  // try to reuse cached embeddings
  try {
    const raw = await fs.readFile('result.json', 'utf-8').catch(() => null);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.length === inputList.length) {
        console.log('Loaded embeddings from result.json (cache).');
        return parsed;
      }
    }
  } catch (e) {
    // ignore and recreate
  }

  try {
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: inputList,
    });
    const openaiResult = embedding.data;

    const embeddedItemList = openaiResult.map((embedingObj, i) => ({
      item: inputList[i],
      embedding: normalize(embedingObj.embedding),
    }));

    await fs.writeFile(
      'result.json',
      JSON.stringify(embeddedItemList, null, 2),
      'utf-8'
    );
    console.log('Embedding generated and saved to result.json.');
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
    });
    const userEmbedding = normalize(emb.data[0].embedding);

    // debug: check norms and sample dims
    console.log(
      'userEmbedding norm (should ≈1):',
      Math.hypot(...userEmbedding)
    );
    embeddedItemList.forEach((it) => {
      console.log(
        it.item,
        'norm:',
        Math.hypot(...it.embedding),
        'sample:',
        it.embedding.slice(0, 5)
      );
    });

    const scores = embeddedItemList.map((it) => ({
      item: it.item,
      score: dot(userEmbedding, it.embedding),
    }));

    const top = scores.sort((a, b) => b.score - a.score).slice(0, topK);
    console.log('Top similar items:', top);
    return top;
  } catch (err) {
    console.log(err);
    return [];
  }
}

// CLI input (ex: node index.js "peixe" 3)
const userInput = process.argv[2] ?? 'chocolate';
const topK = parseInt(process.argv[3], 10) || 3;

// run: create embeddings then compare
createEmbeddingList(itemList).then((list) => compare(userInput, list, topK));
