import React,{useEffect,useState} from "react";
import { Image, StyleSheet, Text, TextInput, View,Pressable, Alert } from "react-native";
import colors from '../../assets/colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Images from "../../assets/images";
import PrimaryButton from '../../../src/components/buttonComponent';

 const GetHelp = ({status, title}) => {
    const [Name, setName] = useState("");
    const [Email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    return (
        <View style={style.container}>
         <View style={style.wraper}>
            <Text style={style.titleView}>
               {title}
            </Text>

            <View style={style.inputWrapper}>
                <TextInput
                     value={Name}
                    onChangeText={setName}
                    placeholder="Your name"
                    placeholderTextColor={colors.placeholder}
                    style={style.input}
                />
        </View>


         <View style={style.inputWrapper}>
                <TextInput
                     value={Email}
                    onChangeText={setEmail}
                    placeholder="Email address"
                    placeholderTextColor={colors.placeholder}
                    style={style.input}
                />
        </View>


         <View style={style.inputWrapper}>
                <TextInput
                     value={subject}
                    onChangeText={setSubject}
                    placeholder="Subject"
                    placeholderTextColor={colors.placeholder}
                    style={style.input}
                />
        </View>



                <View style={style.commentWrapper}>
                <TextInput
                        value={message}
                    onChangeText={setMessage}
                    placeholder="Write your message"
                    placeholderTextColor={colors.placeholder}
                    style={style.input}
                />
                </View>


          
        
          
     </View>
     
            <View style={style.buttonView}>
                    <PrimaryButton
                    title= {"Submit"}
                    onPress={() => Alert.alert("Submit")}
                    />
              
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

  commentWrapper: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderColor:colors.borderColor,
    
     borderWidth:0.4,
     textAlignVertical: 'top',
     minHeight: hp(15),
     paddingHorizontal:10
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
     paddingBottom:50,
     paddingHorizontal:20
  }


}
);
export default GetHelp;

