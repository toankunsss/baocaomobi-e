import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { check } from "@/contants/image/img";

const OrderCompleted = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Completed</Text>
      <View style={styles.iconContainer}>
        <Image
          source={check}
          style={{ width: 100, height: 100 }}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.desc}>
        Thank you for your purchase.{"\n"}
        You can view your order in 'My Orders' section.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.navigate("/(drawer)/(tabs)/shop")}
      >
        <Text style={styles.buttonText}>Continue shopping</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderCompleted;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 32,
    color: "#222",
    alignSelf: "flex-start",
    marginLeft: 8,
  },
  iconContainer: {
    marginBottom: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  desc: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#222",
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
});
