import React,{useEffect,useState} from "react";
import { Image, StyleSheet, Text, TextInput, View,Pressable, Alert } from "react-native";
import colors from '../../assets/colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Images from "../../assets/images";
import PrimaryButton from '../../../src/components/buttonComponent';

 const AddProfile = ({status, title}) => {
    const [profileName, setProfileName] = useState("");
    return (
        <View style={style.container}>
         <View style={style.wraper}>
            <Text style={style.titleView}>
               {title}
            </Text>

            <View style={style.inputWrapper}>
                <TextInput
                     value={profileName}
                    onChangeText={setProfileName}
                    placeholder="Profile Name"
                    placeholderTextColor={colors.placeholder}
                    style={style.input}
                />
        </View>
           <Pressable style={style.selectRow} onPress={()=>{
            Alert.alert("Go on Apps")
           }}>
          <View>
            <Text style={style.selectTitle}>Select Apps to Block</Text>
            <Text style={style.selectSubtitle}>No apps selected</Text>
          </View>
         <Image
          source={Images.rightArrow}
          style={style.arrow}
          resizeMode="contain"
        />
        </Pressable>
        
          
     </View>
     
            <View style={style.buttonView}>
                    <PrimaryButton
                    title= {status === "edit" ? "Update Profile" : "Create Profile"}
                    onPress={() => Alert.alert("Create Profile")}
                    />
                   { status === "edit" && (
                    <PrimaryButton
                    title="Delete Profile"
                    onPress={() => Alert.alert("Delete Profile")}
                    gradientColors={[colors.redbutton,colors.redbutton]}
                    textColor= {colors.red}
                    
                    />
 )}
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
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
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
    paddingBottom: hp(5),
    paddingHorizontal: wp(5),
  }


}
);
export default AddProfile;

