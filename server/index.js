import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://thiepcuoi.pudfoods.com", // domain của bạn
        "X-Title": "ThiepCuoiOnlinePudFoods",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat:free",
        messages: [
          {
            role: "system",
            content: `
              Bạn là chatbot tư vấn thiệp cưới ONLINE. Luôn trả lời dựa trên thông tin sau:
              ✅ Đây là thiệp điện tử (không phải thiệp giấy), gửi qua link cá nhân hóa.
              ✅ Giá các gói dịch vụ:
                - Gói Thường: 169.000đ
                - Gói Pro: 289.000đ
                - Gói VIP: 510.000đ
                - Gói SVIP: 730.000đ
              ✅ Luôn trả lời chính xác theo bảng giá này, không được đưa ra giá khác.
              ✅ Hãy trả lời ngắn gọn, thân thiện, chuyên nghiệp.
              ✅ Nếu khách có nhu cầu đặt thiệp, hãy nhắc: "Liên hệ Zalo 0967021887".
            `
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
    console.error(error);
    res.status(500).json({ error: "API call failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
