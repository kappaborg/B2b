import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
}

interface WishlistItem {
  productId: number;
  addedAt: Date;
}

interface StoreState {
  user: User | null;
  setUser: (user: User | null) => void;
  favorites: number[];
  wishlistItems: WishlistItem[];
  addFavorite: (productId: number) => void;
  removeFavorite: (productId: number) => void;
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
  isFavorite: (productId: number) => boolean;
  getFavoriteCount: () => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      favorites: [],
      wishlistItems: [],
      addFavorite: (productId) => {
        const state = get();
        if (!state.favorites.includes(productId)) {
          set({ 
            favorites: [...state.favorites, productId],
            wishlistItems: [...state.wishlistItems, { productId, addedAt: new Date() }]
          });
        }
      },
      removeFavorite: (productId) => {
        const state = get();
        set({ 
          favorites: state.favorites.filter((id) => id !== productId),
          wishlistItems: state.wishlistItems.filter((item) => item.productId !== productId)
        });
      },
      addToWishlist: (productId) => {
        const state = get();
        if (!state.favorites.includes(productId)) {
          set({ 
            favorites: [...state.favorites, productId],
            wishlistItems: [...state.wishlistItems, { productId, addedAt: new Date() }]
          });
        }
      },
      removeFromWishlist: (productId) => {
        const state = get();
        set({ 
          favorites: state.favorites.filter((id) => id !== productId),
          wishlistItems: state.wishlistItems.filter((item) => item.productId !== productId)
        });
      },
      clearWishlist: () => set({ favorites: [], wishlistItems: [] }),
      isFavorite: (productId) => get().favorites.includes(productId),
      getFavoriteCount: () => get().favorites.length,
    }),
    {
      name: 'luxe-intimates-store',
      // Only persist certain parts
      partialize: (state) => ({ 
        favorites: state.favorites,
        wishlistItems: state.wishlistItems 
      }),
    }
  )
); 