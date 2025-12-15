import { StyleSheet } from "react-native";
import colors from "../../assets/colors";
import { RFValue } from "react-native-responsive-fontsize";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgcolor,
  },
  headerSafeArea: {
    backgroundColor: colors.bgcolor,
  },
  headerWrapper: {
    paddingHorizontal: 15,
    paddingTop: hp(3),
    paddingBottom: hp(2),
  },
  wrapper: {
    flex: 1,
  },
  flatListWrapper: {
    flex: 1,
  },
  title: {
    fontSize: RFValue(20),
    fontWeight: "700",
    color: colors.black,
    marginBottom: hp(4),
    textAlign: "center",
  },
  sectionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal:40,
    // gap: 60,
  },
  section: {
    alignItems: "center",
  },
  sectionHeading: {
    fontSize: RFValue(12),
    fontWeight: "500",
    color: colors.placeholder,
    marginBottom: 8,
  },
  timeText: {
    fontSize: RFValue(18),
    fontWeight: "600",
    color: colors.black,
  },
  listContainer: {
    paddingTop: hp(3),
    paddingBottom: 20,
  },
  flatListStyle: {
    flex: 1,
  },
   separator: {
    width: 1,
    backgroundColor: colors.placeholder,
    marginHorizontal: 10,
    height: "80%",
  },
});
export default styles;