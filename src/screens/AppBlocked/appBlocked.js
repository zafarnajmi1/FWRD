import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import colors from "../../assets/colors";

const AppBlockedScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { packageName, appName, icon } = route.params || {};

    useEffect(() => {
        // Auto-navigate to blocker screen after 3 seconds
        const timer = setTimeout(() => {
            navigation.navigate("HomeTabs", { screen: "Blocker" });
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Text style={styles.lockIcon}>🔒</Text>
                </View>
                
                <Text style={styles.title}>App Locked</Text>
                
                <View style={styles.appInfoContainer}>
                    {icon ? (
                        <Image source={{ uri: icon }} style={styles.appIcon} />
                    ) : (
                        <View style={[styles.appIcon, styles.iconPlaceholder]}>
                            <Text style={styles.iconPlaceholderText}>
                                {appName ? appName.charAt(0).toUpperCase() : "📱"}
                            </Text>
                        </View>
                    )}
                    <Text style={styles.appName}>{appName || packageName || "Unknown App"}</Text>
                    <Text style={styles.appPackage}>{packageName}</Text>
                </View>
                
                <Text style={styles.message}>
                    This app is locked. Please unlock it in the Blocker screen to use it.
                </Text>
                
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("HomeTabs", { screen: "Blocker" })}
                >
                    <Text style={styles.buttonText}>Go to Blocker Screen</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bgcolor || "#FFFFFF",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    iconContainer: {
        marginBottom: 30,
    },
    lockIcon: {
        fontSize: 80,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 40,
        textAlign: "center",
    },
    appInfoContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    appIcon: {
        width: 80,
        height: 80,
        borderRadius: 16,
        marginBottom: 16,
    },
    iconPlaceholder: {
        backgroundColor: "#E0E0E0",
        justifyContent: "center",
        alignItems: "center",
    },
    iconPlaceholderText: {
        fontSize: 32,
        fontWeight: "600",
        color: "#666666",
    },
    appName: {
        fontSize: 22,
        fontWeight: "600",
        color: "#000000",
        marginBottom: 8,
        textAlign: "center",
    },
    appPackage: {
        fontSize: 14,
        color: "#666666",
        textAlign: "center",
    },
    message: {
        fontSize: 16,
        color: "#666666",
        textAlign: "center",
        marginBottom: 40,
        paddingHorizontal: 20,
        lineHeight: 24,
    },
    button: {
        backgroundColor: "#FF3B30",
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        minWidth: 200,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});

export default AppBlockedScreen;

