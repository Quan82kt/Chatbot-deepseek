import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// Đường dẫn gốc của dự án
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve thư mục build React
app.use(express.static(path.join(__dirname, "client/dist")));

// API Chatbot
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: "Message is required" });

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://thiepcuoi.pudfoods.com",
        "X-Title": "thiep cuoi online pudfoods"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat:free",
        messages: [
          {
            role: "system",
            content:
              "Bạn là chatbot tư vấn thiệp cưới ONLINE. Gói thường 169k, Pro 289k, VIP 510k, SVIP 730k. Nếu khách cần đặt thiệp thì hướng dẫn liên hệ Zalo 0967021887."
          },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "No response from OpenRouter", raw: data });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("❌ API Error:", error);
    res.status(500).json({ error: "API call failed", detail: error.message });
  }
});

// Fallback cho React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
