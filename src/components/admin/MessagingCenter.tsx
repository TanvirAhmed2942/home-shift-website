import React, { useState } from 'react';
import { MessageSquare, Send, Search, Filter, User, Truck, Clock, CheckCheck, Paperclip, Smile, MoreVertical, Star, Archive, Trash2, Phone, Video } from 'lucide-react';

interface Message {
  id: string;
  sender: 'admin' | 'customer' | 'driver';
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participantType: 'customer' | 'driver';
  participantName: string;
  participantId: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: 'active' | 'archived';
  avatar: string;
}

export function MessagingCenter() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'customer' | 'driver'>('all');

  const conversations: Conversation[] = [
    {
      id: '1',
      participantType: 'customer',
      participantName: 'John Smith',
      participantId: 'C-12345',
      lastMessage: 'When will the driver arrive?',
      timestamp: '2 min ago',
      unread: 2,
      status: 'active',
      avatar: 'JS'
    },
    {
      id: '2',
      participantType: 'driver',
      participantName: 'Mike Johnson',
      participantId: 'D-789',
      lastMessage: 'Job completed successfully',
      timestamp: '15 min ago',
      unread: 0,
      status: 'active',
      avatar: 'MJ'
    },
    {
      id: '3',
      participantType: 'customer',
      participantName: 'Sarah Williams',
      participantId: 'C-67890',
      lastMessage: 'Thank you for the great service!',
      timestamp: '1 hour ago',
      unread: 1,
      status: 'active',
      avatar: 'SW'
    },
    {
      id: '4',
      participantType: 'driver',
      participantName: 'David Brown',
      participantId: 'D-456',
      lastMessage: 'Need help with route',
      timestamp: '2 hours ago',
      unread: 3,
      status: 'active',
      avatar: 'DB'
    },
    {
      id: '5',
      participantType: 'customer',
      participantName: 'Emily Davis',
      participantId: 'C-11223',
      lastMessage: 'Can I reschedule?',
      timestamp: '3 hours ago',
      unread: 0,
      status: 'active',
      avatar: 'ED'
    }
  ];

  const messages: { [key: string]: Message[] } = {
    '1': [
      {
        id: 'm1',
        sender: 'customer',
        senderName: 'John Smith',
        content: 'Hi, I have a question about my booking',
        timestamp: '10:30 AM',
        read: true
      },
      {
        id: 'm2',
        sender: 'admin',
        senderName: 'Admin',
        content: 'Hello John! How can I help you today?',
        timestamp: '10:32 AM',
        read: true
      },
      {
        id: 'm3',
        sender: 'customer',
        senderName: 'John Smith',
        content: 'When will the driver arrive?',
        timestamp: '10:35 AM',
        read: false
      }
    ],
    '2': [
      {
        id: 'm4',
        sender: 'driver',
        senderName: 'Mike Johnson',
        content: 'Just finished the job at 123 Main St',
        timestamp: '09:45 AM',
        read: true
      },
      {
        id: 'm5',
        sender: 'admin',
        senderName: 'Admin',
        content: 'Great work Mike! Please upload the completion photos.',
        timestamp: '09:50 AM',
        read: true
      },
      {
        id: 'm6',
        sender: 'driver',
        senderName: 'Mike Johnson',
        content: 'Job completed successfully',
        timestamp: '10:20 AM',
        read: true
      }
    ]
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.participantId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || conv.participantType === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedConversation) {
      // Handle sending message
      setMessageInput('');
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Messaging Center</h1>
          <p className="text-slate-600 mt-1">Communicate with customers and drivers</p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden" style={{ height: 'calc(100vh - 250px)' }}>
        <div className="flex h-full">
          {/* Conversations List - Left Sidebar */}
          <div className="w-80 border-r border-slate-200 flex flex-col">
            {/* Search & Filter */}
            <div className="p-4 border-b border-slate-200 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Filter Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filterType === 'all'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('customer')}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filterType === 'customer'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Customers
                </button>
                <button
                  onClick={() => setFilterType('driver')}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filterType === 'driver'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Drivers
                </button>
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors text-left ${
                    selectedConversation === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      conv.participantType === 'customer' 
                        ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                        : 'bg-gradient-to-br from-green-500 to-emerald-600'
                    }`}>
                      {conv.avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-slate-900 truncate">{conv.participantName}</h3>
                        <span className="text-xs text-slate-500">{conv.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        {conv.participantType === 'customer' ? (
                          <User className="w-3 h-3 text-purple-600" />
                        ) : (
                          <Truck className="w-3 h-3 text-green-600" />
                        )}
                        <span className="text-xs text-slate-500">{conv.participantId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-600 truncate">{conv.lastMessage}</p>
                        {conv.unread > 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area - Right Side */}
          <div className="flex-1 flex flex-col">
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        selectedConv.participantType === 'customer' 
                          ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                          : 'bg-gradient-to-br from-green-500 to-emerald-600'
                      }`}>
                        {selectedConv.avatar}
                      </div>
                      <div>
                        <h2 className="font-semibold text-slate-900">{selectedConv.participantName}</h2>
                        <div className="flex items-center gap-2">
                          {selectedConv.participantType === 'customer' ? (
                            <User className="w-3 h-3 text-purple-600" />
                          ) : (
                            <Truck className="w-3 h-3 text-green-600" />
                          )}
                          <span className="text-xs text-slate-600">{selectedConv.participantId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-white rounded-lg transition-colors">
                        <Phone className="w-5 h-5 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-white rounded-lg transition-colors">
                        <Video className="w-5 h-5 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-white rounded-lg transition-colors">
                        <Star className="w-5 h-5 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-white rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-slate-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                  {currentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-md ${message.sender === 'admin' ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            message.sender === 'admin'
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                              : 'bg-white text-slate-900 border border-slate-200'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div className={`flex items-center gap-2 mt-1 ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-xs text-slate-500">{message.timestamp}</span>
                          {message.sender === 'admin' && (
                            <CheckCheck className={`w-4 h-4 ${message.read ? 'text-blue-600' : 'text-slate-400'}`} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-200 bg-white">
                  <div className="flex items-end gap-3">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <Paperclip className="w-5 h-5 text-slate-600" />
                    </button>
                    
                    <div className="flex-1 relative">
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <Smile className="w-5 h-5 text-slate-600" />
                    </button>

                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Select a conversation</h3>
                  <p className="text-slate-600">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
