
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import cartService from "../services/customer/cartService";
import favoriteService from "../services/customer/favoriteService";
import { useAuth } from "../hooks/useAuth";

const CustomerDataContext = createContext(null);

export const CustomerDataProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();

  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

 

  const loadCart = useCallback(async () => {
    if (!isLoggedIn) {
      setCart([]);
      return;
    }

    try {
      setLoadingCart(true);

      const res = await cartService.getCart();

      const data = res?.data?.data;

      const mapped = (data?.items || []).map((item) => ({
        item_id: item.itemId,
        food_id: item.foodId,
        name: item.foodName,
        price: Number(item.price) || 0,
        image: item.image,
        qty: Number(item.quantity) || 0,
      }));

      setCart(mapped);
    } catch (error) {
      console.error("Load cart error:", error);
      setCart([]);
    } finally {
      setLoadingCart(false);
    }
  }, [isLoggedIn]);



  const loadFavorites = useCallback(async () => {
    if (!isLoggedIn) {
      setFavorites([]);
      return;
    }

    try {
      setLoadingFavorites(true);

      const res = await favoriteService.getMyFavorite();

      const data = res?.data?.data;

      let favoriteIds = [];

      if (Array.isArray(data)) {
        favoriteIds = data
          .map((item) => item?.foodId ?? item?.id)
          .filter(Boolean)
          .map(Number);
      } else if (Array.isArray(data?.favoriteIds)) {
        favoriteIds = data.favoriteIds.filter(Boolean).map(Number);
      }

      setFavorites(favoriteIds);
    } catch (error) {
      console.error("Load favorites error:", error);
      setFavorites([]);
    } finally {
      setLoadingFavorites(false);
    }
  }, [isLoggedIn]);

 

  useEffect(() => {
    if (!isLoggedIn) {
      setCart([]);
      setFavorites([]);
      return;
    }

    loadCart();
    loadFavorites();
  }, [isLoggedIn, loadCart, loadFavorites]);



  const addToCart = useCallback(
    async (item, quantity = 1) => {
      if (!isLoggedIn || !item?.id) {
        return false;
      }

      try {
        await cartService.addToCart({
          foodId: item.id,
          quantity,
        });

        // Đồng bộ lại context
        await loadCart();

        return true;
      } catch (error) {
        console.error("Add to cart error:", error);
        return false;
      }
    },
    [isLoggedIn, loadCart],
  );

 

  const updateCart = useCallback(
    async (id, delta) => {
      if (!isLoggedIn) {
        return false;
      }

      try {
        const item = cart.find(
          (cartItem) => Number(cartItem.item_id) === Number(id),
        );

        if (!item) {
          return false;
        }

        const newQty = Math.max(0, (item.qty || 0) + delta);

        if (newQty <= 0) {
          await cartService.deleteCart(id);
        } else {
          await cartService.updateCart(id, {
            quantity: newQty,
          });
        }

        await loadCart();

        return true;
      } catch (error) {
        console.error("Update cart error:", error);
        return false;
      }
    },
    [cart, isLoggedIn, loadCart],
  );



  const setCartQuantity = useCallback(
    async (id, quantity) => {
      if (!isLoggedIn) {
        return false;
      }

      try {
        const newQty = Number(quantity);

        if (newQty <= 0) {
          await cartService.deleteCart(id);
        } else {
          await cartService.updateCart(id, {
            quantity: newQty,
          });
        }

        await loadCart();

        return true;
      } catch (error) {
        console.error("Set cart quantity error:", error);
        return false;
      }
    },
    [isLoggedIn, loadCart],
  );



  const removeItem = useCallback(
    async (id) => {
      if (!isLoggedIn) {
        return false;
      }

      try {
        await cartService.deleteCart(id);

        await loadCart();

        return true;
      } catch (error) {
        console.error("Remove cart item error:", error);
        return false;
      }
    },
    [isLoggedIn, loadCart],
  );



  const toggleFavorite = useCallback(
    async (id) => {
      if (!isLoggedIn) {
        return false;
      }

      const foodId = Number(id);

      const isFavorite = favorites.some(
        (favoriteId) => Number(favoriteId) === foodId,
      );

      // Optimistic update
      setFavorites((prev) => {
        if (isFavorite) {
          return prev.filter((favoriteId) => Number(favoriteId) !== foodId);
        }

        return [...prev, foodId];
      });

      try {
        await favoriteService.toggleFavorite(foodId);

        return true;
      } catch (error) {
        console.error("Toggle favorite error:", error);

        // Rollback
        setFavorites((prev) => {
          if (isFavorite) {
            return [...prev, foodId];
          }

          return prev.filter((favoriteId) => Number(favoriteId) !== foodId);
        });

        return false;
      }
    },
    [favorites, isLoggedIn],
  );


  const cartMap = useMemo(() => {
    return Object.fromEntries(
      cart.map((item) => [Number(item.item_id), Number(item.qty) || 0]),
    );
  }, [cart]);



  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + (Number(item?.qty) || 0), 0);
  }, [cart]);



  const favoriteCount = useMemo(() => {
    return favorites.length;
  }, [favorites]);



  const cartSubtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + (Number(item?.price) || 0) * (Number(item?.qty) || 0),
      0,
    );
  }, [cart]);



  const value = useMemo(
    () => ({
      // Data
      cart,
      favorites,

      // Loading
      loadingCart,
      loadingFavorites,

      // Computed
      cartMap,
      cartCount,
      favoriteCount,
      cartSubtotal,

      // Load
      loadCart,
      loadFavorites,

      // Cart
      addToCart,
      updateCart,
      setCartQuantity,
      removeItem,

      // Favorite
      toggleFavorite,
    }),
    [
      cart,
      favorites,
      loadingCart,
      loadingFavorites,
      cartMap,
      cartCount,
      favoriteCount,
      cartSubtotal,
      loadCart,
      loadFavorites,
      addToCart,
      updateCart,
      setCartQuantity,
      removeItem,
      toggleFavorite,
    ],
  );

  return (
    <CustomerDataContext.Provider value={value}>
      {children}
    </CustomerDataContext.Provider>
  );
};



export const useCustomerData = () => {
  const context = useContext(CustomerDataContext);

  if (!context) {
    throw new Error(
      "useCustomerData phải được sử dụng bên trong CustomerDataProvider",
    );
  }

  return context;
};
