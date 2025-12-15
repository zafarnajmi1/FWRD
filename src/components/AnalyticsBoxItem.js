import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../assets/colors";
import { Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const H_PADDING = 30 * 2; // container padding
const GAP = 12; // space between items
const ITEM_WIDTH = (SCREEN_WIDTH - H_PADDING - GAP * 1) / 3;


const AnalyticsBoxItem = ({ date, hours, minutes }) => {
  return (
    <View style={styles.box}>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.time}>{hours}h</Text>
      <Text style={styles.time}>{minutes}m</Text>
    </View>
  );
};

export default AnalyticsBoxItem;

const styles = StyleSheet.create({
  box: {
    width: ITEM_WIDTH,
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 12,
    marginHorizontal: 5,
  },
  date: {
    fontSize: 11,
    color: colors.muted,
    marginBottom: 6,
  },
  time: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
  },
});
