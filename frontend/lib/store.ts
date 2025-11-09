import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from './types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

interface CompareStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        set((state) => {
          // Check if product has a valid ID
          const productId = product.id || (product as any)._id;
          if (!productId) {
            console.error('[Cart] Product has no valid ID:', product);
            return state;
          }
          
          const existingItem = state.items.find(
            (item) => (item.product.id || (item.product as any)._id) === productId
          );
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                (item.product.id || (item.product as any)._id) === productId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          
          return { items: [...state.items, { product: { ...product, id: productId }, quantity: 1 }] };
        });
      },
      
      removeItem: (productId) => {
        // Check if productId is valid
        if (!productId) {
          console.error('[Cart] Invalid productId provided for removal:', productId);
          return;
        }
        
        set((state) => ({
          items: state.items.filter((item) => (item.product.id || (item.product as any)._id) !== productId),
        }));
      },
      
      updateQuantity: (productId, quantity) => {
        // Check if productId is valid
        if (!productId) {
          console.error('[Cart] Invalid productId provided for update:', productId);
          return;
        }
        
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            (item.product.id || (item.product as any)._id) === productId ? { ...item, quantity } : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
      version: 4, // Increment version to force migration
      migrate: (persistedState, version) => {
        // Clean up any invalid items that might have been stored
        if (persistedState && typeof persistedState === 'object' && 'items' in persistedState) {
          const cleanItems = (persistedState as any).items.filter((item: any) => {
            const itemId = item.product.id || item.product._id;
            return item && item.product && itemId;
          });
          return {
            ...persistedState,
            items: cleanItems
          } as CartStore;
        }
        
        return {
          items: [],
        };
      }
    }
  )
);

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        set((state) => {
          // Check if product has a valid ID
          const productId = product.id || (product as any)._id;
          if (!productId) {
            console.error('[Wishlist] Product has no valid ID:', product);
            return state;
          }
          
          console.log('[Wishlist] addItem called with product:', productId);
          const exists = state.items.find((item) => (item.id || (item as any)._id) === productId);
          if (exists) {
            return state;
          }
          const newItems = [...state.items, { ...product, id: productId }];
          return { items: newItems };
        });
      },
      
      removeItem: (productId) => {
        // Check if productId is valid
        if (!productId) {
          console.error('[Wishlist] Invalid productId provided for removal:', productId);
          return;
        }
        
        set((state) => {
          const newItems = state.items.filter((item) => (item.id || (item as any)._id) !== productId);
          return { items: newItems };
        });
      },
      
      toggleItem: (product) => {
        // Check if product has a valid ID
        const productId = product.id || (product as any)._id;
        if (!productId) {
          console.error('[Wishlist] Product has no valid ID for toggle:', product);
          return;
        }
        
        set((state) => {
          const exists = state.items.find((item) => (item.id || (item as any)._id) === productId);
          if (exists) {
            // If exists, remove it
            const newItems = state.items.filter((item) => (item.id || (item as any)._id) !== productId);
            return { 
              items: newItems
            };
          }
          // If not exists, add it
          const newItems = [...state.items, { ...product, id: productId }];
          return { items: newItems };
        });
      },
      
      isInWishlist: (productId) => {
        // Check if productId is valid
        if (!productId) {
          console.error('[Wishlist] Invalid productId for check:', productId);
          return false;
        }
        
        const items = get().items;
        const result = items.some((item) => (item.id || (item as any)._id) === productId);
        return result;
      },
      
      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'wishlist-storage',
      version: 4, // Increment version to force migration
      migrate: (persistedState, version) => {
        // Clean up any invalid items that might have been stored
        if (persistedState && typeof persistedState === 'object' && 'items' in persistedState) {
          const cleanItems = (persistedState as any).items.filter((item: any) => {
            const itemId = item.id || item._id;
            return item && itemId;
          });
          return {
            ...persistedState,
            items: cleanItems
          } as WishlistStore;
        }
        
        return {
          items: [],
        };
      }
    }
  )
);

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        set((state) => {
          // Check if product has a valid ID
          const productId = product.id || (product as any)._id;
          if (!productId) {
            console.error('[Compare] Product has no valid ID:', product);
            return state;
          }
          
          if (state.items.length >= 4) {
            alert('You can only compare up to 4 products at a time');
            return state;
          }
          
          const exists = state.items.find((item) => (item.id || (item as any)._id) === productId);
          if (exists) {
            return state;
          }
          const newItems = [...state.items, { ...product, id: productId }];
          return { items: newItems };
        });
      },
      
      removeItem: (productId) => {
        // Check if productId is valid
        if (!productId) {
          console.error('[Compare] Invalid productId provided for removal:', productId);
          return;
        }
        
        set((state) => {
          const newItems = state.items.filter((item) => (item.id || (item as any)._id) !== productId);
          return { items: newItems };
        });
      },
      
      isInCompare: (productId) => {
        // Check if productId is valid
        if (!productId) {
          console.error('[Compare] Invalid productId for check:', productId);
          return false;
        }
        
        const items = get().items;
        const result = items.some((item) => (item.id || (item as any)._id) === productId);
        return result;
      },
      
      clearCompare: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'compare-storage',
      version: 4, // Increment version to force migration
      migrate: (persistedState, version) => {
        // Clean up any invalid items that might have been stored
        if (persistedState && typeof persistedState === 'object' && 'items' in persistedState) {
          const cleanItems = (persistedState as any).items.filter((item: any) => {
            const itemId = item.id || item._id;
            return item && itemId;
          });
          return {
            ...persistedState,
            items: cleanItems
          } as CompareStore;
        }
        
        return {
          items: [],
        };
      }
    }
  )
);
