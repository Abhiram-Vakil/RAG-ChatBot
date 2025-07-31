import { CloudClient } from "chromadb";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import "dotenv/config";

if (!process.env.CHROMA_API_KEY || !process.env.CHROMA_TENANT || !process.env.CHROMA_DATABASE) {
  throw new Error("ChromaDB Cloud credentials are not set in .env file. Please set CHROMA_API_KEY, CHROMA_TENANT, and CHROMA_DATABASE.");
}

// CloudClient automatically reads CHROMA_API_KEY, CHROMA_TENANT, and CHROMA_DATABASE from process.env
const client = new CloudClient();

// Using a sentence-transformer model for creating embeddings
const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGING_FACE_API_KEY,
  model: "sentence-transformers/all-MiniLM-L6-v2",
  endpoint: "https://api-inference.huggingface.co",
});

const COLLECTION_NAME = "RAG-DATA";

async function ingestData() {
  console.log("Starting data ingestion...");
  
  // 1. Get or create the collection. This is idempotent and safe to run multiple times.
  const collection = await client.getOrCreateCollection({
    name: COLLECTION_NAME,
  });
  console.log(`Using collection '${COLLECTION_NAME}'.`);

  // 3. Prepare your documents
  const documents = [
    "The RAG model combines retrieval with generation for better AI responses.",
    "ChromaDB is a vector database used for storing and querying embeddings.",
    "Mistral 7B is a powerful large language model from Mistral AI.",
    "Hugging Face provides APIs to easily use many different AI models.",
    "To build a RAG system, you need a retriever, a knowledge base, and a generator.",
  ];

  // 4. Create embeddings for the documents
  const documentEmbeddings = await embeddings.embedDocuments(documents);
  console.log("Document embeddings created.");

  // 5. Upsert documents and their embeddings. This is idempotent.
  await collection.upsert({
    ids: documents.map((_, i) => `doc${i + 1}`), // Unique IDs for each document
    embeddings: documentEmbeddings,
    documents: documents,
  });

  console.log(`Data ingestion complete! Upserted ${documents.length} documents to the '${COLLECTION_NAME}' collection.`);
}

ingestData().catch(console.error);