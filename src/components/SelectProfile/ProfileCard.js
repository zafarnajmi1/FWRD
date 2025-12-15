// components/ProfileCard.js
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import colors from "../../assets/colors";

const ProfileCard = ({ title, onEdit }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <Pressable onPress={onEdit}>
        <Text style={styles.edit}>Edit</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
   
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.black,
  },
  edit: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary, 
  },
});

export default ProfileCard;
