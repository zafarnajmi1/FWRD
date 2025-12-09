import { View,Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./analytics.styles";

const AnalyticsScreen = ({navigation}) => {
    return (
        <SafeAreaView style = {styles.container}>
            <View style={styles.wraper}>
                <Text style={{ fontSize: 20 }}>AnalyticsScreen</Text>

            </View>
        </SafeAreaView>
    );
}
export default AnalyticsScreen;