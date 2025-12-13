        import { View ,Text,Alert,Image,TouchableOpacity, ScrollView} from "react-native";
        import { SafeAreaView } from "react-native-safe-area-context";
        import styles from "./settings.styles";
        import Header from "../../components/Header";
        import Images from "../../assets/images";
        import colors from "../../assets/colors";
        import  SettingOption  from "../../components/settingsBox";


        const SettingsScreen = ({navigation}) => {
        return (
        <SafeAreaView style = {styles.container}>
                <Header title="Settings" isShow={false} onPlusPress={()=>{
                Alert.alert("Add Apps List")
            }} />

            <ScrollView  contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
            >
        <View style={styles.wraper}>
                        

            <SettingOption title="Manage Cards" onPress={() => {}} />
            <SettingOption title="Permissions" onPress={() => {}} />
            <SettingOption title="Get Help" onPress={() => {}} />


       
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
        </SafeAreaView>
        );
        }
        export default SettingsScreen;