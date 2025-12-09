import React,{useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./login.styles";
import { View,Button, Image,Dimensions, Text,TextInput} from "react-native";
import Images from "../../../src/assets/images/";
import CountryPicker from "react-native-country-picker-modal";
import PrimaryButton from '../../../src/components/buttonComponent';
import colors from "../../assets/colors";
//{width: width*0.6,height:height*0.14 }
const LoginScreen = ({navigation,route}) => {
    const [countryCode, setCountryCode] = useState("US");
  const [callingCode, setCallingCode] = useState("1");
  const [phone, setPhone] = useState("");
  const [isFocused, setIsFocused] = useState(false); 
  const { width, height } = Dimensions.get('window');
    return (
        <SafeAreaView style ={styles.container}>

         <View style={styles.wraper}>
        <View>
         <Image  source={Images.card} style={[styles.logo,{width: width*0.6,height:height*0.14 }]}></Image>
           <Text style={styles.title}>Log In or Sign Up</Text>

           
          <View style={[styles.phoneContainer,{borderColor: isFocused ? "#2C6E8F" : "#b7c1c9"}]}>
       
        <CountryPicker
          countryCode={countryCode}
          withFlag
          withCallingCode
          withFilter
          withCallingCodeButton
          onSelect={(country) => {
            setCountryCode(country.cca2);
            setCallingCode(country.callingCode[0]);
          }}
        />

        <Image source={Images.downarrwo} style={{ width: 20, height: 20, marginLeft: 5 }}></Image>
        <View style={styles.separator} />

        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          style={styles.phoneInput}
          placeholderTextColor= {colors.placeholder}
          onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
        />
      </View>

      <PrimaryButton
        title="Send Code"
        onPress={() => navigation.navigate('HomeTabs')}
        //disabled={phone.length < 4}
      />
     
     
       
      <Text style={styles.infoText}>
        We'll send you a text with a verification code.
      </Text>
        </View>

      <Text style={styles.footerText}>
        By continuing, you agree to our{" "}
        <Text style={styles.link}>Terms of Service</Text> and{" "}
        <Text style={styles.link}>Privacy Policy</Text>.
      </Text>


        </View>
        </SafeAreaView>

    );
}
export default LoginScreen;