import { StyleSheet } from "react-native";
import colors from "../../assets/colors";
import { RFValue } from "react-native-responsive-fontsize";

const styles = StyleSheet.create({
  container: {
    marginBottom: 6,
    paddingHorizontal: 15,
  },
  box: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: RFValue(12),
    fontWeight: "500",
    color: colors.placeholder,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  hoursText: {
    fontSize: RFValue(14),
    fontWeight: "600",
    color: colors.black,
  },
  minutesText: {
    fontSize: RFValue(12),
    fontWeight: "500",
    color: colors.placeholder,
    marginLeft: 10,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default styles;

