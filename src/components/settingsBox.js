import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import Images from '../assets/images'; 
import colors from '../assets/colors';

 const SettingOptions = ({ title, onPress, danger }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.box,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.title,
          danger && styles.dangerText,
        ]}
      >
        {title}
      </Text>

     
        <Image
          source={Images.rightArrow}
          style={styles.arrow}
          resizeMode="contain"
        />
      
    </Pressable>
  );
};

export default SettingOptions;

const styles = StyleSheet.create({
  box: {
    width:"100%",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 0, 
    //shadowColor: '#000', 
    //shadowOpacity: 0.08,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 2 },
  },
  pressed: {
    opacity: 0.1,
  },
  title: {
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
  },
  dangerText: {
    color: '#E53935', 
    fontWeight: '600',
  },
  arrow: {
    width: 16,
    height: 16,
  },
});

