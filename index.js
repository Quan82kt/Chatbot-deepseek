import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "client/dist")));

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://thiepcuoi.pudfoods.com",
        "X-Title": "thiep cuoi online pudfoods"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat:free",
        messages: [
          { role: "system", content: "Bạn là chatbot tư vấn thiệp cưới ONLINE. Gói thường 169k, Pro 289k, VIP 510k, SVIP 730k. Nếu khách cần đặt thiệp thì hướng dẫn liên hệ Zalo 0967021887." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices?.[0]?.message?.content || "Không có phản hồi từ AI" });
  } catch (err) {
    res.status(500).json({ error: "API error", detail: err.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
