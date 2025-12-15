// components/ProfileCard.js
import React from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import colors from "../../assets/colors";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import images from "../../assets/images";
const ManageCards = ({ title, onEdit, onDelete }) => {
  return (
    
    <View style={styles.card}>
      
      <Image source={images.nfcCardicon} style={styles.profileImage} />

     
      <Text style={styles.title} numberOfLines={1}>{title}</Text>

      <View style={styles.actions}>
        <Pressable onPress={onEdit} style={styles.iconWrapper}>
          <Image source={images.Pincel} style={styles.iconButton} resizeMode="contain" />
        </Pressable>
        <Pressable onPress={onDelete} style={styles.iconWrapper}>
          <Image source={images.trash} style={styles.iconButton} resizeMode="contain" />
        </Pressable>
      </View>
      </View>
   
  );
};

const styles = StyleSheet.create({
   
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: wp(4), 
    paddingVertical: hp(1.5), 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(1),

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    //elevation: 3, // for Android shadow
  },
  profileImage: {
    width: wp(10), 
    height: wp(10), 
    borderRadius: wp(5),
    marginRight: wp(3),
  },
  title: {
    flex: 1,
    fontSize: wp(3.5), 
    fontWeight: "500",
    color: colors.black,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    marginLeft: wp(3),
  },
  iconButton: {
    width: wp(5), 
    height: wp(5), 
  },
});

export default ManageCards;
