import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { papal, visa, maestro, appleImag } from "@/contants/image/img";
import { useCart } from "@/context/contexCart";
import { addOrder, addOrderItem } from "@/api/api";
import { check } from "@/contants/image/img";
import Stepper from "@/component/Stepper";
import { useNotification } from "@/context/NotificationContext";
import { useAuth } from "@/context/contextAuth";
const checkPayment = () => {
  const router = useRouter();
  const { total, selectedItems, productNames } = useLocalSearchParams();
  const { removeFromCart, cartItems } = useCart();
  const parsedSelectedItems =
    typeof selectedItems === "string" ? JSON.parse(selectedItems) : [];
  const parsedProductNames =
    typeof productNames === "string" ? JSON.parse(productNames) : [];
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const handlePress = (paymentType: any) => {
    setSelectedPayment(paymentType);
  };

  const { addNotification } = useNotification();
  const { user } = useAuth();
  const user_id = user?.uid; // Đây là user_id thực tế từ Firebase Auth
  const handlePayment = () => {
    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Tạo message chứa tên sản phẩm đã thanh toán
      const productList = parsedProductNames.join(", ");
      const message = `Bạn đã thanh toán: ${productList}`;
      // Thêm notification mới
      addNotification({
        _id: Date.now().toString(),
        user_id: user_id || "",
        message,
        created_at: new Date().toISOString(),
      });
      setLoading(false);
      setShowSuccessModal(true);
    }, 1500); // Hiệu ứng loading 1.5s
  };

  const handleContinueAfterSuccess = async () => {
    // Lưu đơn hàng vào json-server
    try {
      // Lấy các item đã chọn từ cart
      const selectedCartItems = cartItems.filter((item) => parsedSelectedItems.includes(item._id));
      // Tạo order_id random (có thể dùng Date.now hoặc uuid)
      const order_id = Date.now();
      // Lấy địa chỉ giao hàng (giả lập, bạn có thể lấy từ context hoặc truyền từ màn trước)
      const shipping_address = "123 Main St, Hanoi, Vietnam"; // Sử dụng địa chỉ mặc định hoặc lấy từ context
      // Tạo đơn hàng
      const orderData = {
        order_id,
        user_id: user_id || "",
        total_amount: parseFloat(Array.isArray(total) ? total[0] : total as string),
        status: "pending",
        shipping_address,
        created_at: new Date().toISOString(),
       };
      await addOrder(orderData);
      // Thêm từng sản phẩm vào order_items
      for (const item of selectedCartItems) {
        const orderItemData = {
          order_item_id: Date.now() + Math.floor(Math.random() * 10000),
          order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          _id: (Date.now() + Math.floor(Math.random() * 10000)).toString(),
        };
        await addOrderItem(orderItemData);
      }
      // Xóa các sản phẩm đã thanh toán khỏi giỏ hàng
      for (const cartId of parsedSelectedItems) {
        await removeFromCart(cartId);
      }
    } catch (err) {
      // Có thể hiển thị thông báo lỗi nếu cần
      console.error("Lỗi khi lưu đơn hàng:", err);
    }
    setShowSuccessModal(false);
    // Chuyển sang màn hình OrderCompleted
    router.replace({
      pathname: "/(screen)/OrderCompleted",
    });
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <Link href="/(drawer)/(tabs)/shop" style={styles.cartIcon}>
          <FontAwesome6 name="heart" size={20} />
        </Link>
      </View>

      {/* Stepper - hiển thị các bước */}
      <Stepper step={2} />
      <View style={styles.cartDetail}>
        <View style={[styles.row]}>
          <Text style={styles.text}>Order</Text>
          <Text style={styles.text}>{parseFloat(total as string) - 30}</Text>
        </View>
        <View style={[styles.row]}>
          <Text style={styles.text}>Shipping</Text>
          <Text style={styles.text}>30</Text>
        </View>
        <View style={[styles.row]}>
          <Text style={[styles.text, { color: "black" }]}>Total</Text>
          <Text style={[styles.text, { color: "black" }]}>{total}</Text>
        </View>
      </View>

      {/* Payment Methods */}
      <Text style={{ fontSize: 18 }}>Payment</Text>
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          style={[
            styles.row,
            styles.cart,
            selectedPayment === "visa" && styles.selectedCart,
          ]}
          onPress={() => handlePress("visa")}
        >
          <Image source={visa} />
          <Text style={{ color: "#c4c4c4" }}>**** **** **** 2709</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.row,
            styles.cart,
            selectedPayment === "maestro" && styles.selectedCart,
          ]}
          onPress={() => handlePress("maestro")}
        >
          <Image source={maestro} />
          <Text style={{ color: "#c4c4c4" }}>**** **** **** 2709</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.row,
            styles.cart,
            selectedPayment === "paypal" && styles.selectedCart,
          ]}
          onPress={() => handlePress("paypal")}
        >
          <Image source={papal} />
          <Text style={{ color: "#c4c4c4" }}>**** **** **** 2709</Text>
        </TouchableOpacity>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#F83758",
          justifyContent: "center",
          alignItems: "center",
          padding: 15,
          borderRadius: 8,
        }}
        onPress={handlePayment}
      >
        <Text style={{ color: "#fff", fontSize: 22 }}>Continue</Text>
      </TouchableOpacity>

      {/* Loading Modal */}
      <Modal
        visible={loading}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.successText}>Processing payment...</Text>
            <View style={{ marginTop: 20 }}>
              <ActivityIndicator size="large" color="#F83758" />
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.checkIconContainer}>
              <Image
                source={check}
                style={{ width: 50, height: 50 }}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.successText}>Payment done successfully.</Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinueAfterSuccess}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default checkPayment;

const styles = StyleSheet.create({
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  stepItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dottedLine: {
    width: 60,
    height: 2,
    borderStyle: 'dotted',
    borderWidth: 1,
    borderRadius: 1,
    borderColor: '#C4C4C4',
    marginHorizontal: 2,
  },
  stepLabel: {
    fontSize: 12,
    color: '#C4C4C4',
    marginTop: 4,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
  },
  cartIcon: {
    padding: 5,
  },
  cartDetail: {
    borderTopColor: "#C6C6C6",
    borderTopWidth: 1,
    borderBottomColor: "#C9C9C9",
    borderBottomWidth: 1,
    gap: 15,
    paddingVertical: 15,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "#A8A8A9",
  },
  cart: {
    backgroundColor: "#F4F4F4",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  selectedCart: {
    borderWidth: 2,
    borderColor: "#F83758",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    width: "80%",
  },
  checkIconContainer: {
    backgroundColor: "#F83758",
    borderRadius: 50,
    padding: 10,
    marginBottom: 20,
  },
  successText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 20,
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  paymentIcon: {
    width: 30,
    height: 20,
    marginRight: 10,
  },
  cardNumber: {
    fontSize: 16,
    color: "#666",
  },
  continueButton: {
    backgroundColor: "#F83758",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
