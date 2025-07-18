import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // Hiển thị trạng thái bot đang trả lời
    const loadingMsg = { sender: "bot", text: "Đang trả lời..." };
    setMessages([...newMessages, loadingMsg]);

    try {
      const res = await fetch("https://chatbot-deepseek-n99f.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setMessages([...newMessages, { sender: "bot", text: data.reply }]);
    } catch (error) {
      setMessages([...newMessages, { sender: "bot", text: "Lỗi server!" }]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">💌 Tư vấn Thiệp Cưới</div>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === "user" ? "user-message" : "bot-message"}>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Gửi</button>
      </div>
    </div>
  );
}

export default App;
