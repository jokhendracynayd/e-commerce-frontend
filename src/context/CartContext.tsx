'use client';

import React, { createContext, useContext, useEffect, useState, useRef, ReactNode, useCallback, useMemo } from 'react';
import { ProductDetail, ColorVariant } from '@/types/product';
import { ContextCartItem } from '@/types/cart';
import { useAuth } from './AuthContext';
import { useAnalyticsContext } from './AnalyticsContext';
import { cartApi } from '@/lib/api/cart-api';
import { toast } from 'react-hot-toast';

// Extend the ContextCartItem type locally to include cartItemId
interface ExtendedContextCartItem extends ContextCartItem {
  cartItemId?: string; // ID of the cart item in the backend
}

interface CartContextType {
  items: ExtendedContextCartItem[];
  addToCart: (product: ProductDetail, quantity: number, selectedColor?: ColorVariant) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  refreshCart: () => Promise<void>;
  isLoading: boolean;
  syncWithBackend: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ExtendedContextCartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const initialLoadRef = useRef(true);
  const skipNextSaveRef = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncTimeRef = useRef<number>(0);
  const { isAuthenticated, user } = useAuth();
  const analytics = useAnalyticsContext();
  const hasTriedInitialSyncRef = useRef(false);
  
  // Calculate totals from items
  const calculateTotals = useCallback(() => {
    console.log('Calculating totals from items array length:', items.length);
    
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const priceTotal = items.reduce((total, item) => {
      // First check if item has a discount price
      let price;
      if (item.product.discountPrice !== undefined && item.product.discountPrice !== null) {
        price = typeof item.product.discountPrice === 'number' && !isNaN(item.product.discountPrice)
          ? item.product.discountPrice
          : 0;
      } else {
        // If no discount price, use regular price
        price = typeof item.product.price === 'number' && !isNaN(item.product.price) 
          ? item.product.price 
          : 0;
      }
      return total + (price * item.quantity);
    }, 0);
    
    console.log('Setting totalItems to:', itemCount);
    setTotalItems(itemCount);
    setTotalPrice(priceTotal);
  }, [items]);
  
  // Load cart from localStorage on initial load
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      try {
        setIsLoading(true);
        const savedCart = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            setItems(parsedCart);
          } catch (error) {
            console.error('Failed to parse cart from localStorage', error);
            // Reset to empty cart on error
            setItems([]);
          }
        }
      } catch (error) {
        console.error('Error loading cart', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);
  
  // Sync with backend when user logs in
  useEffect(() => {
    const handleSync = async () => {
      if (isAuthenticated && user && !hasTriedInitialSyncRef.current) {
        hasTriedInitialSyncRef.current = true;
        console.log('Initial authentication sync triggered');
        
        try {
          // First load the backend cart to check what's already there
          const backendCart = await cartApi.getCart();
          
          // If we have items in local storage that need to be merged
          if (items.length > 0 && backendCart?.items?.length > 0) {
            // Create a map of existing backend items for quick lookup
            const existingBackendItems = new Map();
            backendCart.items.forEach(item => {
              const key = `${item.product.id}-${item.variant?.id || 'novariant'}`;
              existingBackendItems.set(key, item);
            });
            
            // Only sync items that don't exist in the backend already
            const itemsToSync = items.filter(item => {
              const itemKey = `${item.product.id}-${item.selectedColor?.id || 'novariant'}`;
              return !existingBackendItems.has(itemKey);
            });
            
            // If we have unique items to sync, call syncWithBackend
            if (itemsToSync.length > 0) {
              console.log(`Found ${itemsToSync.length} unique items to sync with backend`);
              
              // Transform local items to API format
              const apiItems = itemsToSync.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                variantId: item.selectedColor?.id,
                additionalInfo: item.selectedColor ? { 
                  color: item.selectedColor.color,
                  hex: item.selectedColor.hex 
                } : undefined,
              }));
              
              // Merge with backend
              await cartApi.mergeAnonymousCart(apiItems);
            }
          } else if (items.length > 0) {
            // If backend cart is empty but we have local items, sync them
            await syncWithBackend();
          }
          
          // Finally, load the updated cart from backend
          await loadBackendCart();
          
          // Ensure totals are recalculated after syncing
          calculateTotals();
        } catch (error) {
          console.error('Error during initial cart sync:', error);
          toast.error('Failed to sync your cart');
        }
      }
    };
    
    handleSync();
  }, [isAuthenticated, user, items, calculateTotals]); // Include items in dependencies to ensure proper sync
  
  // Save cart to localStorage with debounce
  const saveCartToStorage = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Debounce for 300ms to avoid too many writes
    saveTimeoutRef.current = setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify(items));
        }
      } catch (error) {
        console.error('Failed to save cart to localStorage', error);
      }
    }, 300);
  }, [items]);
  
  // Update totals and save to localStorage when items change
  useEffect(() => {
    if (!initialLoadRef.current) {
      // Always calculate totals when items change to ensure consistency
      calculateTotals();
      
      // Only save to storage if not skipping
      if (skipNextSaveRef.current) {
        skipNextSaveRef.current = false;
      } else {
        saveCartToStorage();
      }
    }
  }, [items, calculateTotals, saveCartToStorage]);
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);
  
  // Load cart from backend
  const loadBackendCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      console.log('Loading cart from backend...');
      const cart = await cartApi.getCart();
      console.log('Backend cart loaded:', cart);
      
      // Check if we have a valid cart with items
      if (!cart || !cart.items || cart.items.length === 0) {
        // If the cart is empty or response is invalid, set an empty cart
        console.log('Empty or invalid cart from backend, setting empty cart');
        skipNextSaveRef.current = true;
        setItems([]);
        setTotalItems(0); // Explicitly set total items to 0
        return;
      }
      
      // Create a map for deduplication by product+variant ID
      const deduplicatedItems = new Map();
      
      // First process all backend items
      cart.items.forEach(item => {
        if (!item?.product?.id) return; // Skip invalid items
        
        // Create a unique key for this item (product ID + variant ID if exists)
        const itemKey = `${item.product.id}-${item.variant?.id || 'novariant'}`;
        
        // Create a basic ProductDetail object with required fields
        const productDetail: ProductDetail = {
          id: item.product.id,
          title: item.product.title || 'Product Name',
          slug: item.product.slug || `product-${item.product.id}`,
          price: parseFloat(item.product.price?.toString() || '0'),
          discountPrice: item.product.discountPrice ? parseFloat(item.product.discountPrice.toString()) : undefined,
          // Fill required fields with sensible defaults if not available from API
          brand: '',
          description: '',
          originalPrice: parseFloat(item.product.price?.toString() || '0'),
          rating: 0,
          reviewCount: 0,
          inStock: true, // We assume it's in stock if it's in the cart
          stockCount: 0,
          isAssured: false,
          images: [item.product.imageUrl || ''], // Just use the main image URL
          highlights: [],
          specificationGroups: [],
          hasFreeDel: false,
          sellerName: '',
          reviews: [],
          currency: item.product.currency || 'INR',
        };
        
        // Handle discounted price if available
        if (item.product.discountPrice) {
          productDetail.discountPrice = parseFloat(item.product.discountPrice.toString());
          productDetail.discountPercentage = Math.round(
            ((parseFloat(item.product.price.toString()) - parseFloat(item.product.discountPrice.toString())) / 
              parseFloat(item.product.price.toString())) * 100
          );
        }
        
        // Create a color variant if available
        let colorVariant: ColorVariant | undefined;
        if (item.variant) {
          colorVariant = {
            id: item.variant.id,
            color: item.variant.variantName || 'Default',
            hex: item.additionalInfo?.hex || '#000000',
            image: item.product.imageUrl || '',
          };
        }
        
        // Add to deduplication map - if a duplicate exists, use the one with cartItemId (from backend)
        if (!deduplicatedItems.has(itemKey) || item.id) {
          deduplicatedItems.set(itemKey, {
            product: productDetail,
            quantity: item.quantity || 1,
            selectedColor: colorVariant,
            cartItemId: item.id, // Store the backend cart item ID
          });
        }
      });
      
      // Convert map values to array
      const backendItems = Array.from(deduplicatedItems.values()) as ExtendedContextCartItem[];
      
      // Skip next localStorage save since we're setting items directly
      skipNextSaveRef.current = true;
      setItems(backendItems);
      
      // Immediately calculate totals after loading backend cart
      const itemCount = backendItems.reduce((total, item) => total + item.quantity, 0);
      setTotalItems(itemCount);
    } catch (error) {
      console.error('Failed to load backend cart:', error);
      toast.error('Failed to load cart data');
      // Do not clear the cart on error to prevent data loss
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sync local cart with backend - with debounce protection
  const syncWithBackend = async () => {
    if (!isAuthenticated || !user) {
      console.log('Not authenticated, skipping cart sync');
      return;
    }

    console.log('Starting cart sync with backend...');
    
    // Get the current timestamp
    const now = Date.now();
    // Don't allow syncs more frequently than every 2 seconds
    if (now - lastSyncTimeRef.current < 2000) {
      console.log('Sync attempted too soon after previous sync, debouncing');
      return;
    }
    lastSyncTimeRef.current = now;
    
    try {
      setIsLoading(true);
      
      // First check what's already in the backend to avoid duplicates
      const backendCart = await cartApi.getCart();
      
      if (backendCart && Array.isArray(backendCart.items)) {
        // Create a map of existing backend items for quick lookup
        const existingBackendItems = new Map();
        backendCart.items.forEach(item => {
          if (item?.product?.id) {
            const key = `${item.product.id}-${item.variant?.id || 'novariant'}`;
            existingBackendItems.set(key, item);
          }
        });
        
        // Only sync items that don't exist in the backend already or have different quantities
        const itemsToSync = items.filter(item => {
          if (!item?.product?.id) return false;
          
          const itemKey = `${item.product.id}-${item.selectedColor?.id || 'novariant'}`;
          const backendItem = existingBackendItems.get(itemKey);
          
          // Include item if it doesn't exist in backend or has different quantity
          return !backendItem || backendItem.quantity !== item.quantity;
        });
        
        if (itemsToSync.length === 0) {
          console.log('No new items to sync with backend');
          return;
        }
        
        // Transform unique local cart items to API format
        const apiItemsToSync = itemsToSync.map(item => {
          const itemKey = `${item.product.id}-${item.selectedColor?.id || 'novariant'}`;
          const backendItem = existingBackendItems.get(itemKey);
          
          return {
            productId: item.product.id,
            quantity: item.quantity,
            variantId: item.selectedColor?.id,
            // If this item exists but quantity changed, use update API instead
            updateExisting: !!backendItem,
            cartItemId: backendItem?.id, // Include backend ID if it exists
            additionalInfo: item.selectedColor ? { 
              color: item.selectedColor.color,
              hex: item.selectedColor.hex 
            } : undefined,
          };
        });
        
        // Merge the unique items with the backend cart
        const mergedCart = await cartApi.mergeAnonymousCart(apiItemsToSync);
        console.log('Cart sync successful, loading updated cart from backend');
      }
      
      // Load the complete cart from backend after sync
      await loadBackendCart();
      
    } catch (error) {
      console.error('Failed to sync cart with backend:', error);
      toast.error('Failed to sync cart with server');
    } finally {
      setIsLoading(false);
    }
  };
  
  const addToCart = useCallback((product: ProductDetail, quantity: number, selectedColor?: ColorVariant) => {
    if (!product?.id || quantity <= 0) {
      console.error('Invalid product or quantity');
      return;
    }
    
    if (isAuthenticated) {
      // For authenticated users, check if the item already exists in the cart first
      setIsLoading(true);
      
      // Find if the item already exists in the local cart
      const existingItem = items.find(item => 
        item.product.id === product.id && 
        (!selectedColor || item.selectedColor?.id === selectedColor?.id)
      );
      
      // Prepare the request data
      const request = {
        productId: product.id,
        quantity: existingItem ? existingItem.quantity + quantity : quantity,
        // Use variant ID if selected
        ...(selectedColor && { variantId: selectedColor.id }),
      };
      
      // If we have an existing item with a cartItemId, use update API instead
      if (existingItem && existingItem.cartItemId) {
        cartApi.updateCartItem(existingItem.cartItemId, { quantity: request.quantity })
          .then(() => {
            // Update successful, load latest cart state from backend
            loadBackendCart();
            toast.success('Cart updated');
            
            // Track analytics for cart update (treated as add to cart)
            analytics.trackAddToCart(
              product.id,
              selectedColor?.id,
              quantity,
              product.discountPrice || product.price,
              {
                action: 'update_quantity',
                previousQuantity: existingItem.quantity,
                newQuantity: request.quantity,
                source: 'cart_update',
              }
            );
          })
          .catch(error => {
            console.error('Failed to update cart item:', error);
            const message = (error?.message) || (error?.response?.data?.message) || 'Failed to update cart';
            toast.error(message);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        // No existing item with cartItemId, use add API
        cartApi.addToCart(request)
          .then(() => {
            // Fetch the complete cart from backend
            loadBackendCart();
            toast.success('Item added to cart');
            
            // Track analytics for add to cart
            analytics.trackAddToCart(
              product.id,
              selectedColor?.id,
              quantity,
              product.discountPrice || product.price,
              {
                action: 'add_new',
                source: 'product_page',
                productTitle: product.title,
                productSlug: product.slug,
              }
            );
          })
          .catch(error => {
            console.error('Failed to add item to cart:', error);
            const message = (error?.message) || (error?.response?.data?.message) || 'Failed to add item to cart';
            toast.error(message);
            // Do NOT mutate local cart on backend failure to keep state consistent
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } else {
      // For anonymous users, just update local state
      updateLocalCart();
      toast.success('Item added to cart');
      
      // Track analytics for anonymous users too
      analytics.trackAddToCart(
        product.id,
        selectedColor?.id,
        quantity,
        product.discountPrice || product.price,
        {
          action: 'add_new',
          source: 'product_page',
          productTitle: product.title,
          productSlug: product.slug,
          userType: 'anonymous',
        }
      );
    }
    
    // Helper function to update local state
    function updateLocalCart() {
      setItems(prevItems => {
        // Check if item already exists in cart
        const existingItemIndex = prevItems.findIndex(
          item => item.product.id === product.id && 
          (!selectedColor || item.selectedColor?.id === selectedColor?.id)
        );
        
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += quantity;
          return updatedItems;
        } else {
          // Add new item if it doesn't exist
          return [...prevItems, { product, quantity, selectedColor, cartItemId: undefined }];
        }
      });
    }
  }, [isAuthenticated, setIsLoading, loadBackendCart, items]);
  
  const removeFromCart = useCallback((productId: string) => {
    if (!productId) {
      console.error('Invalid product ID');
      return;
    }

    if (isAuthenticated) {
      // For authenticated users, first find the cart item ID for the product
      const cartItem = items.find(item => item.product.id === productId);
      
      if (cartItem && cartItem.cartItemId) {
        // If we have a cart item ID, use it to remove the item from the backend
        setIsLoading(true);
        cartApi.removeFromCart(cartItem.cartItemId)
          .then(() => {
            // Track analytics for remove from cart
            analytics.trackRemoveFromCart(
              productId,
              cartItem.selectedColor?.id,
              cartItem.quantity,
              {
                source: 'cart_page',
                productTitle: cartItem.product.title,
                productSlug: cartItem.product.slug,
                removedQuantity: cartItem.quantity,
              }
            );
            
            // On success, update local state
            setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
            toast.success('Item removed from cart');
          })
          .catch(error => {
            console.error('Failed to remove item from cart:', error);
            toast.error('Failed to remove item from cart');
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        // If we don't have the cart item ID, try finding the product in the current items
        // This could happen if the cart was loaded from localStorage and not synced yet
        console.warn('Cart item ID not found for product, removing locally only');
        setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
      }
    } else {
      // For anonymous users, just update local state
      const removedItem = items.find(item => item.product.id === productId);
      if (removedItem) {
        // Track analytics for anonymous users
        analytics.trackRemoveFromCart(
          productId,
          removedItem.selectedColor?.id,
          removedItem.quantity,
          {
            source: 'cart_page',
            productTitle: removedItem.product.title,
            productSlug: removedItem.product.slug,
            removedQuantity: removedItem.quantity,
            userType: 'anonymous',
          }
        );
      }
      
      setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    }
  }, [isAuthenticated, items]);
  
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (!productId || quantity <= 0) {
      console.error('Invalid product ID or quantity');
      return;
    }
    
    if (isAuthenticated) {
      // For authenticated users, first find the cart item with the backend ID
      const cartItem = items.find(item => item.product.id === productId);
      
      if (cartItem && cartItem.cartItemId) {
        // If we have a cart item ID, update it in the backend
        setIsLoading(true);
        cartApi.updateCartItem(cartItem.cartItemId, { quantity })
          .then(() => {
            // On success, update local state
            setItems(prevItems => 
              prevItems.map(item => 
                item.product.id === productId 
                  ? { ...item, quantity: Math.max(1, quantity) } 
                  : item
              )
            );
            // toast.success('Cart updated');
          })
          .catch(error => {
            console.error('Failed to update cart item:', error);
            const message = (error?.message) || (error?.response?.data?.message) || 'Failed to update cart item';
            toast.error(message);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        // If we don't have the cart item ID, update locally only
        console.warn('Cart item ID not found for product, updating locally only');
        setItems(prevItems => 
          prevItems.map(item => 
            item.product.id === productId 
              ? { ...item, quantity: Math.max(1, quantity) } 
              : item
          )
        );
      }
    } else {
      // For anonymous users, just update local state
      setItems(prevItems => 
        prevItems.map(item => 
          item.product.id === productId 
            ? { ...item, quantity: Math.max(1, quantity) } 
            : item
        )
      );
    }
  }, [isAuthenticated, items]);
  
  const clearCart = useCallback(() => {
    try {
      if (isAuthenticated) {
        // For authenticated users, call the backend API
        setIsLoading(true);
        cartApi.clearCart()
          .then(() => {
            // On success, update local state
            skipNextSaveRef.current = true; // Skip the next localStorage save
            setItems([]);
            setTotalItems(0);
            setTotalPrice(0);
            
            if (typeof window !== 'undefined') {
              localStorage.removeItem('cart'); // Directly remove from localStorage
            }
            
            toast.success('Cart cleared successfully');
          })
          .catch(error => {
            console.error('Failed to clear cart:', error);
            toast.error('Failed to clear cart');
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        // For anonymous users, just update local state
        skipNextSaveRef.current = true; // Skip the next localStorage save
        setItems([]);
        setTotalItems(0);
        setTotalPrice(0);
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cart'); // Directly remove from localStorage
        }
      }
    } catch (error) {
      console.error('Failed to clear cart', error);
    }
  }, [isAuthenticated]);
  
  const refreshCart = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated) {
        // If authenticated, fetch cart data from the backend
        await loadBackendCart();
        
        // After loading from backend, clear the local storage cart
        // This prevents items from being resynced on page refresh
        if (typeof window !== 'undefined') {
          // Save the backend cart to local storage to prevent resyncing on refresh
          // We use the skipNextSaveRef flag to prevent an infinite loop
          skipNextSaveRef.current = true;
          localStorage.setItem('cart', JSON.stringify(items));
        }
      } else {
        // For anonymous users, validate local items
        const validatedItems = items.filter(item => {
          // Basic validation to ensure we don't have invalid items
          return item && item.product && item.product.id && item.quantity > 0;
        });
        
        // If some items were invalid, update the state
        if (validatedItems.length !== items.length) {
          skipNextSaveRef.current = true;
          setItems(validatedItems);
        }
        
        // Recalculate totals
        calculateTotals();
      }
    } catch (error) {
      console.error('Failed to refresh cart', error);
      toast.error('Failed to refresh cart');
    } finally {
      setIsLoading(false);
    }
  }, [calculateTotals, isAuthenticated, loadBackendCart, items]);
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    refreshCart,
    isLoading,
    syncWithBackend
  }), [
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    refreshCart,
    isLoading,
    syncWithBackend
  ]);
  
  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
} 