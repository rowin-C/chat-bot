import { createClient } from "@supabase/supabase-js";
import { Configuration, OpenAIApi } from "openai";
import "dotenv/config";

//Initiate subase client
const supabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// genete embedding
async function generateEmbedding() {
  // initalize open ai
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  // create some custom data

  const documents = [
    "saubhagya is Btech student",
    "saubhaagya is doing Btech from IIIT kancheepuram",
    "saubhagya is from Bengal",
    "saubhagya is from Kolkata",
    "saubagya has a knack for designing",
    "saubhagya is a web developer and software developer",
  ];

  for (const document of documents) {
    const input = document.replace(/\n/g, "");
    // turn each string into embedding

    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002", // model to use
      input,
    });

    const [{ embedding }] = embeddingResponse.data.data;

    //store the embedding and text in a database

    await supabaseClient.from("documents").insert({
      content: document,
      embedding,
    });
  }
}

// to generate embedding

// generateEmbedding();

// / ask-custom-data  ->

async function askQuestion() {
  const { data, error } = await supabaseClient.functions.invoke(
    "ask-custom-data",
    {
      body: JSON.stringify({ query: "Who is saubhagya" }),
    }
  );
  console.log(data);
  console.log(error);
}

askQuestion();
