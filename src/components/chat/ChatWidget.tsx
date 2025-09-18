"use client";

import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../hooks/useChat";

// Typing animation component for AI responses
function TypingAnimation({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      // Use requestAnimationFrame for ultra-smooth 60fps animation
      const frameId = requestAnimationFrame(() => {
        setTimeout(() => {
          setDisplayedText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, 3); // Ultra-fast: 3ms delay for maximum smoothness
      });

      return () => cancelAnimationFrame(frameId);
    } else {
      setIsTyping(false);
      onComplete?.();
    }
  }, [currentIndex, text, onComplete]);

  return (
    <span className="inline">
      {displayedText}
      {isTyping && (
        <span className="inline-block w-0.5 h-4 bg-purple-500 ml-0.5 animate-pulse" style={{ animationDuration: '0.8s' }}></span>
      )}
    </span>
  );
}

export function ChatWidget() {
  const { messages, sendMessage, status, clearChat } = useChat();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [typingMessages, setTypingMessages] = useState<Set<number>>(new Set());
  const [localMessages, setLocalMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Debug: confirm widget mounted in browser
    try {
      console.log('[ChatWidget] mounted');
    } catch {
      // Silent catch for production
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open && e.key === 'Escape') {
        setExpanded(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open]);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [localMessages.length, open, isWaitingForResponse]);

  // Function to extract products from chatbot response
  const extractProductsFromResponse = (response: any) => {
    try {
      if (response?.data?.products && Array.isArray(response.data.products)) {
        return response.data.products;
      }
      return [];
    } catch {
      return [];
    }
  };

  // Sync API messages with local messages and handle typing animation
  useEffect(() => {
    // Update local messages to match API messages
    setLocalMessages(messages);
    
    // Stop waiting for response when we get a new assistant message
    if (messages.length > 0 && messages[messages.length - 1].role === "assistant") {
      setIsWaitingForResponse(false);
      
      // Check if the response contains products
      const lastMessage = messages[messages.length - 1];
      const extractedProducts = extractProductsFromResponse(lastMessage);
      
      if (extractedProducts.length > 0) {
        setProducts(extractedProducts);
        setShowProducts(true);
        // Auto-expand when products are found
        if (!expanded) {
          setExpanded(true);
        }
      } else {
        setShowProducts(false);
        setProducts([]);
      }
      
      // Start typing animation for the latest AI message
      const lastMessageIndex = messages.length - 1;
      setTimeout(() => {
        setTypingMessages(new Set([lastMessageIndex]));
      }, 100);
    }
  }, [messages, expanded]);

  const handleTypingComplete = (messageIndex: number) => {
    setTypingMessages(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageIndex);
      return newSet;
    });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const messageText = input.trim();
    setShowWelcome(false);
    setInput(""); // Clear input immediately
    
    // 1. Add user message to local messages immediately
    const userMessage = { role: "user", content: messageText };
    setLocalMessages(prev => [...prev, userMessage]);
    
    // 2. Show "waiting for response" state
    setIsWaitingForResponse(true);
    
    // 3. Send the actual message to API
    await sendMessage(messageText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { text: "Show me products", icon: "🛍️" },
    { text: "Help with order", icon: "📦" },
    { text: "Return policy", icon: "↩️" },
    { text: "Payment options", icon: "💳" }
  ];

  return (
    <div>
      {/* Enhanced floating button with premium design */}
      <button
        aria-label="Open chat"
        onClick={() => setOpen((v) => !v)}
        style={{ 
          right: '1.5rem', 
          bottom: '1.5rem',
          boxShadow: '0 8px 32px rgba(101, 69, 238, 0.4), 0 4px 16px rgba(101, 69, 238, 0.2)'
        }}
        className="fixed z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#6545ee] via-[#7960f5] to-[#8b6ff7] hover:from-[#7960f5] hover:via-[#8b6ff7] hover:to-[#9a7dff] text-white transition-all duration-500 hover:scale-110 active:scale-95 group"
      >
        {/* Pulse animation ring */}
        <div className="absolute inset-0 rounded-full bg-[#6545ee] animate-ping opacity-20"></div>
        
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x transition-transform duration-300 group-hover:rotate-90">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        ) : (
          <div className="flex flex-col items-center relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5 transition-transform duration-300 group-hover:scale-110">
              <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
              <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
            </svg>
            <span className="text-[10px] font-bold tracking-wider text-white/95">Chat</span>
            
            {/* Notification dot */}
            {localMessages.length === 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
        )}
      </button>

      {/* Enhanced chat panel */}
      {open && (
        <div 
          className={`fixed right-6 z-50 rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-100 transition-all duration-300 flex flex-col ${
            expanded ? 'w-[800px] max-w-[calc(100vw-3rem)] sm:w-[800px] bottom-6 top-6' : 'w-96 max-w-full sm:w-96 bottom-24'
          }`}
          style={{
            animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            transformOrigin: "bottom right",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)"
          }}
        >
          {/* Enhanced header with premium gradient */}
          <div className="relative overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#6545ee] via-[#7960f5] to-[#8b6ff7]"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
            {/* Expanded indicator */}
            {expanded && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
            )}
            
            <div className="relative flex items-center justify-between px-6 py-5 text-white min-h-[80px]">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/>
                      <path d="M15 3v6h6"/>
                      <circle cx="10" cy="13" r="2"/>
                      <path d="m20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22"/>
                    </svg>
                  </div>
                  {/* Online status indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                  <div className="min-w-0 flex-1">
                   <div className="text-2xl font-extrabold tracking-tight text-white drop-shadow-sm truncate">Ask AllMart</div>
                   <div className="text-sm text-white/90 font-semibold tracking-wide flex flex-wrap items-center gap-1">
                     <span className="whitespace-nowrap">Assistant</span>
                     {expanded && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full whitespace-nowrap">Expanded</span>}
                     {showProducts && <span className="text-xs bg-green-500/20 text-green-200 px-2 py-0.5 rounded-full whitespace-nowrap">Products</span>}
                   </div>
                 </div>
              </div>
              
              <div className="flex items-center space-x-2 flex-shrink-0">
                               <div className="text-xs font-bold text-white bg-white/25 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/40 tracking-wide whitespace-nowrap">
                 {isWaitingForResponse ? 'Responding...' : 'Online'}
               </div>
                <button 
                  onClick={() => setExpanded(!expanded)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-105"
                  title={expanded ? "Collapse chat (Esc)" : "Expand chat (Esc)"}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                  >
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                </button>
                <button 
                  onClick={() => {
                    clearChat();
                    setLocalMessages([]);
                    setIsWaitingForResponse(false);
                    setTypingMessages(new Set());
                    setShowProducts(false);
                    setProducts([]);
                  }}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm border border-white/20"
                  title="Clear chat history"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced messages area */}
          <div ref={listRef} className={`overflow-y-auto py-6 px-5 space-y-5 bg-gradient-to-b from-gray-50/50 to-white transition-all duration-300 flex-1 ${
            expanded ? '' : 'max-h-96'
          }`}>
            {/* Welcome message */}
            {showWelcome && localMessages.length === 0 && (
            <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6545ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                                 <h3 className="text-xl font-extrabold text-gray-900 mb-3 tracking-tight">Welcome to AllMart! 👋</h3>
                 <p className="text-gray-700 text-sm mb-6 font-medium leading-relaxed">I&apos;m here to help you with shopping, orders, and more.</p>
                
                {/* Quick action buttons */}
                <div className={`grid gap-2 ${expanded ? 'grid-cols-2' : 'grid-cols-2'}`}>
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInput(action.text);
                        setShowWelcome(false);
                      }}
                      className="flex items-center space-x-2 p-3 rounded-xl bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-sm font-semibold text-gray-800 hover:text-purple-800 group shadow-sm hover:shadow-md"
                    >
                      <span className="text-lg">{action.icon}</span>
                      <span className="truncate">{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat messages with proper flow */}
            {localMessages.map((m: { role: string; content: string }, idx: number) => (
              <div 
                key={idx} 
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                style={{
                  animation: `fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards ${idx * 0.1}s`,
                  opacity: 0
                }}
              >
                  {m.role === "assistant" && (
                   <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex-shrink-0 flex items-center justify-center mr-3 border-2 border-white shadow-sm">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6545ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                       <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                       <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                       <line x1="12" x2="12" y1="19" y2="22"/>
                       <line x1="8" x2="8" y1="22" y2="22"/>
                       <line x1="16" x2="16" y1="22" y2="22"/>
                     </svg>
                   </div>
                 )}
                
                <div 
                   className={`rounded-lg px-5 py-3 ${
                     m.role === "user" 
                       ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white" 
                       : "bg-white text-gray-800 border border-gray-100"
                   } ${expanded ? 'max-w-[80%]' : 'max-w-[100%]'}`}
                 >
                   {/* Show typing animation ONLY for the latest AI message */}
                   {m.role === "assistant" && typingMessages.has(idx) ? (
                     <p className="text-sm font-medium leading-relaxed text-gray-900">
                       <TypingAnimation 
                         text={m.content} 
                         onComplete={() => handleTypingComplete(idx)}
                       />
                     </p>
                   ) : (
                     <p className="text-sm font-medium leading-relaxed text-gray-900">{m.content}</p>
                   )}
                 </div>
              </div>
            ))}
            
            {/* Enhanced responding indicator - show when waiting for response */}
             {isWaitingForResponse && (
               <div className="flex justify-start">
                 <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex-shrink-0 flex items-center justify-center mr-3 border-2 border-white shadow-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6545ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                     <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                     <line x1="12" x2="12" y1="19" y2="22"/>
                     <line x1="8" x2="8" y1="22" y2="22"/>
                     <line x1="16" x2="16" y1="22" y2="22"/>
                   </svg>
                 </div>
                <div className="rounded-lg bg-white shadow-md border border-gray-100 px-3 py-2 flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Product Display Area */}
          {showProducts && expanded && products.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50/30 flex-shrink-0">
              <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-purple-600">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                      <path d="M3 6h18"/>
                      <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    Found Products ({products.length})
                  </h3>
                  <button 
                    onClick={() => setShowProducts(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Hide products"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"/>
                      <path d="m6 6 12 12"/>
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                  {products.slice(0, 3).map((product, idx) => (
                    <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        {/* Product Image Placeholder */}
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6545ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                              <path d="M3 6h18"/>
                              <path d="M16 10a4 4 0 0 1-8 0"/>
                            </svg>
                          )}
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h4>
                          {product.brand && (
                            <p className="text-xs text-gray-600 mb-1">{product.brand}</p>
                          )}
                          
                          {/* Price */}
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-bold text-lg text-green-600">
                              {product.currency_symbol || '$'}{product.price?.toFixed(2) || '0.00'}
                            </span>
                            {product.original_price && product.original_price > product.price && (
                              <>
                                <span className="text-sm text-gray-500 line-through">
                                  {product.currency_symbol || '$'}{product.original_price.toFixed(2)}
                                </span>
                                {product.discount_percentage && (
                                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                                    {product.discount_percentage.toFixed(0)}% OFF
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          
                          {/* Stock Status */}
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${product.in_stock ? 'bg-green-400' : 'bg-red-400'}`}></div>
                            <span className="text-xs text-gray-600">
                              {product.in_stock ? 'In Stock' : 'Out of Stock'}
                            </span>
                            {product.rating && (
                              <div className="flex items-center space-x-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                                </svg>
                                <span className="text-xs text-gray-600">{product.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Action Button */}
                        <div className="flex-shrink-0">
                          <button 
                            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 hover:scale-105"
                            onClick={() => {
                              // Handle add to cart or view product
                              console.log('Add to cart:', product);
                            }}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Show More Button */}
                  {products.length > 3 && (
                    <div className="text-center pt-2">
                      <button className="text-purple-600 text-sm font-semibold hover:text-purple-700 transition-colors">
                        View All {products.length} Products →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Enhanced input area */}
          <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0 min-h-[120px]">
            <div className="flex gap-3 items-center rounded-2xl bg-gray-50 pr-3 overflow-hidden shadow-inner border border-gray-200 focus-within:border-purple-300 focus-within:ring-2 focus-within:ring-purple-100 transition-all duration-200">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                                 placeholder="Ask about products, orders, returns..."
                 className="flex-1 bg-transparent border-0 px-5 py-3.5 text-sm placeholder-gray-500 focus:outline-none font-semibold text-gray-900"
              />
              <button
                onClick={handleSend}
                className="rounded-full bg-gradient-to-r from-purple-500 to-purple-600 p-3.5 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:from-purple-600 hover:to-purple-700 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                disabled={!input.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </div>
             
             {/* Powered by CYNAYD credit */}
             <div className="mt-2 text-xs text-gray-400 text-center font-medium tracking-wide">
               Powered by <span className="text-purple-600 font-semibold">CYNAYD</span>
             </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(10px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
      `}</style>
    </div>
  );
}

export default ChatWidget;