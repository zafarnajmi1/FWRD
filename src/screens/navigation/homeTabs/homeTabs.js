import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BlockerScreen from "../../Blocker/blocker";
import AnalyticsScreen from "../../Analytics/analytics";
import SettingsScreen from "../../Settings/settings";
const Tab = createBottomTabNavigator();

const HomeTabs = ({}) => {
    return (
        <Tab.Navigator
        initialRouteName="Blocker"
        screenOptions={
            {
                headerShown:false,
                
            }

        }
        >

<Tab.Screen name="Blocker" component={BlockerScreen}/>
<Tab.Screen name="Analytics" component={AnalyticsScreen}/>
<Tab.Screen name="Settings" component={SettingsScreen}/>
        </Tab.Navigator>
    );
}
export default HomeTabs;