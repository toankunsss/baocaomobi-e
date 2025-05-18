import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Link, router } from "expo-router";
import { ggImag, logo } from "@/contants/image/img";
import React, { useState } from "react";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import FontAwesome from "react-native-vector-icons/FontAwesome";
// import * as Speech from "expo-speech";


const Header = () => {
  const navigation = useNavigation();
  const [text, setText] = useState("");
  // const speak = () => {
  //   if (text.trim() !== "") {
  //     Speech.speak(text);
  //   }
  // };

  return (
    <>
      <View style={styles.contrainer}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.logocontainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        <View style={styles.component}>
          <Link href="/(screen)/profile">
            <Image
              source={ggImag}
              style={{ resizeMode: "contain", height: 40, width: 40 }}
            />
          </Link>
        </View>
      </View>
      <>
        <TouchableOpacity style={styles.containerSearch} onPress={() => {router.push("/(screen)/searchScreen")}}>
          <Feather name="search" size={18} color="#BBBBBB" style={{ marginRight: 8 }} />
          <Text style={styles.searchText}>Tìm kiếm sản phẩm...</Text>
        </TouchableOpacity>
        <View style={styles.containerFeather}>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>ALL Featured</Text>
          <View style={{ flexDirection: "row", gap: 15 }}>
            {/* <View style={styles.featured}>
              <Text style={styles.textFeatured}>Sort</Text>
              <FontAwesome name="sort" size={14} />
            </View>
            <View style={styles.featured}>
              <Text style={styles.textFeatured}>Filter</Text>
              <FontAwesome name="filter" size={14} />
            </View> */}
          </View>
        </View>
      </>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  contrainer: {
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
    flexDirection: "row",
    paddingHorizontal: 16,
    backgroundColor: "#F9F9F9",
  },
  logocontainer: {

  },
  component: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
  },
  menu: {
    backgroundColor: "#F2F2F2",
  },
  logo: {
    height: 35,
    width: 111,
    resizeMode: "stretch",
  },
  containerSearch: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginHorizontal: 17,
    backgroundColor: "#F3F4F6", // màu nền nhẹ nhàng hơn
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 2,
  },
  searchText: {
    color: '#A0A0A0',
    fontSize: 15,
    marginLeft: 2,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  containerFeather: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 17,
    marginVertical: 10,
  },
  textInputDesign: {
    flex: 1,
    fontSize: 14,
  },
  featured: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "#fff",
    gap: 5,
  },
  textFeatured: {
    fontSize: 14,
  },
});
