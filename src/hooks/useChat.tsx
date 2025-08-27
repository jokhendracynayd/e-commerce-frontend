"use client";

import { useEffect, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { queryShoppingAssistant } from "../services/chatService";

type Message = { role: "user" | "assistant"; content: string; metadata?: any };

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<string>("idle");
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  
  // Initialize session ID and load chat history
  useEffect(() => {
    try {
      // Try to get existing session ID from localStorage
      let existingSessionId = localStorage.getItem('chat_session_id');
      
      // If no session ID exists, create a new one
      if (!existingSessionId) {
        existingSessionId = uuidv4();
        localStorage.setItem('chat_session_id', existingSessionId);
      }
      
      setSessionId(existingSessionId);
      
      // Load messages from localStorage if available
      const savedMessages = localStorage.getItem('chat_history');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // welcome message
        setMessages([{ role: "assistant", content: "Hi — how can I help you today?" }]);
      }
    } catch (e) {
      console.error("Error initializing chat", e);
      // Fallback
      setSessionId(uuidv4());
      setMessages([{ role: "assistant", content: "Hi — how can I help you today?" }]);
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('chat_history', JSON.stringify(messages));
      } catch (e) {
        console.error("Error saving chat history", e);
      }
    }
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    try {
      // Update UI immediately with the user message
      setMessages((m) => [...m, { role: "user", content: text }]);
      setStatus("typing...");
      setError(null);

      // Get user context information (optional)
      // Could include user preferences, order history, etc.
      const userContext = {
        // Add any relevant user context here
      };

      // Call the shopping assistant API using our service
      const response = await queryShoppingAssistant(text, {
        sessionId: sessionId,
        context: userContext
      });
      
      if (response.success) {
        // Add the assistant's response to the messages with additional metadata
        setMessages((m) => [...m, { 
          role: 'assistant', 
          content: response.answer,
          metadata: {
            intent: response.intent,
            type: response.type,
            products: response.products,
            categories: response.categories
          }
        }]);
      } else {
        // Handle unsuccessful response
        throw new Error("Failed to get a valid response from the assistant");
      }
      
      setStatus('idle');
    } catch (error: any) {
      console.error("Error sending message:", error);
      setError(error.message || "Failed to send message");
      
      // Add a user-friendly error message in the chat
      setMessages((m) => [
        ...m, 
        { role: 'assistant', content: 'Sorry, I encountered an issue with the shopping assistant. Please try again later.' }
      ]);
      setStatus('error');
    }
  }, [sessionId]);

  // Function to clear chat history
  const clearChat = useCallback(() => {
    setMessages([{ role: "assistant", content: "Hi — how can I help you today?" }]);
    try {
      localStorage.removeItem('chat_history');
      // Generate a new session ID
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      localStorage.setItem('chat_session_id', newSessionId);
    } catch (e) {
      console.error("Error clearing chat", e);
    }
  }, []);

  return { 
    messages, 
    sendMessage, 
    status,
    error,
    clearChat,
    sessionId
  };
}

export default useChat;