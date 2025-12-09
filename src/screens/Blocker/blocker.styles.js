import { StyleSheet } from "react-native";
import colors from "../../assets/colors";

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:colors.bgcolor
  },
  wraper:{
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
});
export default styles;