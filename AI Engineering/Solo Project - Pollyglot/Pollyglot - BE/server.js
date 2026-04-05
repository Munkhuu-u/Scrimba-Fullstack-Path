import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
  baseURL: process.env.OPENAI_URL,
});

const messages = [
  {
    role: "system",
    content:
      "You are translation assistant, Reply with only exact Translations to give language",
  },
];

app.post("/api/translation", async (req, res) => {
  console.log("req: ", req.body);

  messages.push({
    role: "user",
    content: `"${req.body.originalText}" to ${req.body.language}`,
  });

  const response = await openai.chat.completions.create({
    model: process.env.MODEL_AI,
    messages,
  });

  const data = response.choices[0].message.content;

  console.log("data: ", data);

  res.json({
    translated: data,
  });
});

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "127.0.0.1";

const server = app.listen(PORT, HOST);

server.on("listening", () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

server.on("error", (error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
