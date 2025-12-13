import { StyleSheet } from "react-native";
import colors from "../../assets/colors";
import { RFValue } from "react-native-responsive-fontsize";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingHorizontal: 15,
  },
  box: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: "center",
  },
  col1: {
    fontSize: RFValue(12),
    fontWeight: "500",
    color: colors.placeholder,
    marginBottom: 4,
  },
  col2: {
    fontSize: RFValue(14),
    fontWeight: "600",
    color: colors.black,
    marginBottom: 2,
  },
  col3: {
    fontSize: RFValue(12),
    fontWeight: "500",
    color: colors.placeholder,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default styles;

