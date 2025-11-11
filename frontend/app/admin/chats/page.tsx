'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Trash2, Edit, CheckCircle, Mic } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Message {
  _id?: string;
  sender: 'user' | 'admin';
  message: string;
  messageType?: 'text' | 'voice' | 'emoji';
  timestamp: string;
  read?: boolean;
  edited?: boolean;
  deleted?: boolean;
  deletedFor?: 'none' | 'sender' | 'everyone';
  status?: 'sent' | 'delivered' | 'read'; // WhatsApp-like status
}

interface Chat {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  userName: string;
  userEmail: string;
  messages: Message[];
  status: 'active' | 'resolved' | 'pending';
  lastMessageAt: string;
  unreadCount: number;
  isUserTyping?: boolean; // Typing indicator
}

export default function AdminChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'resolved'>('all');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editMessageText, setEditMessageText] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isUserTyping, setIsUserTyping] = useState(false); // Track if user is typing
  const [isAdminTyping, setIsAdminTyping] = useState(false); // Track if admin is typing
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px tolerance
      setIsAtBottom(isAtBottom);
    }
  };

  const scrollToBottom = () => {
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  const scrollToTop = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Check admin access
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }
    
    const userData = JSON.parse(user);
    if (userData.role !== 'admin') {
      router.push('/');
      return;
    }

    loadChats();
    
    // Auto-refresh every 3 seconds for real-time updates
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    pollIntervalRef.current = setInterval(loadChats, 3000);
    
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [filter]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);

  useEffect(() => {
    // Only scroll to bottom when selected chat changes, not when messages update
    // This prevents auto-scrolling when new messages arrive while user is reading older messages
    if (selectedChat) {
      // Check if user is already at the bottom or if this is a new chat selection
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px tolerance
        
        // Only scroll to bottom if user is already at bottom or this is a new chat
        if (isAtBottom) {
          scrollToBottom();
        }
      } else {
        // Fallback to scrolling to bottom for new chat selections
        scrollToBottom();
      }
    }
  }, [selectedChat]);

  const loadChats = async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParam = filter !== 'all' ? `?status=${filter}` : '';
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/admin/all${queryParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setChats(data.chats);
        
        // Update selected chat if it exists
        if (selectedChat) {
          const updated = data.chats.find((c: Chat) => c._id === selectedChat._id);
          if (updated) {
            setSelectedChat(updated);
            // Set typing indicators
            setIsUserTyping(updated.isUserTyping || false);
          }
        }
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const markChatAsRead = async (chatId: string) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/admin/read/${chatId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Reload chats to update unread counts
        loadChats();
      }
    } catch (error) {
      console.error('Error marking chat as read:', error);
    }
  };

  // Function to send admin typing status
  const sendAdminTypingStatus = async (isTyping: boolean) => {
    if (!selectedChat) return;
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/admin/typing/${selectedChat._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isTyping })
      });
    } catch (error) {
      console.error('Error sending admin typing status:', error);
    }
  };

  // Handle reply input change with typing indicator
  const handleReplyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setReplyMessage(value);
    
    // Send typing status
    if (value.trim() && !isAdminTyping) {
      setIsAdminTyping(true);
      sendAdminTypingStatus(true);
    }
    
    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set new timeout to stop typing indicator after 1 second of inactivity
    const timeout = setTimeout(() => {
      if (isAdminTyping) {
        setIsAdminTyping(false);
        sendAdminTypingStatus(false);
      }
    }, 1000);
    
    setTypingTimeout(timeout);
  };

  const handleSelectChat = async (chat: Chat) => {
    // Immediately update the selected chat to provide instant feedback
    setSelectedChat(chat);
    
    // Mark messages as read when admin opens the chat
    try {
      await markChatAsRead(chat._id);
    } catch (error) {
      console.error('Error marking chat as read:', error);
    }
    
    // Hide chat options when switching chats
    setShowChatOptions(false);
    setSelectedMessageId(null);
    
    // Set isAtBottom to true when selecting a new chat
    setIsAtBottom(true);
    
    // Scroll to bottom after selecting chat
    scrollToBottom();
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedChat || sending) return;

    // Clear typing status immediately when sending message
    if (isAdminTyping) {
      setIsAdminTyping(false);
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      sendAdminTypingStatus(false);
    }

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/admin/reply/${selectedChat._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: replyMessage })
      });

      const data = await response.json();
      
      if (data.success) {
        setSelectedChat(data.chat);
        setReplyMessage('');
        loadChats();
      } else {
        alert(data.message || 'Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const updateChatStatus = async (chatId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/admin/status/${chatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      
      if (data.success) {
        loadChats();
        if (selectedChat && selectedChat._id === chatId) {
          setSelectedChat(data.chat);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const startEditingMessage = (messageId: string, messageText: string) => {
    // Check if message is within edit time limit (1 minute)
    if (selectedChat) {
      const message = selectedChat.messages.find(msg => msg._id === messageId);
      if (message) {
        const timeDiff = (new Date().getTime() - new Date(message.timestamp).getTime()) / 1000 / 60; // in minutes
        if (timeDiff > 1) {
          alert('Message can only be edited within 1 minute of sending');
          return;
        }
      }
    }
    
    setEditingMessageId(messageId);
    setEditMessageText(messageText);
    setSelectedMessageId(null);
  };

  const saveEditedMessage = async () => {
    if (!editingMessageId || !editMessageText.trim() || !selectedChat) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/admin/reply/${selectedChat._id}/${editingMessageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: editMessageText })
      });

      const data = await response.json();
      
      if (data.success) {
        setSelectedChat(data.chat);
        setEditingMessageId(null);
        setEditMessageText('');
        loadChats();
      } else {
        alert(data.message || 'Failed to edit message');
      }
    } catch (error) {
      console.error('Error editing message:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!selectedChat) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/admin/reply/${selectedChat._id}/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setSelectedChat(data.chat);
        loadChats();
      } else {
        alert(data.message || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const clearChat = async () => {
    if (!selectedChat) return;
    
    if (!window.confirm('Are you sure you want to clear this chat? This will only clear your view of the chat, not the user\'s view.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/admin/clear/${selectedChat._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setSelectedChat(data.chat);
        loadChats();
        setShowChatOptions(false);
        alert('Chat cleared successfully for you only. The user will still see the full chat history.');
      } else {
        alert(data.message || 'Failed to clear chat');
      }
    } catch (error) {
      console.error('Error clearing chat:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const playAudioMessage = (messageId: string, audioData: string) => {
    try {
      // Stop any currently playing audio
      if (playingAudioId) {
        const currentAudio = audioRefs.current[playingAudioId];
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
      }
      
      // Play the selected audio
      const audio = new Audio(audioData);
      audioRefs.current[messageId] = audio;
      
      audio.onplay = () => setPlayingAudioId(messageId);
      audio.onpause = () => setPlayingAudioId(null);
      audio.onended = () => setPlayingAudioId(null);
      
      audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      alert('Could not play audio message');
    }
  };

  // Render message status indicators (WhatsApp-like) with more distinct visuals
  const renderMessageStatus = (message: Message) => {
    if (message.sender !== 'admin') return null;
    
    switch (message.status) {
      case 'sent':
        return (
          <span className="text-xs text-gray-400 ml-1" title="Sent">
            ✓
          </span>
        );
      case 'delivered':
        return (
          <span className="text-xs text-gray-600 ml-1 font-bold" title="Delivered">
            ✓✓
          </span>
        );
      case 'read':
        return (
          <span className="text-xs text-blue-600 ml-1 font-bold animate-pulse" title="Seen">
            ✓✓
          </span>
        );
      default:
        return (
          <span className="text-xs text-gray-400 ml-1" title="Sent">
            ✓
          </span>
        );
    }
  };

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header - Simplified */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Buyer Messages</h1>
                <p className="text-sm text-gray-500">
                  {chats.length} total {totalUnread > 0 && `• ${totalUnread} new`}
                </p>
              </div>
            </div>
            
            {/* Simplified Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  filter === 'active'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
            </div>
          </div>
        </div>

        {/* Clean Chat Interface */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-200px)]">
            {/* Buyer List - Clean & Minimal */}
            <div className="border-r border-gray-200 overflow-y-auto bg-purple-50 min-h-0">
              {chats.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-gray-500 font-medium">No messages yet</p>
                  <p className="text-gray-400 text-sm mt-1">Buyers will appear here</p>
                </div>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => handleSelectChat(chat)}
                    className={`p-4 border-b border-gray-200 cursor-pointer transition-all duration-200 relative ${
                      selectedChat?._id === chat._id
                        ? 'bg-white border-l-4 border-l-purple-600 shadow-md transform scale-[1.02]'
                        : 'hover:bg-purple-50'
                    }`}
                  >
                    {selectedChat?._id === chat._id && (
                      <div className="absolute top-0 right-0 w-3 h-3 bg-purple-600 rounded-full"></div>
                    )}
                    {/* Buyer Info */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow">
                          {chat.userName[0].toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">{chat.userName}</h3>
                          <p className="text-xs text-gray-500 truncate max-w-[150px]">{chat.userEmail}</p>
                        </div>
                      </div>
                      {chat.unreadCount > 0 && (
                        <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold min-w-[24px] text-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    
                    {/* Last Message Preview */}
                    {chat.messages.length > 0 && (
                      <p className="text-sm text-gray-600 line-clamp-1 mb-1">
                        {chat.messages[chat.messages.length - 1].message}
                      </p>
                    )}
                    
                    {/* Time */}
                    <p className="text-xs text-gray-400">
                      {new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Chat Messages Area - Clean */}
            <div className="md:col-span-2 flex flex-col min-h-0">
              {selectedChat ? (
                <>
                  {/* Simple Chat Header */}
                  <div className="p-4 border-b bg-gradient-to-r from-purple-600 to-pink-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                          {selectedChat.userName[0].toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{selectedChat.userName}</h3>
                          <p className="text-xs text-purple-100">
                            {isUserTyping ? 'User is typing...' : selectedChat.userEmail}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <button
                            onClick={() => setShowChatOptions(!showChatOptions)}
                            className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 text-white font-semibold"
                          >
                            ⋮
                          </button>
                          
                          {showChatOptions && (
                            <div className="absolute top-10 right-0 bg-white rounded-lg shadow-lg p-1 border border-gray-200 z-10 w-40">
                              <button
                                onClick={clearChat}
                                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded w-full text-left text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                                Clear Chat
                              </button>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => updateChatStatus(selectedChat._id, 'resolved')}
                          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm transition flex items-center gap-2 text-white font-semibold"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Done
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages - Clean Design */}
                  <div 
                    ref={messagesContainerRef} 
                    className="flex-1 overflow-y-auto p-4 space-y-3 bg-purple-50 relative"
                    onScroll={handleScroll}
                  >
                    {selectedChat.messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'} relative`}
                      >
                        {editingMessageId === msg._id ? (
                          <div className="flex items-center gap-2 max-w-[75%]">
                            <input
                              type="text"
                              value={editMessageText}
                              onChange={(e) => setEditMessageText(e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              autoFocus
                            />
                            <button
                              onClick={saveEditedMessage}
                              className="bg-green-500 text-white px-2 py-2 rounded-lg"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingMessageId(null)}
                              className="bg-gray-500 text-white px-2 py-2 rounded-lg"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div
                            className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm relative transform transition-all duration-300 hover:scale-[1.02] ${
                                msg.sender === 'admin'
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm shadow-lg'
                                  : 'bg-white text-gray-900 rounded-bl-sm border border-purple-100'
                            }`}
                            onClick={() => {
                              if (msg.sender === 'admin' && !msg.deleted) {
                                setSelectedMessageId(selectedMessageId === msg._id ? null : msg._id!);
                              }
                            }}
                          >
                            {selectedMessageId === msg._id && (
                              <div className="absolute top-0 right-0 bg-white rounded-lg shadow-lg p-1 border border-gray-200 z-10">
                                <button
                                  onClick={() => startEditingMessage(msg._id!, msg.message)}
                                  className="flex items-center gap-2 px-2 py-1 text-sm hover:bg-gray-100 rounded w-full text-left"
                                >
                                  <Edit className="w-3 h-3" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    deleteMessage(msg._id!);
                                    setSelectedMessageId(null);
                                  }}
                                  className="flex items-center gap-2 px-2 py-1 text-sm hover:bg-gray-100 rounded w-full text-left text-red-500"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </button>
                              </div>
                            )}
                            {/* Check if message is deleted for the current user (admin) */}
                            {msg.deleted || (msg as any).deletedFor === 'everyone' || ((msg as any).deletedFor === 'sender' && msg.sender === 'admin') ? (
                              <p className="text-xs italic opacity-70">
                                {msg.message}
                                {msg.edited && <span className="ml-1">(edited)</span>}
                              </p>
                            ) : msg.messageType === 'emoji' ? (
                              <div className="text-3xl p-2">{msg.message}</div>
                            ) : msg.messageType === 'voice' ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => playAudioMessage(msg._id!, msg.message)}
                                  className="flex items-center gap-2"
                                >
                                  {playingAudioId === msg._id ? (
                                    <>
                                      <div className="w-6 h-6 flex items-center justify-center">
                                        <div className="w-1 h-4 bg-white mx-px animate-pulse"></div>
                                        <div className="w-1 h-6 bg-white mx-px animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-1 h-4 bg-white mx-px animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                      </div>
                                      <span className="text-xs">Playing...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Mic className="w-4 h-4" />
                                      <span className="text-sm">Voice message</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            ) : (
                              <p className="text-sm leading-relaxed">{msg.message}</p>
                            )}
                            <p className={`text-xs mt-1 flex items-center justify-between ${
                              msg.sender === 'admin' ? 'text-purple-100' : 'text-gray-400'
                            }`}>
                              <span>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                {msg.edited && <span className="ml-1">(edited)</span>}
                              </span>
                              {msg.sender === 'admin' && !msg.deleted && (
                                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  ⋮
                                </button>
                              )}
                              {renderMessageStatus(msg)}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                    {/* Typing indicator for user */}
                    {isUserTyping && (
                      <div className="flex justify-start animate-fadeIn">
                        <div className="bg-white text-gray-900 rounded-2xl rounded-bl-sm shadow-sm px-4 py-3 border border-purple-100">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* New messages indicator */}
                  {!isAtBottom && (
                    <div className="absolute bottom-20 right-4">
                      <button
                        onClick={scrollToBottom}
                        className="bg-purple-600 text-white rounded-full p-2 shadow-lg hover:bg-purple-700 transition-all transform hover:scale-110"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  {/* Reply Box - Simple */}
                  <form onSubmit={handleSendReply} className="p-4 bg-white border-t border-purple-100">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={replyMessage}
                        onChange={handleReplyInputChange}
                        placeholder="Type your reply..."
                        className="flex-1 px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        disabled={!replyMessage.trim() || sending}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        {sending ? 'Sending...' : 'Send'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-purple-50">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-10 h-10 text-purple-600" />
                    </div>
                    <p className="text-gray-600 font-medium text-lg">Select a buyer</p>
                    <p className="text-gray-400 text-sm mt-1">Click any conversation to reply</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}