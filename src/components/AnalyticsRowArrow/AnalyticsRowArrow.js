import React from "react";
import { View, Text, Pressable } from "react-native";
import styles from "./AnalyticsRowArrow.styles";

const TaskRowArrow = ({ item, onPress }) => {
  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
    >
      <View style={styles.box}>
        <View style={styles.leftContainer}>
          <Text style={styles.dateText}>{item.date}</Text>
          <Text style={styles.hoursText}>{item.hours}</Text>
          <Text style={styles.minutesText}>{item.minutes}</Text>
        </View>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </Pressable>
  );
};

export default TaskRowArrow;

