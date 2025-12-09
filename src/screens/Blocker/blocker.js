import { View ,Text} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./blocker.styles";

const BlockerScreen = ({navigation}) => {
    return (
        <SafeAreaView style = {styles.container}>
            <View style={styles.wraper}>
                <Text style={{ fontSize: 20 }}>Blocker Screen</Text>

            </View>
        </SafeAreaView>
    );
}
export default BlockerScreen;