import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Images from "../assets/images"; // update path if different

const Header = ({ title, onPlusPress, isShow = false }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

     {isShow ? (
        <TouchableOpacity style={styles.plusButton} onPress={onPlusPress}>
          <Image
            source={Images.plusicon}
            style={styles.plusIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    position: "relative",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
  },

  plusButton: {
    position: "absolute",
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 21,
    
    justifyContent: "center",
    alignItems: "center",
    
  },

  plusIcon: {
    width: 50,
    height: 50,
    
  },
});

export default Header;