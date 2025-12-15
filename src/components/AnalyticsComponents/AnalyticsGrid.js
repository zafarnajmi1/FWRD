import React from "react";
import { View, Text, Pressable } from "react-native";
import styles from "./AnalyticsGrid.styles";

const TaskDetail = ({ item, onPress }) => {
  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
    >
      {/* Box 1 */}
      <View style={styles.box}>
        <Text style={styles.col1}>{item.date1}</Text>
        <Text style={styles.col2}>{item.hours1}</Text>
        <Text style={styles.col3}>{item.minutes1}</Text>
      </View>

      {/* Box 2 */}
      <View style={styles.box}>
        <Text style={styles.col1}>{item.date2}</Text>
        <Text style={styles.col2}>{item.hours2}</Text>
        <Text style={styles.col3}>{item.minutes2}</Text>
      </View>

      {/* Box 3 */}
      <View style={styles.box}>
        <Text style={styles.col1}>{item.date3}</Text>
        <Text style={styles.col2}>{item.hours3}</Text>
        <Text style={styles.col3}>{item.minutes3}</Text>
      </View>
    </Pressable>
  );
};

export default TaskDetail;

