import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import MessageBubble from './MessageBubble';
import { mockMessages, mockBotResponse } from '../mock';
import { Send, Loader2, Menu } from 'lucide-react';

const ChatInterface = ({ onToggleSidebar, currentChatId }) => {
  const [messages, setMessages] = useState(mockMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Reset messages when switching chats
    if (currentChatId) {
      setMessages(mockMessages);
    }
  }, [currentChatId]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Mock API call
      const botResponse = await mockBotResponse(userMessage.content);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      const errorMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    
    // Auto-resize textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden">
      {/* Starry background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl z-10">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden text-zinc-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-white">CA Study Chat</h2>
            <p className="text-sm text-zinc-400">Ask anything about CA syllabus</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 z-10 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">CA</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Welcome to CAgpt</h3>
              <p className="text-zinc-400 mb-6 max-w-md">
                Your intelligent CA study companion. Ask questions about taxation, accounting, audit, law, and more.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto">
                {[
                  'Explain Section 44AD provisions',
                  'What is depreciation under Companies Act?',
                  'GST return filing due dates',
                  'Audit standards under SA 700'
                ].map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => setInputValue(suggestion)}
                    className="text-left justify-start border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600 rounded-lg p-3 h-auto"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isUser={message.type === 'user'}
              />
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-zinc-300">CA</span>
                </div>
                <div className="bg-zinc-800/80 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                    <span className="text-sm text-zinc-400">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything about CA syllabus..."
                className="min-h-[48px] max-h-[120px] resize-none bg-zinc-900/50 border-zinc-700 text-white placeholder-zinc-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                disabled={isLoading}
              />
              {inputValue.trim() && (
                <Button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2 bottom-2 h-8 w-8 p-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg"
                >
                  <Send className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-2 text-center">
            CAgpt can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;