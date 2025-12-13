import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import colors from "../assets/colors";

const AnalyticsCardItem = ({ date, hours, minutes }) => {
  return (
    <Pressable style={styles.card}>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.time}>
        {hours}h {minutes}m
      </Text>
    </Pressable>
  );
};

export default AnalyticsCardItem;

const styles = StyleSheet.create({
  card: {
    width:"100%",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  date: {
    fontSize: 13,
    color: colors.muted,
  },
  time: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
});
