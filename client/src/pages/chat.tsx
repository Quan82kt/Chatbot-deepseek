import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { chatApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Heart, Bot, User, Send, Info, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
}

export default function Chat() {
  const [message, setMessage] = useState("");
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  const { data: chatHistory } = useQuery({
    queryKey: ["/api/chat", sessionId],
    queryFn: () => chatApi.getChatHistory(sessionId),
    enabled: false, // We'll manage messages locally for better UX
  });

  const sendMessageMutation = useMutation({
    mutationFn: (messageText: string) => chatApi.sendMessage(messageText, sessionId),
    onMutate: async (messageText) => {
      // Add user message immediately
      const userMessage: Message = {
        id: Date.now(),
        content: messageText,
        sender: "user",
        timestamp: new Date().toISOString(),
      };
      setLocalMessages(prev => [...prev, userMessage]);
      setMessage("");
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    },
    onSuccess: (data) => {
      // Add bot response
      const botMessage: Message = {
        id: Date.now() + 1,
        content: data.response,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setLocalMessages(prev => [...prev, botMessage]);
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Không thể gửi tin nhắn. Vui lòng thử lại.",
        variant: "destructive",
      });
      console.error("Send message error:", error);
    },
  });

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;
    
    sendMessageMutation.mutate(trimmedMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const quickActions = [
    { text: "📱 Mẫu thiệp hot", message: "Xem các mẫu thiệp hot" },
    { text: "💰 Báo giá chi tiết", message: "Cho mình xem bảng giá các gói thiệp cưới" },
    { text: "📝 Hướng dẫn đặt", message: "Hướng dẫn cách đặt thiệp cưới online" },
    { text: "🎁 Ưu đãi hiện tại", message: "Có chương trình khuyến mãi nào không?" },
  ];

  // Add welcome message on mount
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 0,
      content: "Xin chào! Tôi là chatbot tư vấn thiệp cưới online của PudFoods. Chúng tôi chuyên thiết kế thiệp điện tử đẹp, gửi qua link cá nhân hóa với 4 gói: Normal (169k), Pro (289k), VIP (510k), SVIP (730k). Bạn muốn tìm hiểu gì về thiệp cưới online? 💕",
      sender: "bot",
      timestamp: new Date().toISOString(),
    };
    setLocalMessages([welcomeMessage]);
  }, []);

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-lg">
      {/* Chat Header */}
      <header className="bg-gradient-to-r from-wedding-pink to-pink-500 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Thiệp Cưới Online PudFoods</h1>
              <p className="text-sm text-pink-100 flex items-center">
                <span className="inline-block w-2 h-2 bg-wedding-success rounded-full mr-2"></span>
                Đang hoạt động
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <Info className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {localMessages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex animate-fade-in",
              msg.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
              {msg.sender === "bot" && (
                <div className="w-8 h-8 bg-gradient-to-br from-wedding-pink to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="text-white w-4 h-4" />
                </div>
              )}
              
              <div
                className={cn(
                  "rounded-2xl px-4 py-3",
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-wedding-pink to-pink-500 text-white rounded-tr-md"
                    : "bg-gray-100 rounded-tl-md"
                )}
              >
                <p className={cn(
                  "text-sm leading-relaxed whitespace-pre-wrap",
                  msg.sender === "user" ? "text-white" : "text-gray-800"
                )}>
                  {msg.content}
                </p>
                <span className={cn(
                  "text-xs mt-1 block",
                  msg.sender === "user" ? "text-pink-200" : "text-gray-500"
                )}>
                  {formatTime(msg.timestamp)}
                </span>
              </div>

              {msg.sender === "user" && (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="text-gray-600 w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {sendMessageMutation.isPending && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
              <div className="w-8 h-8 bg-gradient-to-br from-wedding-pink to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="text-white w-4 h-4" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0ms"}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "150ms"}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "300ms"}}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Chat Input */}
      <footer className="p-4 border-t bg-white">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              placeholder="Nhập tin nhắn của bạn..."
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              className="min-h-[48px] max-h-[120px] pr-12 resize-none focus:ring-2 focus:ring-wedding-pink focus:border-transparent"
              maxLength={500}
              rows={1}
            />
            <div className="absolute bottom-2 right-3 text-xs text-gray-400">
              {message.length}/500
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="bg-gradient-to-r from-wedding-pink to-pink-500 hover:shadow-lg transition-all duration-200 h-12 w-12 p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setMessage(action.message)}
              className="text-xs h-8 bg-gray-100 hover:bg-gray-200 border-gray-200"
            >
              {action.text}
            </Button>
          ))}
        </div>
      </footer>
    </div>
  );
}
