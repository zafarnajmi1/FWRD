
import React from "react";
import { Image, StyleSheet, Text, View, Alert } from "react-native";
import colors from "../../assets/colors";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import PrimaryButton from "../../../src/components/buttonComponent";
import images from "../../assets/images";

const AddNfcCard = ({ title }) => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        
        <Text style={styles.titleView}>{title}</Text>

        <View style={styles.centerContent}>
          <Image source={images.nfclock} style={styles.nfclockicon} />

          <Text style={styles.heading}>
            Hold your card near your phone
          </Text>

          <Text style={styles.subheading}>
            We'll detect it automatically. Keep the screen on.
          </Text>
        </View>

      </View>

     
      <View style={styles.buttonView}>
        <PrimaryButton
          title={"Scan NFC Card"}
          onPress={() => Alert.alert("Scan NFC Card")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgcolor,
  },

  wrapper: {
    flex: 1,
    paddingHorizontal: wp(5),
  },

  titleView: {
    fontSize: wp(6),
    fontWeight: "700",
    marginTop: hp(2),
    alignSelf: "center",
  },

  
  centerContent: {
    flex: 1,                    
    justifyContent: "center",    
    alignItems: "center",        
  },

  nfclockicon: {
    width: wp(45),
    height: wp(45),
    resizeMode: "contain",
  },

  heading: {
    marginTop: hp(3),
    fontWeight: "700",
    fontSize: wp(4.5),
    textAlign: "center",
  },

  subheading: {
    marginTop: hp(1),
    fontSize: wp(3.8),
    textAlign: "center",
    color: colors.placeholder,
    paddingHorizontal: wp(10),
  },

  buttonView: {
    paddingBottom: hp(5),
    paddingHorizontal: wp(5),
  },
});

export default AddNfcCard;
