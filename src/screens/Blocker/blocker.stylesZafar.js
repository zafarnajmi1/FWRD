import { StyleSheet } from "react-native";
import colors from "../../assets/colors";

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:colors.bgcolor
  },
  wraper:{
    flex: 1, 
    
    backgroundColor: colors.bgcolor,
    marginTop:15,
    paddingHorizontal: 20,
    
  },

  cardWrapper: {

    alignSelf: "center"

  },
  cardImage: {
    width: 400,
    height: 200,
  },

  

centerContainer: {
  flex: 1,
  justifyContent: "center",   
  alignItems: "center",      
},

  lockWrapper: {

    // alignItems: "center",
    // justifyContent: 'center',
    //alignSelf:'center'
  },
  lockButton: {
    width: 120,
    height: 120,
    
  },
  lockIcon: {
    width: 90,
    height: 90,
   
  },
  lockText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  
  optionBox: {
  
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    
  },
  optionLabel: {
    fontSize: 17,
    fontWeight: "600",
  },
  editText: {
    fontSize: 15,
    color: "#4C8DAE",
    fontWeight: "600",
  },

  
  profileBox: {
    width: "100%",
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
    fontSize: 17,
    fontWeight: "600",
  },
  arrowIcon: {
    width: 18,
    height: 18,
    tintColor: "#000",
  },
});
export default styles;