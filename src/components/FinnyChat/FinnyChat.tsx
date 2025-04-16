
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { FinnyMessage } from './FinnyMessage';
import { getFinnyResponse } from './FinnyResponses';
import { MessageCircle, Send, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface Message {
  content: string;
  isUser: boolean;
  timestamp: string;
}

export interface FinnyChatRef {
  askQuestion: (question: string) => void;
}

export const FinnyChat = forwardRef<FinnyChatRef>((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { incrementFeatureInteraction } = useAppStore();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Initial greeting when chat is first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          content: "Hi! I'm Finny, your personal financial coach. Ask me anything about money and I'll explain it simply.",
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
    if (isOpen) {
      inputRef.current?.focus();
      incrementFeatureInteraction("ChatOpened");
    }
  }, [isOpen, messages.length, incrementFeatureInteraction]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const simulateTyping = (query: string) => {
    setIsTyping(true);
    
    // Random typing delay based on message length (between 1-3 seconds)
    const typingDelay = Math.min(1000 + Math.floor(query.length * 20), 3000);
    
    setTimeout(() => {
      const response = getFinnyResponse(query);
      setMessages(prev => [
        ...prev,
        {
          content: response,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, typingDelay);
  };
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    incrementFeatureInteraction("ChatMessage");
    
    const userMessage = {
      content: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    simulateTyping(input);
    setInput('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const askQuestion = (question: string) => {
    setIsOpen(true);
    
    // Add a small delay to ensure the chat is open
    setTimeout(() => {
      const userMessage = {
        content: question,
        isUser: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, userMessage]);
      simulateTyping(question);
    }, 100);
  };
  
  // Expose the askQuestion method to the parent component via ref
  useImperativeHandle(ref, () => ({
    askQuestion
  }));
  
  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 rounded-full h-14 w-14 p-0 shadow-lg bg-finpurple hover:bg-finpurple-dark z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
      
      {/* Chat Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="p-0 w-[380px] max-w-[95vw] sm:w-[440px] sm:max-w-[90vw]">
          {/* Chat Header */}
          <div className="border-b p-4 flex items-center justify-between bg-finpurple text-white">
            <div className="flex items-center gap-2">
              <div className="bg-white text-finpurple rounded-full h-8 w-8 flex items-center justify-center font-bold">
                F
              </div>
              <div>
                <h2 className="font-semibold">Finny</h2>
                <p className="text-xs text-white/80">Your financial coach</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-finpurple-dark"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Chat Messages */}
          <div className="p-4 overflow-y-auto h-[calc(100vh-13rem)] md:h-[calc(100vh-13rem)]">
            {messages.map((message, index) => (
              <FinnyMessage
                key={index}
                content={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            
            {isTyping && (
              <div className="flex items-center gap-2 text-fingray-medium">
                <div className="bg-finpurple rounded-full h-8 w-8 flex items-center justify-center text-white">
                  F
                </div>
                <div className="flex gap-1">
                  <span className="animate-pulse">•</span>
                  <span className="animate-pulse delay-100">•</span>
                  <span className="animate-pulse delay-200">•</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat Input */}
          <div className="border-t p-4 bg-gray-50">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Finny a question..."
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                size="icon"
                className="bg-finpurple hover:bg-finpurple-dark"
                disabled={!input.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
});

FinnyChat.displayName = "FinnyChat";
