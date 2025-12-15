import React,{useEffect,useState} from "react";
import { Image, StyleSheet, Text, TextInput, View,Pressable, Alert } from "react-native";
import colors from '../../assets/colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Images from "../../assets/images";
import PrimaryButton from '../../../src/components/buttonComponent';

 const Permissions = ({status, title}) => {
    return (
        <View style={style.container}>
         <View style={style.wraper}>
            <Text style={style.titleView}>
               {title}
            </Text>

           <Pressable style={style.selectRow} onPress={()=>{
            Alert.alert("Screentime Permissions")
           }}>
          <View>
            <Text style={style.selectTitle}>Screentime</Text>
            <Text style={style.selectSubtitle}>Required for launcher widgets</Text>
          </View>

          <View style={style.permissionStatus}>
            <Text style={style.status}>Granted</Text>
          </View>
        
        </Pressable>


         <Pressable style={style.selectRow} onPress={()=>{
            Alert.alert("NFC Access permissions")
           }}>
          <View>
            <Text style={style.selectTitle}>NFC Access</Text>
            <Text style={style.selectSubtitle}>Required for NFC card pairing</Text>
          </View>

          <View style={style.permissionStatus}>
            <Text style={style.status}>Granted</Text>
          </View>
        
        </Pressable>
        
          
     </View>
        </View>
    );
}

const style = StyleSheet.create(
{
    container:{
        flex:1,
        backgroundColor:colors.bgcolor
    },
    wraper:{
        flex:1,
        paddingHorizontal:20
    },
    titleView:{
       fontSize:22,
       fontWeight:'700',
        marginBottom: 18,
        alignSelf:'center'
    },
    inputWrapper: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderColor:colors.borderColor,
    paddingHorizontal: 14,
    height: hp(5.5),
    justifyContent: "center",
    marginBottom: 12,
    borderWidth:0.4
  },
  input: {
    fontSize: 16,
    color: colors.black,
  },
  selectRow: {
    marginTop:20,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 4,
  },
  selectSubtitle: {
    fontSize: 13,
    color: colors.subheading,
  },
  
arrow: {
    width: wp(8),
    height: hp(5),
  },
  buttonView:{
     paddingBottom:50,
     paddingHorizontal:20
  },
  permissionStatus:{
    height:hp(3.2),
    paddingHorizontal:12,
    backgroundColor:colors.statusBG,
    borderRadius:5,
    alignSelf:'center',
    justifyContent:'center'
  },
  status:{
    color: colors.statuscolor,
    fontWeight: "400",
  }


}
);
export default Permissions;

