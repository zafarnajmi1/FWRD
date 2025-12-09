
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from '../login/login';
const Stack = createNativeStackNavigator()
function AuthStack () {
    return (
        <Stack.Navigator initialRouteName="login" screenOptions={{ headerShown: false }}>
        </Stack.Navigator>
      

    );
}
export default AuthStack;