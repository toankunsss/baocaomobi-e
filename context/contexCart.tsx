import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { addToCartAPI, getCartByUserId, updateCartItemAPI } from "@/api/api";
import { useAuth } from "@/context/contextAuth";
import axios from "axios";

// Định nghĩa interface cho CartItem
interface CartItem {
  _id: string;
  name: string;
  image: string;
  rating: number;
  price: number;
  oldPrice: number;
  discount: string;
  variations: string[];
  quantity: number;
  size?: string;
  color?: string;
  user_id: string;
  product_id: string;
  added_at: string;
}

// Định nghĩa interface cho CartContext
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "_id">) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
}

// Tạo CartContext
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hàm sinh ID cục bộ tạm thời
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Hàm xóa mục trên server
const deleteCartItemAPI = async (id: string) => {
  try {
    await axios.delete(`http://localhost:5000/api/cart/${id}`);
    console.log(`Cart item deleted successfully, id: ${id}`);
  } catch (error) {
    console.error(`Error deleting cart item, id: ${id}`, error);
    throw error;
  }
};

// CartProvider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Lấy dữ liệu giỏ hàng khi user thay đổi
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCartItems([]);
        return;
      }

      try {
        const cartData = await getCartByUserId(user.uid);
        setCartItems(
          cartData.map((item: CartItem) => ({
            ...item,
            _id: item._id || generateUniqueId(), // Đảm bảo _id luôn tồn tại
          }))
        );
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setCartItems([]);
      }
    };
    fetchCart();
  }, [user]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (item: Omit<CartItem, "_id">) => {
    const existingItem = cartItems.find(
      (i) =>
        i.product_id === item.product_id &&
        i.size === item.size &&
        i.color === item.color &&
        i.user_id === item.user_id
    );

    console.log("addToCart called", { item, existingItem });

    if (existingItem) {
      // Cập nhật số lượng nếu sản phẩm đã tồn tại
      const updatedQuantity = existingItem.quantity + item.quantity;
      setCartItems((prevItems) =>
        prevItems.map((i) =>
          i._id === existingItem._id
            ? { ...i, quantity: updatedQuantity }
            : i
        )
      );

      try {
        await updateCartItemAPI(existingItem._id, {
          ...existingItem,
          quantity: updatedQuantity,
        });
      } catch (error) {
        console.error("Error updating cart item:", error);
        // Khôi phục trạng thái nếu cập nhật server thất bại
        setCartItems((prevItems) =>
          prevItems.map((i) =>
            i._id === existingItem._id
              ? { ...i, quantity: existingItem.quantity }
              : i
          )
        );
        throw error;
      }
    } else {
      // Thêm sản phẩm mới
      const tempId = generateUniqueId();
      const newItem: CartItem = {
        ...item,
        _id: tempId,
        added_at: new Date().toISOString(),
      };

      setCartItems((prevItems) => [...prevItems, newItem]);

      try {
        const serverResponse = await addToCartAPI({
          user_id: item.user_id,
          product_id: item.product_id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price,
          oldPrice: item.oldPrice,
          name: item.name,
          image: item.image,
          discount: item.discount,
          added_at: item.added_at,
        });

        // Cập nhật _id từ server
        setCartItems((prevItems) =>
          prevItems.map((i) =>
            i._id === tempId ? { ...i, _id: serverResponse._id } : i
          )
        );
      } catch (error) {
        console.error("Error adding to cart:", error);
        // Xóa item nếu thêm vào server thất bại
        setCartItems((prevItems) => prevItems.filter((i) => i._id !== tempId));
        throw error;
      }
    }
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = async (id: string, quantity: number) => {
    const item = cartItems.find((i) => i._id === id);
    if (!item) return;

    const newQuantity = Math.max(1, quantity);
    setCartItems((prevItems) =>
      prevItems.map((i) =>
        i._id === id ? { ...i, quantity: newQuantity } : i
      )
    );

    try {
      await updateCartItemAPI(id, {
        ...item,
        quantity: newQuantity,
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      // Khôi phục trạng thái nếu cập nhật server thất bại
      setCartItems((prevItems) =>
        prevItems.map((i) =>
          i._id === id ? { ...i, quantity: item.quantity } : i
        )
      );
      throw error;
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (id: string) => {
    const item = cartItems.find((i) => i._id === id);
    if (!item) return;

    setCartItems((prevItems) => prevItems.filter((i) => i._id !== id));

    try {
      await deleteCartItemAPI(id);
      console.log(`Cart item removed successfully, id: ${id}`);
    } catch (error) {
      console.error("Error removing cart item:", error);
      // Khôi phục item nếu xóa server thất bại
      setCartItems((prevItems) => [...prevItems, item]);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook để sử dụng CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};