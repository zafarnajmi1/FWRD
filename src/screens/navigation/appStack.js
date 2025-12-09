import React from "react";
import HomeTabs from './homeTabs/homeTabs';
import LoginScreen from '../login/login';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator()
function AppStack(){
    return (
        <Stack.Navigator initialRouteName="Login" >
            <Stack.Group screenOptions={ {headerShown:false}}>

                <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
                <Stack.Screen name="HomeTabs" component={HomeTabs}></Stack.Screen>


            </Stack.Group>
        </Stack.Navigator>

    );
}
export default AppStack;