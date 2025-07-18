import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { OPENROUTER_API_KEY } from "./config.js"; // ✅ Lấy API key từ file config.js

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Xác định đường dẫn thư mục hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve React build từ client/dist
app.use(express.static(path.join(__dirname, "../client/dist")));

// ✅ API Chat Route
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`, // ✅ Không dùng process.env nữa
        "HTTP-Referer": "https://thiepcuoi.pudfoods.com",
        "X-Title": "ThiepCuoiOnlinePudFoods",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat:free",
        messages: [
          {
            role: "system",
            content: "Bạn là chatbot tư vấn thiệp cưới ONLINE. Các gói dịch vụ: Thường 169k, Pro 289k, VIP 510k, SVIP 730k. Nếu khách muốn đặt thiệp, hướng dẫn liên hệ Zalo 0967021887."
          },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "No response from DeepSeek" });
    }

    res.json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error("❌ API call failed:", error);
    res.status(500).json({ error: "API call failed" });
  }
});

// ✅ Trả về React index.html cho tất cả route khác
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
