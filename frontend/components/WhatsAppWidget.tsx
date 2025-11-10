'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Smile, Mic, Trash2, Edit } from 'lucide-react';

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

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editMessageText, setEditMessageText] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isUserTyping, setIsUserTyping] = useState(false); // Track if user is typing
  const [isAdminTyping, setIsAdminTyping] = useState(false); // Track if admin is typing
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if user is logged in and if admin
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    
    if (userData) {
      const user = JSON.parse(userData);
      setIsAdmin(user.role === 'admin');
    }
  }, []);

  // Load chat when opened
  useEffect(() => {
    if (isOpen && isLoggedIn) {
      loadChat();
      // Set up polling for real-time updates
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      pollIntervalRef.current = setInterval(() => {
        loadChat(true);
      }, 3000); // Poll every 3 seconds for real-time updates
    }
    
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [isOpen, isLoggedIn]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChat = async (silent = false) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        // Only update messages if they've changed
        const currentMessageIds = messages.map(m => m._id).join(',');
        const newMessageIds = (data.chat.messages || []).map((m: Message) => m._id).join(',');
        
        if (currentMessageIds !== newMessageIds) {
          setMessages(data.chat.messages || []);
        }
        
        // Count unread messages from admin
        const unread = (data.chat.messages || []).filter(
          (msg: Message) => msg.sender === 'admin' && !msg.read
        ).length;
        setUnreadCount(unread);

        // Mark as read if chat is open
        if (isOpen && unread > 0) {
          markAsRead();
        }
        
        // Set typing indicators
        setIsAdminTyping(data.chat.isAdminTyping || false);
      }
    } catch (error) {
      if (!silent) {
        console.error('Error loading chat:', error);
      }
    }
  };

  const markAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Function to send typing status
  const sendTypingStatus = async (isTyping: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/typing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isTyping })
      });
    } catch (error) {
      console.error('Error sending typing status:', error);
    }
  };

  // Handle input change with typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);
    
    // Send typing status
    if (value.trim() && !isUserTyping) {
      setIsUserTyping(true);
      sendTypingStatus(true);
    }
    
    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set new timeout to stop typing indicator after 1 second of inactivity
    const timeout = setTimeout(() => {
      if (isUserTyping) {
        setIsUserTyping(false);
        sendTypingStatus(false);
      }
    }, 1000);
    
    setTypingTimeout(timeout);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    // Clear typing status immediately when sending message
    if (isUserTyping) {
      setIsUserTyping(false);
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      sendTypingStatus(false);
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: newMessage })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(data.chat.messages || []);
        setNewMessage('');
      } else {
        alert(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmoji = async (emoji: string) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/emoji`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ emoji })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(data.chat.messages || []);
        setShowEmojiPicker(false);
      } else {
        alert(data.message || 'Failed to send emoji');
      }
    } catch (error) {
      console.error('Error sending emoji:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleVoiceRecording = async () => {
    // In a real implementation, this would capture audio
    // For now, we'll simulate with a placeholder
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ voiceData: '[Voice Message]' })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(data.chat.messages || []);
      } else {
        alert(data.message || 'Failed to send voice message');
      }
    } catch (error) {
      console.error('Error sending voice message:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const startEditingMessage = (messageId: string, messageText: string) => {
    setEditingMessageId(messageId);
    setEditMessageText(messageText);
  };

  const saveEditedMessage = async () => {
    if (!editingMessageId || !editMessageText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/message/${editingMessageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: editMessageText })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(data.chat.messages || []);
        setEditingMessageId(null);
        setEditMessageText('');
      } else {
        alert(data.message || 'Failed to edit message');
      }
    } catch (error) {
      console.error('Error editing message:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const deleteMessage = async (messageId: string, deleteFor: 'me' | 'everyone') => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/message/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ deleteFor })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(data.chat.messages || []);
      } else {
        alert(data.message || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleOpen = () => {
    if (!isLoggedIn) {
      alert('Please login to chat with the seller!');
      window.location.href = '/login';
      return;
    }
    setIsOpen(true);
  };

  const clearChat = async () => {
    if (!window.confirm('Are you sure you want to clear this chat? This will only clear your view of the chat, not the other participant\'s view.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages([]);
        setShowChatOptions(false);
        alert('Chat cleared successfully for you only. The other participant will still see the full chat history.');
      } else {
        alert(data.message || 'Failed to clear chat');
      }
    } catch (error) {
      console.error('Error clearing chat:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const toggleVoiceRecording = async () => {
    if (isRecording) {
      // Stop recording
      stopVoiceRecording();
      sendVoiceMessage();
    } else {
      // Start recording
      startVoiceRecording();
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(chunks => [...chunks, event.data]);
        }
      };
      
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Update recording time every second
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(time => time + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      
      setIsRecording(false);
    }
  };

  const sendVoiceMessage = async () => {
    if (audioChunks.length === 0) return;
    
    try {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const base64data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });
      
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ voiceData: base64data })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(data.chat.messages || []);
        setAudioChunks([]);
      } else {
        alert(data.message || 'Failed to send voice message');
      }
    } catch (error) {
      console.error('Error sending voice message:', error);
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

  // Emoji picker component
  const renderEmojiPicker = () => {
    const emojis = ['😀', '😂', '😍', '🥰', '😎', '🤩', '🥳', '😭', '😡', '🤯', '👍', '👎', '❤️', '🔥', '💯'];
    
    return (
      <div className="absolute bottom-16 left-0 bg-white rounded-lg shadow-xl p-2 border border-gray-200 w-full">
        <div className="grid grid-cols-5 gap-2">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleSendEmoji(emoji)}
              className="text-2xl p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Message options menu
  const renderMessageOptions = (message: Message) => {
    if (message.sender !== 'user' || message.deleted) return null;
    
    return (
      <div className="absolute top-0 right-0 bg-white rounded-lg shadow-lg p-1 border border-gray-200 z-10">
        <button
          onClick={() => {
            startEditingMessage(message._id!, message.message);
            setSelectedMessageId(null);
          }}
          className="flex items-center gap-2 px-2 py-1 text-sm hover:bg-gray-100 rounded w-full text-left"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => {
            deleteMessage(message._id!, 'me');
            setSelectedMessageId(null);
          }}
          className="flex items-center gap-2 px-2 py-1 text-sm hover:bg-gray-100 rounded w-full text-left text-red-500"
        >
          <Trash2 className="w-4 h-4" />
          Delete for me
        </button>
        <button
          onClick={() => {
            deleteMessage(message._id!, 'everyone');
            setSelectedMessageId(null);
          }}
          className="flex items-center gap-2 px-2 py-1 text-sm hover:bg-gray-100 rounded w-full text-left text-red-500"
        >
          <Trash2 className="w-4 h-4" />
          Delete for everyone
        </button>
      </div>
    );
  };

  // Render message status indicators (WhatsApp-like) with more distinct visuals
  const renderMessageStatus = (message: Message) => {
    if (message.sender !== 'user') return null;
    
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

  // Don't show chat widget to admin users
  if (isAdmin) {
    return null;
  }

  return (
    <>
      {/* Chat Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <div className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl w-80 sm:w-96 h-[400px] sm:h-[500px] animate-fadeIn border-2 border-purple-200 flex flex-col">
            {/* Floating Bubbles in Chat */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
              <div className="absolute top-10 left-10 w-6 h-6 rounded-full bg-purple-200 opacity-30 animate-bubblePulse" style={{ animationDelay: '0s' }}></div>
              <div className="absolute top-20 right-10 w-4 h-4 rounded-full bg-pink-200 opacity-40 animate-bubblePulse" style={{ animationDelay: '1s' }}></div>
            </div>
            
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-t-2xl flex items-center justify-between relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-bounce-slow">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Chat with Seller</h3>
                  <p className="text-xs text-purple-100">
                    {isAdminTyping ? 'Seller is typing...' : 'Ask about products!'}
                  </p>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowChatOptions(!showChatOptions)}
                  className="text-white hover:bg-white/20 rounded-full p-1 transition hover:scale-110"
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
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-1 transition hover:scale-110"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-purple-50 relative">
              {messages.length === 0 ? (
                <div className="text-center text-purple-500 mt-8 animate-fadeIn">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-purple-300" />
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs">Send a message to start chatting!</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn relative`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {editingMessageId === msg._id ? (
                      <div className="flex items-center gap-2 max-w-[80%]">
                        <input
                          type="text"
                          value={editMessageText}
                          onChange={(e) => setEditMessageText(e.target.value)}
                          className="px-3 py-2 border border-blue-200 rounded-lg text-sm"
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
                        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none shadow-lg'
                            : 'bg-white text-purple-900 rounded-bl-none shadow border border-purple-100'
                        } relative transform transition-all duration-300 hover:scale-[1.02]`}
                        onClick={() => {
                          if (msg.sender === 'user' && !msg.deleted) {
                            setSelectedMessageId(selectedMessageId === msg._id ? null : msg._id!);
                          }
                        }}
                      >
                        {selectedMessageId === msg._id && renderMessageOptions(msg)}
                        {/* Check if message is deleted for the current user */}
                        {msg.deleted || (msg as any).deletedFor === 'everyone' || ((msg as any).deletedFor === 'sender' && msg.sender === 'user') ? (
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
                          <p className="text-sm">{msg.message}</p>
                        )}
                        <p className={`text-xs mt-1 flex items-center justify-between ${
                          msg.sender === 'user' ? 'text-purple-100' : 'text-purple-500'
                        }`}>
                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {msg.edited && <span className="ml-1">(edited)</span>}
                            {renderMessageStatus(msg)}
                          </span>
                          {msg.sender === 'user' && !msg.deleted && (
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                              ⋮
                            </button>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
              {/* Typing indicator for admin */}
              {isAdminTyping && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="bg-white text-purple-900 rounded-2xl rounded-bl-none shadow border border-purple-100 px-4 py-2">
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
            
            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-purple-100 relative">
              {showEmojiPicker && renderEmojiPicker()}
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-indigo-600 hover:text-indigo-800 transition"
                >
                  <Smile className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={`text-indigo-600 hover:text-indigo-800 transition ${isRecording ? 'text-red-500 animate-pulse' : ''}`}
                >
                  <Mic className="w-6 h-6" />
                </button>
                {isRecording && (
                  <div className="text-xs text-red-500 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                    {recordingTime}s
                  </div>
                )}
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all text-purple-900 placeholder-purple-400"
                  disabled={loading || isRecording}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || loading || isRecording}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 hover:scale-110"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}

        <button
          onClick={handleOpen}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all animate-bounce-slow relative"
        >
          {/* Floating Bubble around Chat Button */}
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-300 opacity-40 animate-bubblePulse" style={{ animationDelay: '0s' }}></div>
          
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-400 text-white text-xs w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-bold animate-pulse z-10">
              {unreadCount}
            </span>
          )}
          <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>
    </>
  );
}