# ia-embeddings (PoC)

Small proof of concept that generates OpenAI text embeddings for a list of items and finds the top-K most similar items to a query using cosine similarity (dot product on L2-normalized vectors).

## Features

- Generate embeddings using OpenAI (`text-embedding-3-large`).
- Save normalized embeddings to `result.json` (simple cache).
- Compare a query against saved embeddings and return top-K similar items.
- Minimal, easy-to-read Node.js code (ESM).

## Requirements

- Node.js (v18+ recommended)
- npm
- OpenAI API key

## Quick setup (Windows PowerShell)

```powershell
cd "c:\Users\felip\Desktop\ia-embeddings"
npm install openai dotenv
# Create .env with your key:
# OPENAI_API_KEY=sk-...
```

## Usage

Generate embeddings (or use cached file) and run a query:

```powershell
# Run with default query "chocolate and top 3 results
node index.js

# Or pass query and top-K
node index.js "pizza" 5
```

If you change `itemList` (in `itemList.js`) and want to regenerate embeddings, delete the cache then run:

```powershell
del .\result.json     # Windows PowerShell
# or on macOS / Linux:
# rm result.json
node index.js
```

## How it works (brief)

- `createEmbeddingList` requests embeddings for all items, normalizes them (L2), and saves to `result.json`.
- `compare` requests embedding for the user input, normalizes it, then computes dot product with each saved embedding. Since both are normalized, dot product = cosine similarity.
- Results are sorted and top-K items are returned.

## Tips / debugging

- For more stable semantics, use slightly longer phrases (e.g., "fresh fish") instead of single words.
- The script prints vector norms and a sample of dimensions for quick inspection — norms should be ≈ 1.
- This is a PoC: for hundreds/thousands of vectors consider using a vector DB / ANN index (Pinecone, Qdrant, Faiss, etc.).

## Files

- `index.js` — main script (generate and compare embeddings)
- `itemList.js` — array of items to embed
- `result.json` — auto-generated cache of normalized embeddings

##
