import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import { View ,Text, Alert,Image,TouchableOpacity, Pressable} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./blocker.styles";
import Header from "../../components/Header";
import LinearGradient from "react-native-linear-gradient";
import Images from "../../assets/images";
import colors from "../../assets/colors";
 import { BottomSheet } from "../../components/bottomSheet";
import { heightPercentageToDP } from "react-native-responsive-screen";
import AddProfile from '../../components/AddProfileComponents/AddProfile';
import SelectProfile  from "../../components/SelectProfile/SelectProfile";
import NFCScanView from '../../components/NfcScanComponent/NfcScan';
import SHEET from '../../../src/staticData';
const BlockerScreen = ({navigation}) => {

const refRBSheet = useRef();

  const [sheetType, setSheetType] = useState(null);

  const openBottomSheet = useCallback((type) => {
  setSheetType(type);
  refRBSheet.current?.present();
}, []);
const hideBottomSheet = () => {
  refRBSheet.current?.close();
  setSheetType(null);
};
const renderBottomSheetContent = () => {
  switch (sheetType) {
    case "ADD":
        return <AddProfile
       status="profile"
       title="Add Profile"
       />;

      case "EDIT":
        return <AddProfile status="edit" 
        
       title="Edit Profile"/>;

      case "SELECT":
        return <SelectProfile onDone={hideBottomSheet}/>;

      case "SCAN":
        return <NFCScanView onCross={hideBottomSheet}/>;

    default:
      return null;
  }
};

    return (
        <SafeAreaView style = {styles.container}>
            <Header title="Blocker" isShow={true} onPlusPress={() => openBottomSheet("ADD")} />
         <View style={styles.wraper}>
                    <View style={styles.cardWrapper}>
                        <Image
                        source={Images.blockerCard}
                        style={styles.cardImage}
                        resizeMode="contain"
                        />
                    </View>
            <View style={styles.centerContainer}>
            <TouchableOpacity style={styles.lockWrapper}
            onPress={()=> openBottomSheet("SCAN")}
            >
                <Image
                source={Images.lockIcon}
                style={styles.lockIcon}
                resizeMode="contain"
                />
            <Text style={styles.lockText}>Tap to Lock</Text>
            </TouchableOpacity>
            </View>


  {/* ---------- STRICT OPTION ---------- */}
      <View style={styles.optionBox}>
        <Text style={styles.optionLabel}>Strict</Text>
        <TouchableOpacity
         onPress={()=> openBottomSheet("EDIT")}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* ---------- CHANGE PROFILE ---------- */}
            <Pressable style={styles.profileBox}
            onPress={()=> openBottomSheet("SELECT")}
            >
              <Text style={styles.profileLabel}>Change Profile</Text>
              <Image
                source={Images.rightArrow}
                style={styles.arrowIcon}
                resizeMode="contain"
               
              />
            </Pressable>

            </View>
<BottomSheet
        refRBSheet={refRBSheet}
        onClose={() => hideBottomSheet()}
        scrollEnabled={true}
        disableDynamicSizing={true}
        removeSheetScrolllView={true}
        height={heightPercentageToDP(sheetType === "SCAN" ? 40 : 80)}
      >
       {renderBottomSheetContent()}
      
      </BottomSheet>
        </SafeAreaView>
    );
}
export default BlockerScreen;