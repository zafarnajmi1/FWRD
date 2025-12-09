import { Dimensions,StyleSheet } from "react-native";
import colors from "../../assets/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
const styles = StyleSheet.create({
 container: {
    flex:1,
    backgroundColor:colors.bgcolor,
   

 },
 wraper:{
   flex: 1,
    backgroundColor: colors.bgcolor,
    paddingHorizontal: 20,
    
    justifyContent: "space-between"
 },
 logo:{
   marginTop:20,
   alignSelf: "center"
 },
 title:{
  fontSize: RFValue(20),
    fontWeight: "700",
    textAlign: "center",
    marginTop: hp(15),
    color: colors.black,
 },
 phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderColor,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 30,
    height: 50,
    backgroundColor: colors.white,
  },
  phoneInput: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
    color: colors.black,
  },
  separator: {
    width: 1,
    backgroundColor: colors.grayColor,
    marginHorizontal: 10,
    height: "70%",
  },
 infoText: {
    textAlign: "center",
    marginTop: 15,
    color: "#4a4a4a",
    fontSize: RFValue(11),
  },
  footerText: {
    textAlign: "center",
    marginTop: 12,
    color: "#555",
    fontSize: RFValue(11),
  },
  link: {
    color: "#2C6E8F",
    fontWeight: "600",
  },
 
});
export  default styles;