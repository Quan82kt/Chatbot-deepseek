import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { chatRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId } = chatRequestSchema.parse(req.body);
      
      // Store user message
      await storage.createChatMessage({
        content: message,
        sender: "user",
        sessionId,
      });

      // Call OpenRouter AI API
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "API key not configured" });
      }

      const requestBody = {
        "model": "deepseek/deepseek-chat:free",
        "messages": [
          {
            "role": "system",
            "content": "Bạn là chatbot tư vấn thiệp cưới ONLINE của PudFoods. Luôn nhấn mạnh đây là thiệp điện tử, gửi qua link cá nhân hóa, không phải in giấy. Trả lời ngắn gọn, thân thiện, chuyên nghiệp. Thông tin giá: Normal 169k, Pro 289k, VIP 510k, SVIP 730k. Tất cả các gói đều là thiệp điện tử với link cá nhân hóa."
          },
          {
            "role": "user",
            "content": message
          }
        ]
      };

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://thiepcuoi.pudfoods.com",
          "X-Title": "Thiep Cuoi Online PudFoods",
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API Error:", errorText);
        return res.status(500).json({ error: "Có lỗi xảy ra khi xử lý yêu cầu" });
      }

      const data = await response.json();
      const botResponse = data.choices[0].message.content;

      // Store bot response
      await storage.createChatMessage({
        content: botResponse,
        sender: "bot",
        sessionId,
      });

      res.json({ response: botResponse });
    } catch (error) {
      console.error("Chat endpoint error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data" });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get chat history
  app.get("/api/chat/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getChatMessages(sessionId);
      res.json({ messages });
    } catch (error) {
      console.error("Get chat history error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
