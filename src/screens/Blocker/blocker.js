import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, Platform, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeModules } from "react-native";
import styles from "./blocker.styles";

const { InstalledAppsModule } = NativeModules;

// Debug: Log available modules
if (__DEV__) {
    console.log("Available NativeModules:", Object.keys(NativeModules));
    console.log("InstalledAppsModule:", InstalledAppsModule);
}

const BlockerScreen = ({ navigation }) => {
    const [installedApps, setInstalledApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [iconErrors, setIconErrors] = useState(new Set());

    useEffect(() => {
        fetchInstalledApps();
    }, []);

    const fetchInstalledApps = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!InstalledAppsModule) {
                const availableModules = Object.keys(NativeModules).join(", ");
                throw new Error(
                    `InstalledAppsModule is not available. Available modules: ${availableModules}. ` +
                    `Please ensure the native module files are added to the Xcode project and rebuild the app.`
                );
            }

            if (typeof InstalledAppsModule.getInstalledApps !== "function") {
                throw new Error("InstalledAppsModule.getInstalledApps is not a function");
            }

            const apps = await InstalledAppsModule.getInstalledApps();
            
            // Ensure apps is an array
            if (!Array.isArray(apps)) {
                console.warn("getInstalledApps returned non-array:", apps);
                setInstalledApps([]);
                return;
            }
            
            // Format apps for both platforms
            const formattedApps = apps
                .filter((app) => app && (app.packageName || app.package)) // Filter out invalid entries
                .map((app) => {
                    // Ensure icon is properly formatted as data URI
                    let iconUri = null;
                    if (app.icon && app.icon !== null && app.icon !== undefined) {
                        const iconStr = String(app.icon);
                        // If icon doesn't start with 'data:', add it
                        if (iconStr.startsWith('data:')) {
                            iconUri = iconStr;
                        } else if (iconStr.length > 0) {
                            iconUri = `data:image/png;base64,${iconStr}`;
                        }
                    }
                    return {
                        packageName: app.packageName || app.package || "",
                        label: app.label || app.packageName || app.package || "Unknown App",
                        isSystemApp: app.isSystemApp || false,
                        icon: iconUri,
                    };
                })
                .sort((a, b) => (a.label || "").localeCompare(b.label || ""));
            
            setInstalledApps(formattedApps);
        } catch (err) {
            console.error("Error fetching installed apps:", err);
            setError(`Failed to fetch installed applications: ${err.message || "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

    const handleIconError = useCallback((packageName) => {
        setIconErrors((prev) => new Set([...prev, packageName]));
    }, []);

    const renderAppItem = ({ item }) => {
        const hasIconError = iconErrors.has(item.packageName || item.package);
        const shouldShowIcon = item.icon && !hasIconError;
        
        return (
            <View style={styles.appItem}>
                {shouldShowIcon ? (
                    <Image 
                        source={{ uri: item.icon }} 
                        style={styles.appIcon}
                        onError={() => {
                            console.log("Failed to load icon for:", item.label);
                            handleIconError(item.packageName || item.package);
                        }}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.appIcon, styles.iconPlaceholder]}>
                        <Text style={styles.iconPlaceholderText}>
                            {item.label ? item.label.charAt(0).toUpperCase() : "📱"}
                        </Text>
                    </View>
                )}
                <View style={styles.appInfo}>
                    <Text style={styles.appName}>{item.label || "Unknown App"}</Text>
                    <Text style={styles.appPackage} numberOfLines={1}>
                        {item.packageName || item.package}
                    </Text>
                </View>
            </View>
        );
    };

    const renderEmptyState = () => {
        if (loading) {
            return (
                <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.emptyText}>Loading installed apps...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Text style={styles.retryText} onPress={fetchInstalledApps}>
                        Tap to retry
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No apps found</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Installed Applications</Text>
                <Text style={styles.subtitle}>
                    {installedApps.length} {installedApps.length === 1 ? "app" : "apps"} found
                </Text>
            </View>

            <FlatList
                data={installedApps}
                renderItem={renderAppItem}
                keyExtractor={(item, index) => item.packageName || item.package || `app-${index}`}
                ListEmptyComponent={renderEmptyState}
                contentContainerStyle={
                    installedApps.length === 0 ? styles.emptyListContainer : styles.listContainer
                }
                refreshing={false}
                onRefresh={fetchInstalledApps}
            />
        </SafeAreaView>
    );
};

export default BlockerScreen;