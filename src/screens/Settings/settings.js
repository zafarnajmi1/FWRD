        
import React,{useCallback,
    useEffect,
    useReducer,
    useRef,
    useState,} from "react";
import { View ,Text,Alert,Image,TouchableOpacity, ScrollView} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./settings.styles";
import Header from "../../components/Header";
import Images from "../../assets/images";
import colors from "../../assets/colors";
import  SettingOption  from "../../components/settingsBox";
import { BottomSheet } from "../../components/bottomSheet";
import GetHelp from '../../components/GetHelpComponent/GetHelp';
import ManageNfcCards from '../../components/ManageNfcCards/ManageNfcCards';
import Permissions from '../../components/PermissionsComponent/Permissions';
import { heightPercentageToDP } from "react-native-responsive-screen";


const SettingsScreen = ({navigation}) => {


            
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
    case "ManageCard":
        return <ManageNfcCards title={"Manage NFC Cards"} onDelete={()=> Alert.alert("Delete Action")} onEdit={()=> Alert.alert("Edit Action")}/>;

      case "Permissions":
        return <Permissions title={"Permissions"}/>;

      case "GetHelp":
        return <GetHelp title={"Get Help"}/>;

      case "Logout":
        return <GetHelp title={"Get Help"}/>;

    default:
      return null;
  }
};

        return (
        <SafeAreaView style = {styles.container}>
                <Header title="Settings" isShow={false} onPlusPress={()=>{
                Alert.alert("Add Apps List")
            }} />

            <ScrollView  contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
            >
        <View style={styles.wraper}>
                        

            <SettingOption title="Manage Cards" onPress={() => openBottomSheet("ManageCard")} />
            <SettingOption title="Permissions" onPress={() => openBottomSheet("Permissions")} />
            <SettingOption title="Get Help" onPress={() => openBottomSheet("GetHelp")} />


       
        <SettingOption
        title="Logout"
        danger
        onPress={() =>
            Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive' },
            ]
            )
        }
        />

            </View>
            </ScrollView>

            <BottomSheet
                    refRBSheet={refRBSheet}
                    onClose={() => hideBottomSheet()}
                    scrollEnabled={true}
                    disableDynamicSizing={true}
                    removeSheetScrolllView={true}
                    height={heightPercentageToDP(80)}
                  >
                   {renderBottomSheetContent()}
                  
                  </BottomSheet>
        </SafeAreaView>
        );
        }
        export default SettingsScreen;