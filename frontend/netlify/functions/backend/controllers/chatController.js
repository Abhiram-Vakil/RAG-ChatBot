import "dotenv/config";

import { CloudClient } from "chromadb";
import { InferenceClient } from "@huggingface/inference";
 
const client = new CloudClient();

const hf = new InferenceClient(process.env.HUGGING_FACE_API_KEY);

const COLLECTION_NAME = "RAG-DATA";
// Use the same embedding model as in the ingestion script
const EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2";

export const getMessages = (req, res) => {
  // This endpoint can be used to fetch chat history, but for now, it's static.
  res.json([{ from: "bot", text: "Hello! I'm a RAG chatbot. Ask me about RAG, ChromaDB, or Mistral." }]);
};

export const sendMessage = async (req, res) => {
  const { text: userInput } = req.body;

  if (!process.env.CHROMA_API_KEY || !process.env.CHROMA_TENANT || !process.env.CHROMA_DATABASE) {
    console.error("ChromaDB Cloud credentials not set in .env");
    return res.status(500).json({ error: "Server configuration error." });
  }

  if (!userInput) {
    return res.status(400).json({ error: "Message text is required" });
  }

  try {
    // 1. Retrieve relevant context from ChromaDB
    const collection = await client.getOrCreateCollection({ name: COLLECTION_NAME });
    const queryEmbedding = await hf.featureExtraction({
      model: EMBEDDING_MODEL,
      inputs: userInput,
    });

    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 2, // Get the top 2 most relevant documents
    });

    // Handle case where no documents are found
    if (results.documents.length === 0 || results.documents[0].length === 0) {
      // Respond gracefully instead of crashing
      res.json({ from: "bot", text: "I'm sorry, I don't have enough information in my knowledge base to answer that question." });
      return;
    }
    const context = results.documents[0].join("\n\n");

    // 2. Augment the prompt with the context
    const messages = [
      {
        role: "system",
        content: `You are a helpful assistant. Use the following context to answer the user's question. If you don't know the answer, just say that you don't know. Context: ${context}`,
      },
      { role: "user", content: userInput },
    ];

    // 3. Generate the response using Mistral 7B
    const chatCompletion = await hf.chatCompletion({
      provider: "featherless-ai",
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: messages,
      max_tokens: 250,
      temperature: 0.7,
    });

    res.json({ from: "bot", text: chatCompletion.choices[0].message.content?.trim() ?? "" });
  } catch (error) {
    console.error("Error processing message:", error);
    res.status(500).json({ error: "Failed to get a response from the bot." });
  }
};
