import axios from "axios";

// Lấy tất cả đơn hàng của user
export const getOrdersByUserId = async (user_id) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/orders/by-user?user_id=${user_id}`);
    console.log("Dữ liệu trả về từ API của đơn hàng:", user_id);
    console.log("Dữ liệu trả về từ API của đơn hàng:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng:", error);
    return [];
  }
};
// Thêm đơn hàng mới
export const addOrder = async (orderData) => {
  try {
    const response = await axios.post("http://localhost:5000/api/orders", orderData);
    console.log("Dữ liệu trả về từ API của đơn hàng:", response.data);
    // Kiểm tra nếu response.data là một mảng, trả về phần tử đầu tiên
    return response.data;

  } catch (error) {
    console.error("Lỗi khi thêm đơn hàng:", orderData, error);
    throw error;

  }
};

// Thêm order item mới
export const addOrderItem = async (orderItemData) => {
  try {
    const response = await axios.post("http://localhost:5000/api/order_items", orderItemData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm order item:", error);
    throw error;
  }
};
// Thêm notification mới cho user
export const addNotification = async (notificationData) => {
  try {
    const response = await axios.post("http://localhost:5000/api/notification", notificationData);
    console.log("Dữ liệu trả về từ API của notification:", response.data);
    // Kiểm tra nếu response.data là một mảng, trả về phần tử đầu tiên
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm notification:", error);
    throw error;
  }
};

// Lấy danh sách notification của user
export const getNotificationsByUserId = async (user_id) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/notification/by-user?user_id=${user_id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy notification:", error);
    return [];
  }
};
// Cập nhật trạng thái isSelected cho địa chỉ (chọn 1, bỏ chọn các địa chỉ khác của user)
export const selectAddress = async (user_id, selected_id) => {
  try {
    // Lấy tất cả địa chỉ của user
    const res = await axios.get(`http://localhost:5000/api/address/by-user?user_id=${user_id}`);
    const addresses = res.data;
    // Cập nhật từng địa chỉ: địa chỉ được chọn thì isSelected=true, còn lại false
    console.log("Cập nhật địa chỉ với user_id:", user_id, "và selected_id:", selected_id,addresses._id);
    await Promise.all(addresses.map(addr => {
      return axios.put(`http://localhost:5000/api/address/${addr._id}`, {
        ...addr,
        isSelected: addr._id === selected_id
      });
    }));
    return true;
  } catch (error) {
    console.error("Lỗi khi cập nhật isSelected:", error);
    return false;
  }
};
// Xóa địa chỉ theo id
export const deleteAddressById = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/address/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa địa chỉ:", error);
    throw error;
  }
};

// Cập nhật địa chỉ theo id
export const updateAddressById = async (id, addressData) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/address/${id}`, addressData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật địa chỉ:", error);
    throw error;
  }
};
// Thêm địa chỉ mới cho user
export const addAddressForUser = async (addressData) => {
  try {
    const response = await axios.post("http://localhost:5000/api/address", addressData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm địa chỉ mới:", error);
    throw error;
  }
};
// Lấy danh sách địa chỉ của user theo user_id
export const getAddressesByUserId = async (user_id) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/address/by-user?user_id=${user_id}`);
    // Lọc lại cho chắc chắn đúng user_id
    const addresses = response.data.filter(addr => addr.user_id === user_id);
    if (addresses.length === 0) {
      return { message: "Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.", addresses: [] };
    }
    return { addresses };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách địa chỉ:", error);
    return { message: "Không thể lấy danh sách địa chỉ.", addresses: [] };
  }
};
import BASE_URL from "./axiosConfig";

// Get all products
export const getProducts = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/products");
    console.log("Dữ liệu trả về:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error.message);
    if (error.response) {
      console.error("Response error:", error.response.data);
    }
    return [];
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
    if (response.data.length === 0) {
      throw new Error("Không tìm thấy sản phẩm với ID đã cho.");
    }
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy sản phẩm với ID ${productId}:`, error);
    throw error;
  }
};
// Get categories
export const getCategories = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/categories");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    return [];
  }
};
// Get reviews for a product
export const getReviewsByProductId = async (productId) => {
  try {
    const response = await BASE_URL.get(`/reviews?product_id=${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post("http://localhost:5000/api/users", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get information of a user
export const getUserById = async (uid) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/users/${uid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user information
export const updateUser = async (uid, userData) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/users/${uid}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get cart by user ID
export const getCartByUserId = async (user_id) => {
  try {
    const cartResponse = await axios.get(`http://localhost:5000/api/cart/by-user?user_id=${user_id}`);
    let cartData = cartResponse.data;

    // Lọc các mục có user_id khớp với user_id hiện tại
    cartData = cartData.filter(
      (item) => item.user_id && item.user_id === user_id
    );

    // Gọi API để lấy danh sách sản phẩm
    const productsResponse = await axios.get("http://localhost:5000/api/products");
    const products = productsResponse.data;

    // Bổ sung thông tin price, oldPrice, name, image, discount cho từng item
    const enrichedCartData = cartData.map((cartItem) => {
      const product = products.find(
        (p) => p.product_id === cartItem.product_id
      );
      return {
        ...cartItem,
        name: cartItem.name || product?.name || "Unknown Product",
        image:
          cartItem.image ||
          product?.images?.[0] ||
          "https://via.placeholder.com/120",
        price:
          cartItem.price !== undefined
            ? cartItem.price
            : product?.sale_price || 0,
        oldPrice:
          cartItem.oldPrice !== undefined
            ? cartItem.oldPrice
            : product?.original_price || 0,
        discount:
          cartItem.discount ||
          (product
            ? `${(
              ((product.original_price - product.sale_price) /
                product.original_price) *
              100
            ).toFixed(0)}%`
            : "0%"),
      };
    });

    return enrichedCartData;
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    return [];
  }
};

// Add to cart API
export const addToCartAPI = async (cartData) => {
  try {
    const response = await axios.post("http://localhost:5000/api/cart", {
      user_id: cartData.user_id,
      product_id: cartData.product_id,
      quantity: cartData.quantity,
      size: cartData.size,
      color: cartData.color,
      price: cartData.price,
      oldPrice: cartData.oldPrice,
      name: cartData.name,
      image: cartData.image,
      discount: cartData.discount,
      added_at: cartData.added_at,
    });
    console.log("Dữ liệu trả về từ API của giỏ hàng:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    throw error;
  }
};

// Update cart item API
export const updateCartItemAPI = async (serverId, cartData) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/cart/${serverId}`, {
      user_id: cartData.user_id,
      product_id: cartData.product_id,
      quantity: cartData.quantity,
      size: cartData.size,
      color: cartData.color,
      price: cartData.price,
      oldPrice: cartData.oldPrice,
      name: cartData.name,
      image: cartData.image,
      discount: cartData.discount,
      added_at: cartData.added_at,
    });
    console.log("Dữ liệu trả về từ API của giỏ hàng:", response.data);
    console.log("Cập nhật giỏ hàng thành công:",serverId);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error);
    throw error;
  }
};

export const updateCustomerInfo = async (uid, updatedData) => {
  try {
    const currentUserData = await getUserById(uid);
    const userDataToUpdate = {
      ...currentUserData,
      pincode: updatedData.pincode || currentUserData.pincode,
      address: updatedData.address || currentUserData.address,
      city: updatedData.city || currentUserData.city,
      state: updatedData.state || currentUserData.state,
      country: updatedData.country || currentUserData.country,
      bankAccountNumber: updatedData.bankAccountNumber || currentUserData.bankAccountNumber,
      accountHolderName: updatedData.accountHolderName || currentUserData.accountHolderName,
      ifscCode: updatedData.ifscCode || currentUserData.ifscCode,
      image: updatedData.image || currentUserData.image,
    };
    const response = await updateUser(uid, userDataToUpdate);
    console.log("Cập nhật thông tin thành công:", response);
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin khách hàng:", error);
    throw error;
  }
};

// Add to wishlist API
export const addToWishlistAPI = async (wishlistData) => {
  try {
    const response = await axios.post("http://localhost:5000/api/wishlist", {
      user_id: wishlistData.user_id,
      product_id: wishlistData.product_id,
      added_at: wishlistData.added_at,
    });
    console.log("Dữ liệu trả về từ API:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm vào wishlist:", error);
    throw error;
  }
};

// Remove from wishlist API
export const removeFromWishlistAPI = async (wishlistId) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/wishlist/${wishlistId}`);
    return response.data;
  } catch (error) {
   console.log("Dữ liệu trả về từ API:", wishlistId);
    console.error("Lỗi khi xóa khỏi wishlist:", error);
    throw error;
  }
};

// Get wishlist by user ID
export const getWishlistByUserId = async (user_id) => {
  try {
    const wishlistResponse = await axios.get(`http://localhost:5000/api/wishlist/by-user?user_id=${user_id}`);
    let wishlistData = wishlistResponse.data;

    // Filter items by user_id
    wishlistData = wishlistData.filter(
      (item) => item.user_id && item.user_id === user_id
    );

    // Fetch products to enrich wishlist data
    const productsResponse = await axios.get("http://localhost:5000/api/products");
    const products = productsResponse.data;

    // Enrich wishlist data with product details
    const enrichedWishlistData = wishlistData.map((wishlistItem) => {
      const product = products.find(
        (p) => p.product_id === wishlistItem.product_id
      );
      return {
        ...wishlistItem,
        name: product?.name || "Unknown Product",
        images: product?.images || ["https://via.placeholder.com/120"],
        description: product?.description || "",
        original_price: product?.original_price || 0,
        sale_price: product?.sale_price || 0,
        rating: product?.rating || { average: 0, count: 0 },
        colors: product?.colors || [],
        sizes: product?.sizes || [],
        created_at: product?.created_at || "",
      };
    });

    return enrichedWishlistData;
  } catch (error) {
    console.error("Lỗi khi lấy wishlist:", error);
    return [];
  }
};