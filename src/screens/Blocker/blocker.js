import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import { View ,Text, Alert,Image,TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./blocker.styles";
import Header from "../../components/Header";
import LinearGradient from "react-native-linear-gradient";
import Images from "../../assets/images";
import colors from "../../assets/colors";
import { BottomSheet } from "../../components/bottomSheet";
import { heightPercentageToDP } from "react-native-responsive-screen";
const BlockerScreen = ({navigation}) => {

const refRBSheet = useRef();

 const handleOnItemPress = () => {};
  const openBottomSheet = useCallback(
    (item) => {
      if (refRBSheet.current) {
        refRBSheet.current.present();
      }
    },
    [refRBSheet]
  );

  const hideBottomSheet = () => {
    if (refRBSheet.current) {
      refRBSheet.current.close();
    }
  };
    return (
        <SafeAreaView style = {styles.container}>
            <Header title="Blocker" isShow={true} onPlusPress={handleOnItemPress} />
         <View style={styles.wraper}>
                    <View style={styles.cardWrapper}>
                        <Image
                        source={Images.blockerCard}
                        style={styles.cardImage}
                        resizeMode="contain"
                        />
                    </View>
            <View style={styles.centerContainer}>
            <TouchableOpacity style={styles.lockWrapper}>
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
        <TouchableOpacity>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* ---------- CHANGE PROFILE ---------- */}
      <TouchableOpacity style={styles.profileBox}>
        <Text style={styles.profileLabel}>Change Profile</Text>
        <Image
          source={Images.rightArrow}
          style={styles.arrowIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

            </View>

           <BottomSheet
        refRBSheet={refRBSheet}
        onClose={() => hideBottomSheet()}
        scrollEnabled={true}
        disableDynamicSizing={true}
        removeSheetScrolllView={true}
        height={heightPercentageToDP(50)}
      >
       {/* </Model here> */}

       <Text>My Bottom Sheet</Text>
      </BottomSheet>
        </SafeAreaView>
    );
}
export default BlockerScreen;