import { openai, supabase } from "./config.js";
import express from "express";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const app = express();
app.use(express.json());

app.post("/api/movieRecommendation", async (req, res) => {
  const { messages } = req.body;
  const content = messages?.[0]?.content || "";

  //   --------SPLIT--------
  //   const splitter = new RecursiveCharacterTextSplitter({
  //     chunkSize: 250,
  //     chunkOverlap: 30,
  //   });
  //   const chunkData = await splitter.splitText(content);
  //   --------EMBED--------
  const response = await openai.embeddings.create({
    input: content,
    model: "text-embedding-ada-002",
  });
  const embedding = response.data?.[0]?.embedding;
  //   --------SIMILARITY--------
  const { data, error } = await supabase.rpc("match_movies", {
    query_embedding: embedding,
    match_threshold: 0.3,
    match_count: 1,
  });
  if (error) console.error(error);
  const match = data?.[0]?.content;
  console.log("match: ", match);
  //   --------AI, API--------

  const movieResponse = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Separate all json keys and provide poster image of this movie. From content section remove movie name and duration only plot. Reply as JSON with quoted keys {title: "name (releaseYear)", ... , posterURL: "..."`,
      },
      {
        role: "user",
        content: match,
      },
    ],
    model: "gpt-4.1-mini",
  });
  const raw = movieResponse.choices[0].message.content;
  const clean = raw.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  const movie = JSON.parse(clean);

  res.json({ status: "Success", movie: movie });
  console.log("success");
});

const port = process.env.PORT || 3000;
const host = process.env.HOST || "127.0.0.1";

const server = app.listen(port, host);

server.on("listening", () => {
  console.log(`server running at http:/${host}:${port}`);
});

server.on("error", (error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
