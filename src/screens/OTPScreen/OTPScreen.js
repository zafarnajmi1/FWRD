import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import OtpInputs from "react-native-otp-inputs";
import colors from "../../assets/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import PrimaryButton from "../../../src/components/buttonComponent";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const OTPScreen = ({ route,navigation }) => {
     const { phoneNumber } = route.params || {};
  const [otp, setOtp] = useState("");

  const onSubmitOtp = () => {
    // if (otp.length === 6) {
    //   Keyboard.dismiss();
    //   console.log("OTP:", otp);
    // } else {
    navigation.navigate("HomeTabs");
    //}
  };


  const onResendOtp = () => {
  Alert.alert("Resend OTP");
  
};

  return (
    <SafeAreaView style={styles.container}>
         <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
  >
      <Header
        title="FWRD"
        showBackButton={true}
        isShow={false}
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.centerContent}>
        <Text style={styles.title}>Verify Your Phone</Text>

        <Text style={styles.subtitle}>
          Please enter the 6-digit code we sent to{"\n"}
          <Text style={styles.phone}>{phoneNumber}</Text>
        </Text>
        <View style={styles.otpWrapper}>
          <OtpInputs
            numberOfInputs={6}
            handleChange={setOtp}
            keyboardType="number-pad"
            autofillFromClipboard
            inputStyles={styles.otpInput}
            inputContainerStyles={styles.otpContainer}
            focusStyles={styles.otpFocus}
          />
        </View>

        <Text style={styles.resendText}>
          Didn’t receive a code?{" "}
          
          <Text style={styles.resend} onPress={onResendOtp}>Resend</Text>
        </Text>
      </View>

      
      <View style={styles.bottomButton}>
        <PrimaryButton
          title="Continue"
          onPress={onSubmitOtp}
          disabled={otp.length !== 6}
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

  centerContent: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: hp(15),
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    color: colors.black,
  },

  subtitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 35,
  },

  phone: {
    fontWeight: "600",
    color: colors.black,
  },

  otpWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
  },

  otpContainer: {
    marginHorizontal: 6,
  },

  otpInput: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E2E2E2",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
  },

  otpFocus: {
    borderColor: colors.primary,
  },

  resendText: {
    fontSize: 14,
    color: "#777",
  },

  resend: {
    color: colors.primary,
    fontWeight: "600",
  },

  bottomButton: {
  paddingHorizontal: 20,
  paddingBottom: Platform.OS === "ios" ? hp(4) : hp(3),
},
});

export default OTPScreen;
