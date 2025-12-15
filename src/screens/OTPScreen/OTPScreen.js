import {RFValue} from 'react-native-responsive-fontsize';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from '../../../src/components/buttonComponent';
import colors from "../../assets/colors";
import Header from '../../components/Header';
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";




const OTPScreen = ({ navigation }) => {
 const OTP_LENGTH = 6;
const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
const inputs = useRef([]);


const handleChange = (text, index) => {
  const newOtp = [...otp];
  newOtp[index] = text;
  setOtp(newOtp);

  if (text && index < OTP_LENGTH - 1) {
    inputs.current[index + 1]?.focus();
  }

  // Auto submit on last digit
  if (text && index === OTP_LENGTH - 1) {
    const finalOtp = newOtp.join("");
    if (finalOtp.length === OTP_LENGTH) {
      Keyboard.dismiss();
      submitOtp(finalOtp);
    }
  }
};


const handleKeyPress = (e, index) => {
  if (e.nativeEvent.key === "Backspace") {
    if (otp[index]) {
      // Clear current box
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    } else if (index > 0) {
      // Move back
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputs.current[index - 1]?.focus();
    }
  }
};

const submitOtp = (code) => {
  console.log("Submitting OTP:", code);

  // 🔥 CALL YOUR API HERE
  // verifyOtpApi(code)
};


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
         <Header
        title={'FWRD'}
        showBackButton={true}
        onBackPress={() => navigation.goBack()} />
        {/* <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={colors.black} />
          </Pressable>
          <Text style={styles.headerTitle}>FWRD</Text>
          <View style={{ width: 36 }} />
        </View> */}

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Verify Your Phone</Text>
          <Text style={styles.subtitle}>
            Please enter the 6-digit code we sent to{"\n"}
            <Text style={styles.phoneText}>+14376732372</Text>
          </Text>

          {/* OTP Inputs */}
          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
                <TextInput
                    ref={(ref) => (inputs.current[index] = ref)}
                    style={styles.otpBox}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleChange(text, index)}
                     onKeyPress={(e) => handleKeyPress(e, index)}
                    autoFocus={index === 0}
                />

            ))}
          </View>

          {/* Resend */}
          <Text style={styles.resendText}>
            Didn't receive a code?
            <Text style={styles.resendBtn}> Resend</Text>
          </Text>
        </View>

        {/* Bottom Button */}
        <View style={styles.bottom}>
          <PrimaryButton
            title="Continue"
            onPress={() => console.log("OTP:", otp.join(""))}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgcolor,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: hp(8),
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    color: colors.subheading,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },

  phoneText: {
    fontWeight: "600",
    color: colors.black,
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 24,
  },

  otpBox: {
    width: 48,
    height: 52,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderColor,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
  },

  resendText: {
    fontSize: 14,
    color: colors.subheading,
  },

  resendBtn: {
    color: colors.primary,
    fontWeight: "600",
  },

  bottom: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});

export default OTPScreen;
