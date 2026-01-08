import React, { useState, useEffect, useRef } from "react";
import { FaSmile, FaPalette, FaPaperclip, FaPaperPlane } from "react-icons/fa";

// Sample bot conversation JSON
const botResponses = [
  { trigger: "hi", reply: "Hello! How can I help you today?" },
  { trigger: "hello", reply: "Hi there! 😊 How are you feeling today?" },
  { trigger: "help", reply: "Sure! Tell me what you need assistance with." },
  { trigger: "pattern", reply: "Ah, you are interested in patterns! 🎨 What kind do you like?" },
  { trigger: "bye", reply: "Goodbye! Hope to chat again soon. 🌟" },
];

const MessageSection = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", content: "Hello! I am your emotional support bot 🤖", type: "received", time: "Now" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle user sending a message
  const handleSend = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      content: newMessage,
      type: "sent",
      time: "Now",
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    // Bot responds after a short delay
    setTimeout(() => {
      const lower = userMessage.content.toLowerCase();
      const found = botResponses.find((b) => lower.includes(b.trigger));
      const botReply = found ? found.reply : "I'm not sure I understand, can you tell me more? 🤔";

      const botMessage = {
        id: messages.length + 2,
        sender: "bot",
        content: botReply,
        type: "received",
        time: "Now",
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 800);
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-900 rounded-2xl shadow-lg overflow-hidden p-4">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-thin mb-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex mb-4 ${msg.type === "sent" ? "justify-end" : ""}`}>
                {msg.type === "received" && (
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-emotion-green to-emotion-blue">B</div>
                  </div>
                )}
                <div className="message-bubble">
                  <div className={`p-4 shadow-sm rounded-2xl ${msg.type === "sent" ? "bg-primary text-white rounded-tr-none" : "bg-gray-800 text-gray-100 rounded-tl-none"}`}>
                    <p>{msg.content}</p>
                  </div>
                  <span className={`text-xs mt-1 ${msg.type === "sent" ? "text-gray-400 text-right mr-2" : "ml-2 text-gray-500"}`}>{msg.time}</span>
                </div>
                {msg.type === "sent" && (
                  <div className="flex-shrink-0 ml-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-emotion-blue to-emotion-purple">U</div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Input */}
          <div className="flex items-center space-x-3">
            <button className="w-10 h-10 flex items-center justify-center text-gray-200 hover:text-primary rounded-lg hover:bg-gray-800"><FaSmile /></button>
            <button className="w-10 h-10 flex items-center justify-center text-gray-200 hover:text-primary rounded-lg hover:bg-gray-800"><FaPalette /></button>
            <button className="w-10 h-10 flex items-center justify-center text-gray-200 hover:text-primary rounded-lg hover:bg-gray-800"><FaPaperclip /></button>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-gray-800 text-gray-100 rounded-xl focus:ring-2 focus:ring-primary resize-none max-h-32 min-h-[44px]"
            />
            <button onClick={handleSend} className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-xl hover:bg-primary/90"><FaPaperPlane /></button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MessageSection;
