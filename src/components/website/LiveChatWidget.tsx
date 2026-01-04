import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageCircle,
  X,
  Send,
  Paperclip,
  Smile,
  MinimizeIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
  read?: boolean;
}

export function LiveChatWidget({ trigger }: { trigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to ShiftMyHome. How can I help you today? 👋",
      sender: "agent",
      timestamp: new Date(),
      read: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
      read: true,
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate agent typing
    setIsTyping(true);
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutomatedResponse(inputValue),
        sender: "agent",
        timestamp: new Date(),
        read: false,
      };
      setMessages((prev) => [...prev, agentResponse]);
      setIsTyping(false);
      if (isMinimized) {
        setUnreadCount((prev) => prev + 1);
      }
    }, 1500);
  };

  const getAutomatedResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    if (
      msg.includes("price") ||
      msg.includes("cost") ||
      msg.includes("quote")
    ) {
      return "I'd be happy to help with pricing! Our rates vary based on distance and items. You can get an instant quote using our booking form. Would you like me to guide you there?";
    }
    if (msg.includes("track") || msg.includes("order")) {
      return 'You can track your order in real-time from your customer dashboard. Just log in and click on "Track Order". Is there anything specific you\'d like to know?';
    }
    if (msg.includes("cancel") || msg.includes("refund")) {
      return "Our cancellation policy allows free cancellation up to 24 hours before pickup. For cancellations within 24 hours, a 50% fee applies. Would you like to proceed with a cancellation?";
    }
    if (msg.includes("driver") || msg.includes("vehicle")) {
      return "All our drivers are fully vetted and insured. We have vans ranging from small (up to 10m³) to large (up to 25m³). What size vehicle do you need?";
    }
    return "Thank you for your message! A member of our team will respond shortly. In the meantime, you can explore our FAQ section or get an instant quote. How else can I assist you?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickReplies = [
    "Get a quote",
    "Track my order",
    "Cancellation policy",
    "Talk to agent",
  ];

  return (
    <>
      {/* Chat Button */}
      {trigger && React.isValidElement(trigger) ? (
        React.cloneElement(trigger as React.ReactElement, {
          onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            setIsOpen(true);
            if ((trigger as React.ReactElement).props.onClick) {
              (trigger as React.ReactElement).props.onClick(e);
            }
          },
        })
      ) : !trigger ? (
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed bottom-6 right-6 z-[9998]"
            >
              <Button
                onClick={() => setIsOpen(true)}
                className="h-16 cursor-pointer w-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl relative"
              >
                <MessageCircle className="w-7 h-7 text-white" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 text-white p-0 flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      ) : null}

      {/* Chat Window */}
      {isOpen &&
        createPortal(
          <AnimatePresence mode="wait">
            <motion.div
              key="chat-window"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-6 right-6 z-[9999] w-full max-w-md"
            >
              <Card className=" flex flex-col h-[600px] max-h-[80vh] overflow-hidden bg-white dark:bg-gray-900 shadow-2xl border-2 border-purple-500/20">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-white">
                        <AvatarFallback className="bg-white text-purple-600">
                          SM
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></span>
                    </div>
                    <div>
                      <p className="font-semibold text-white tex-lg leading-tight flex flex-col gap-2">
                        ShiftMyHome Support
                        <span className="text-xs text-purple-100">
                          Online • Typically replies instantly
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setIsOpen(false);
                        setUnreadCount(0);
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                {!isMinimized && (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                              message.sender === "user"
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.sender === "user"
                                  ? "text-purple-100"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white dark:bg-gray-700 rounded-2xl px-4 py-3">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                              <span
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></span>
                              <span
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Replies */}
                    {messages.length === 1 && (
                      <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          Quick replies:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {quickReplies.map((reply) => (
                            <button
                              key={reply}
                              onClick={() => {
                                setInputValue(reply);
                                setTimeout(() => handleSendMessage(), 100);
                              }}
                              className="px-3 py-1.5 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                            >
                              {reply}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Input */}
                    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <Paperclip className="w-5 h-5 text-gray-500" />
                        </Button>
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message..."
                          className="flex-1 border-gray-300 dark:border-gray-600"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <Smile className="w-5 h-5 text-gray-500" />
                        </Button>
                        <Button
                          onClick={handleSendMessage}
                          disabled={!inputValue.trim()}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 !bg-gradient-to-r"
                          style={{
                            background: inputValue.trim()
                              ? "linear-gradient(to right, #9333ea, #db2777)"
                              : undefined,
                          }}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
