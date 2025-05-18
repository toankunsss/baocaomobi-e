import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getOrdersByUserId } from "@/api/api";
import BASE_URL from "@/api/axiosConfig";
import axios from "axios";

const OrderInfo = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<Array<{ _id: any; product_id: number; quantity: number; price: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        // Lấy đơn hàng
        const res = await axios.get(`http://localhost:5000/api/orders?order_id=${orderId}`);
        setOrder(res.data[0]);
        // Lấy order_items
        const itemsRes = await axios.get(`http://localhost:5000/api/order_items/by-order?order_id=${orderId}`);
        setOrderItems(itemsRes.data);
      } catch (err) {
        setOrder(null);
        setOrderItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <Text style={{ textAlign: "center", marginTop: 40 }}>Loading...</Text>;
  }
  if (!order) {
    return <Text style={{ textAlign: "center", marginTop: 40 }}>Order not found</Text>;
  }

  // Tính tổng quantity
  const totalQuantity = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  // Tính tổng phụ
  const subTotal = orderItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  // Shipping giả lập
  const shipping = 0;
  const total = subTotal + shipping;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Order #{order.order_id}</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ position: "absolute", left: 10 }}>
          <Ionicons name="chevron-back" size={28} />
        </TouchableOpacity>
      </View>
      {/* Trạng thái đơn hàng */}

      {/* Thông tin đơn hàng */}
      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Order number</Text>
          <Text style={styles.infoValue}>#{order.order_id}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tracking Number</Text>
          <Text style={styles.infoValue}>IK{order.order_id}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Delivery address</Text>
          <Text style={styles.infoValue}>{order.shipping_address}</Text>
        </View>
      </View>
      {/* Danh sách sản phẩm */}
      <View style={styles.productBox}>
        <FlatList
          data={orderItems}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productRow}>
              <Text style={styles.productName}>Product #{item.product_id}</Text>
              <Text style={styles.productQty}>x{item.quantity}</Text>
              <Text style={styles.productPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          )}
          ListFooterComponent={
            <>
              <View style={styles.productRow}>
                <Text style={styles.productLabel}>Sub Total</Text>
                <Text style={styles.productValue}>${subTotal.toFixed(2)}</Text>
              </View>
              <View style={styles.productRow}>
                <Text style={styles.productLabel}>Shipping</Text>
                <Text style={styles.productValue}>${shipping.toFixed(2)}</Text>
              </View>
              <View style={styles.productRow}>
                <Text style={[styles.productLabel, { fontWeight: "bold" }]}>Total</Text>
                <Text style={[styles.productValue, { fontWeight: "bold" }]}>${total.toFixed(2)}</Text>
              </View>
            </>
          }
        />
      </View>
      {/* Nút tiếp tục mua sắm */}
      <TouchableOpacity style={styles.button} onPress={() => router.replace("/(drawer)/(tabs)/shop")}> 
        <Text style={styles.buttonText}>Continue shopping</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderInfo;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  statusBox: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginBottom: 18,
  },
  statusText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  trackText: { color: "#fff", fontSize: 13, marginTop: 6 },
  infoBox: {
    borderWidth: 1,
    borderColor: "#4BB1F7",
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
    backgroundColor: "#F8FAFF",
  },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  infoLabel: { color: "#888", fontSize: 14 },
  infoValue: { color: "#222", fontSize: 14, fontWeight: "500" },
  productBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#eee",
  },
  productRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  productName: { color: "#222", fontSize: 15 },
  productQty: { color: "#888", fontSize: 15 },
  productPrice: { color: "#222", fontSize: 15 },
  productLabel: { color: "#888", fontSize: 15 },
  productValue: { color: "#222", fontSize: 15 },
  button: {
    backgroundColor: "#222",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "500" },
});
