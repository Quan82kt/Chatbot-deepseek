import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve React build
app.use(express.static(path.join(__dirname, "client/dist")));

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: "Message is required" });

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat:free",
        messages: [
          { role: "system", content: "Bạn là chatbot tư vấn thiệp cưới ONLINE." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    if (!data.choices || !data.choices[0]) return res.status(500).json({ error: "Invalid response" });
    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "API call failed", detail: error.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
