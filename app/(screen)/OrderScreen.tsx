import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { getNotificationsByUserId } from "@/api/api";
import { useRouter } from "expo-router";
import { getOrdersByUserId } from "@/api/api";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from "@/context/contextAuth";

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

const STATUS_COLOR = {
  pending: "#F8B400",
  delivered: "#4BB543",
  cancelled: "#F83758",
};

type Order = {
  _id: string;
  order_id: number | string;
  created_at?: string;
  quantity?: number;
  total_amount: number;
  status: string;
};

type OrderTabProps = {
  status: "pending" | "delivered" | "cancelled";
  orders: Order[];
  onDetails: (order: Order) => void;
};

const OrderTab: React.FC<OrderTabProps> = ({ status, orders, onDetails }) => 
{
  const validOrders = Array.isArray(orders) ? orders : [];
  
  if (validOrders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>You haven't orders</Text>
      </View>
    );
  }else{
  return(
    <FlatList
      data={orders}
      keyExtractor={(item, index) => item._id ? String(item._id) : String(item.order_id) + '-' + index}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.orderId}>Order #{item.order_id}</Text>
            <Text style={styles.date}>{item.created_at?.slice(0, 10)}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
            <Text style={styles.quantity}>Quantity: {item.quantity || 1}</Text>
            <Text style={styles.quantity}>Subtotal: ${item.total_amount}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
              <Text style={[styles.status, { color: STATUS_COLOR[status] }]}>{status.toUpperCase()}</Text>
              <TouchableOpacity style={styles.detailsBtn} onPress={() => onDetails(item)}>
                  <Text style={styles.detailsText}>Details</Text>
              </TouchableOpacity>
          </View>
        </View>
      )}
      ListEmptyComponent={<Text style={{ textAlign: "center", color: "#888", marginTop: 30 }}>No orders</Text>}
    />
  );
}
};

const OrderScreen = () => {
  const [tab, setTab] = useState<"pending" | "delivered" | "cancelled">("pending");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Lấy user từ context auth
  const user_id = user?.uid || "firebase-uid-1"; // Lấy từ context thực tế nếu có
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Bạn cần tạo API getOrdersByUserId trả về tất cả đơn hàng của user
        const allOrders = await getOrdersByUserId(user_id);
        console.log("Fetched orders:", allOrders);
        // Kiểm tra xem allOrders có phải là mảng không
        if (Array.isArray(allOrders)) {
          setOrders(allOrders);
        } else {
          console.error("Dữ liệu trả về không phải là mảng:", allOrders);
          setOrders([]);
        }
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => o.status === tab);

  const handleDetails = (order:any) => {
    router.push({ pathname: '/(screen)/OrderInfo', params: { orderId: order.order_id } });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Orders</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ position: "absolute", left: 10 }}>
            <Ionicons name="chevron-back" size={28} />
        </TouchableOpacity>
      </View>
      <View style={styles.tabBar}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && styles.activeTab]}
            onPress={() => setTab(t.key as "pending" | "delivered" | "cancelled")}
          >
            <Text style={[styles.tabText, tab === t.key && styles.activeTabText]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flex: 1 }}>
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 40 }}>Loading...</Text>
        ) : (
          <OrderTab status={tab} orders={filteredOrders} onDetails={handleDetails} />
        )}
      </View>
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  tabBar: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16 },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#F4F4F4",
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: "#222",
  },
  tabText: {
    color: "#222",
    fontWeight: "500",
    fontSize: 16,
  },
  activeTabText: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  orderId: { fontWeight: "bold", fontSize: 16 },
  date: { color: "#888", fontSize: 13 },
  tracking: { color: "#888", marginTop: 4 },
  quantity: { fontSize: 15 },
  subtotal: { fontWeight: "bold", fontSize: 15 },
  status: { fontWeight: "bold", marginTop: 8 },
  detailsBtn: {
    alignSelf: "flex-end",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  detailsText: { color: "#222", fontWeight: "500" },
    emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});
