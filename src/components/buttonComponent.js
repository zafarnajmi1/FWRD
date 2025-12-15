import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import colors from '../assets/colors';

const ButtonComponent = ({
   title, onPress, disabled ,
   gradientColors = [colors.buttonColor1, colors.buttonColor2],
  textColor = colors.white,

}) => {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: colors.black,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    //elevation: 3,
  },
  text: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
});

export default ButtonComponent;
