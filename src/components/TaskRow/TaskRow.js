import React from "react";
import { View, Text, Pressable } from "react-native";
import styles from "./TaskRow.styles";

const TaskRow = ({ item, onPress }) => {
  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
    >
      <View style={styles.box}>
        <Text style={styles.dateText}>{item.date}</Text>
        <View style={styles.timeContainer}>
          <Text style={styles.hoursText}>{item.hours}</Text>
          <Text style={styles.minutesText}>{item.minutes}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default TaskRow;

