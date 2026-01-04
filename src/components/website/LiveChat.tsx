import React, { useState } from 'react';
import { MessageCircle, X, Send, User, Clock, Phone } from 'lucide-react';

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot' as const,
      text: 'Hello! 👋 Welcome to ShiftMyHome. How can we help you today?',
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      text: message,
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Auto-reply simulation
    setTimeout(() => {
      const botReply = {
        id: messages.length + 2,
        type: 'bot' as const,
        text: 'Thanks for your message! A team member will respond shortly. For immediate assistance, please call us at 0800 123 4567.',
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botReply]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[340px] md:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col animate-in slide-in-from-right-4 duration-300 border border-slate-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 rounded-t-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '20px 20px'
            }} />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">Live Chat</div>
                  <div className="text-xs opacity-75">We typically reply in minutes</div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all p-2 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-4 py-2.5 rounded-xl ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-800'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                  <div className={`flex items-center gap-1 mt-1 px-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-500">{msg.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-slate-200 bg-white">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full font-medium transition-all whitespace-nowrap">
                Get a quote
              </button>
              <button className="px-3 py-1.5 text-xs bg-cyan-50 text-cyan-700 hover:bg-cyan-100 rounded-full font-medium transition-all whitespace-nowrap">
                Services info
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-2.5 rounded-xl transition-all shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all z-50 group flex items-center gap-2 pl-6"
        title="Live Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <span className="font-bold hidden md:inline">Live Chat</span>
            <MessageCircle className="w-6 h-6" />
            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
              1
            </div>
          </>
        )}
      </button>
    </>
  );
}
