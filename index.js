import OpenAI from 'openai';
import { config } from 'dotenv';
import fs from 'node:fs/promises';
config();

const openai = new OpenAI();
openai.apiKey = process.env.OPENAI_API_KEY;

async function createEmbeddingList(itemList) {
  try {
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: itemList,
      encoding_format: 'float',
    });

    const result = embedding.data;

    const itemWithEmbeddingRef = result.map((embedingObj, i) => ({
      item: itemList[i],
      embedding: embedingObj.embedding,
    }));

    // Save output on new file
    await fs.writeFile(
      'result.json',
      JSON.stringify(itemWithEmbeddingRef, null, 2),
      'utf-8'
    );
    console.log('Embedding generated successfully.');
  } catch (err) {
    console.log(err);
  }
}

const itemList = ['shark', 'pizza', 'eleven'];

createEmbeddingList(itemList);
