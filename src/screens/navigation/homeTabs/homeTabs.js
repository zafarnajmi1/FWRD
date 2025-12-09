import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import BlockerScreen from "../../Blocker/blocker";
import AnalyticsScreen from "../../Analytics/analytics";
import SettingsScreen from "../../Settings/settings";

import Images from "../../../assets/images";
import colors from "../../../assets/colors";

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Blocker: {
    active: Images.blockericon,
    inactive: Images.unselectedblockericon,
  },
  Analytics: {
    active: Images.selectedAnalyticsicon,
    inactive: Images.unselectedAnalyticsicon,
  },
  Settings: {
    active: Images.selectedSettingsicon,
    inactive: Images.selectedSettingsicon,
  },
};


const CustomTabBar = (props) => {
  return (
    <View style={styles.tabBarContainer}>
      {props.state.routes.map((route, index) => {
        const isFocused = index === props.state.index;

        const onPress = () => {
          const event = props.navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            props.navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabButton}
            onPress={onPress}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.tabIconContainer,
                isFocused && styles.activeTabBackground,
              ]}
            >
              <Image
                source={
                  isFocused
                    ? TAB_ICONS[route.name].active
                    : TAB_ICONS[route.name].inactive
                }
                style={[
                  styles.tabIcon,
                  { tintColor: isFocused ? colors.primary : "gray" },
                ]}
                resizeMode="contain"
              />
            </View>

            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? colors.primary : "gray" },
              ]}
            >
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};


const HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Blocker"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Blocker" component={BlockerScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};


const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 80,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    paddingBottom: 10,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  activeTabBackground: {
    backgroundColor: colors.lightPrimary,
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
  tabLabel: {
    fontSize: 12,
  },
});

export default HomeTabs;
