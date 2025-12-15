import React from "react";
import { Image, StyleSheet, Text, TextInput, View,Pressable, Alert } from "react-native";
import colors from '../../assets/colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Images from "../../assets/images";
import PrimaryButton from '../../../src/components/buttonComponent';

const NfcScanView = ({onCross}) => {
    return(
        <View style={styles.container}>
          <View style={styles.wraper}>
        <Pressable style={styles.closeBtn} onPress={onCross}>
           <Image
          source={Images.cross} 
          style={styles.crossIcon}
          resizeMode="contain"
        />
        </Pressable>

       
        <Text style={styles.title}>Ready to Scan</Text>

        
        <Text style={styles.subtitle}>
          Hold your iPhone near the bound NFC tag.
        </Text>

        
        <Image
          source={Images.ScanFram} 
          style={styles.nfcIcon}
          resizeMode="contain"
        />

       
        </View>

        <View style={styles.buttonView}>
        <PrimaryButton
        title="Cancel"
        onPress={onCross}
        
      />
      </View>
        </View>
    );
}

const styles = StyleSheet.create({
  

container:{
        flex:1,
        backgroundColor:colors.bgcolor
    },
    wraper:{
        flex:1,
        paddingHorizontal:20,
        justifyContent:'center',
        alignItems: "center",
    },

  closeBtn: {
    position: "absolute",
    right: 20,
    top: -5,
    zIndex: 10,
  },
  
  title: {
    
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    alignItems: "center",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: "#6B6B6B",
    textAlign: "center",
    lineHeight: 20,
  },
  nfcIcon: {
    width: 100,
    height: 100,
    marginTop: 30,
  },

   crossIcon: {
    width: 20,
    height: 20,
    
  },
  buttonView:{
     paddingBottom:50,
     paddingHorizontal:20
  }
 
});

export default NfcScanView;