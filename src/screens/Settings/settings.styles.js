import { StyleSheet } from "react-native";
import colors from "../../assets/colors";

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:colors.bgcolor
  },
  wraper:{
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: colors.bgcolor,
    marginTop:15,
    paddingHorizontal: 20,
  },  
  profileBox: {
    width: "100%",
    height:"50",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom:20
    
  },
  profileLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  arrowIcon: {
    width: 25,
    height: 25,
    tintColor: "#000",
  },
  scrollContent: {
  paddingBottom: 30,
},
  
});
export default styles;