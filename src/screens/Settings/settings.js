import { View ,Text} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./settings.styles";

const SettingsScreen = ({navigation}) => {
    return (
        <SafeAreaView style = {styles.container}>
            <View style={styles.wraper}>
                <Text style={{ fontSize: 20 }}>Settings Screen</Text>

            </View>
        </SafeAreaView>
    );
}
export default SettingsScreen;