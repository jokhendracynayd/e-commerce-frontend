// Chat API service - separated from regular API calls for better scalability

// Base configuration
const SHOPPING_API_URL = "http://localhost:8000/api/v1/shopping";

// Types for API requests and responses
export interface ChatQuery {
  q: string;
  sessionId?: string;
  context?: Record<string, any>;
}

// Types to match the exact API response structure
export interface ChatResponseData {
  success: boolean;
  data?: {
    // Support both flattened and nested response shapes
    intent?: string;
    answer?: string;
    context?: string[];
    error?: any;
    // legacy nested result object
    result?: {
      type?: string;
      answer?: string;
      products?: any[];
      categories?: any[];
      [key: string]: any;
    };
    [key: string]: any;
  };
  meta?: any;
  error?: any;
}

export interface ChatResponse {
  answer: string;
  intent?: string;
  type?: string;
  sessionId?: string;
  products?: any[];
  categories?: any[];
  context?: string[];
  metadata?: Record<string, any>;
  success: boolean;
}

/**
 * Send a query to the shopping assistant
 * @param query User question or request
 * @param options Additional options like context
 * @returns Response from the AI assistant
 */
export async function queryShoppingAssistant(
  query: string, 
  options: { 
    sessionId?: string; 
    includeUserData?: boolean;
    context?: Record<string, any>;
  } = {}
): Promise<ChatResponse> {
  try {
    // Prepare request body
    const body: ChatQuery = { 
      q: query,
      sessionId: options.sessionId,
      // context: options.context
    };
    
    // Make the API request
    const response = await fetch(`${SHOPPING_API_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      // Parse error response if available
      try {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      } catch (e) {
        throw new Error(`API error: ${response.status}`);
      }
    }
    
    // Parse the raw response
    const rawData: ChatResponseData = await response.json();
    
    // Validate and transform the response
    if (!rawData.success) {
      throw new Error(rawData.error?.message || 'Unknown error from chat API');
    }
    
    // Extract the answer — support new flattened shape and legacy nested shape
    const answer = rawData.data?.answer || rawData.data?.result?.answer || "I'm sorry, I couldn't find an answer to that.";
    
    // Return properly formatted response
    return {
      answer,
      intent: rawData.data?.intent,
      type: rawData.data?.result?.type || rawData.data?.type,
      products: rawData.data?.result?.products || rawData.data?.products,
      categories: rawData.data?.result?.categories || rawData.data?.categories,
      context: rawData.data?.context,
      metadata: rawData.meta,
      success: true
    };
    
  } catch (error: any) {
    console.error('Shopping Assistant API error:', error);
    // Re-throw with more context
    throw new Error(`Failed to query shopping assistant: ${error.message}`);
  }
}

/**
 * Get chat history for a session
 * @param sessionId Session identifier
 * @returns Array of chat messages
 */
export async function getChatHistory(sessionId: string): Promise<any[]> {
  try {
    const response = await fetch(`${SHOPPING_API_URL}/history/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.history || [];
    
  } catch (error: any) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
}

/**
 * Clear chat history for a session
 * @param sessionId Session identifier
 */
export async function clearChatHistory(sessionId: string): Promise<void> {
  try {
    const response = await fetch(`${SHOPPING_API_URL}/history/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Error clearing chat history:', error);
    throw error;
  }
}

export default {
  queryShoppingAssistant,
  getChatHistory,
  clearChatHistory
};