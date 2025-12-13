import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, Platform, Image, TouchableOpacity, ToastAndroid, Alert, NativeEventEmitter, AppState } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeModules } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./blocker.styles";
import Header from "../../components/Header";
import LinearGradient from "react-native-linear-gradient";
import Images from "../../assets/images";
import colors from "../../assets/colors";

const { InstalledAppsModule, AppLockModule } = NativeModules;

const LOCKED_APPS_KEY = "@FWRD:lockedApps";

// Debug: Log available modules
if (__DEV__) {
    console.log("Available NativeModules:", Object.keys(NativeModules));
    console.log("InstalledAppsModule:", InstalledAppsModule);
}

const BlockerScreen = () => {
    const navigation = useNavigation();
    const [installedApps, setInstalledApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [iconErrors, setIconErrors] = useState(new Set());
    const [lockedApps, setLockedApps] = useState(new Set());

    useEffect(() => {
        fetchInstalledApps();
        loadLockedApps();
        checkAccessibilityService();
    }, []);
    
    const checkAccessibilityService = async () => {
        if (AppLockModule && AppLockModule.isAccessibilityServiceEnabled) {
            try {
                const isEnabled = await AppLockModule.isAccessibilityServiceEnabled();
                if (!isEnabled && lockedApps.size > 0) {
                    // Show a message that accessibility service is needed for full protection
                    if (Platform.OS === "android") {
                        ToastAndroid.show(
                            "Enable Accessibility Service for better app blocking",
                            ToastAndroid.LONG
                        );
                    }
                }
            } catch (err) {
                console.warn("Could not check accessibility service:", err);
            }
        }
    };

    useEffect(() => {
        const cleanup = setupAppLockListener();
        return cleanup;
    }, [lockedApps]);

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

    const loadLockedApps = async () => {
        try {
            const stored = await AsyncStorage.getItem(LOCKED_APPS_KEY);
            if (stored) {
                const lockedSet = new Set(JSON.parse(stored));
                setLockedApps(lockedSet);
                // Update native module with locked apps list
                if (AppLockModule && AppLockModule.setLockedApps) {
                    try {
                        AppLockModule.setLockedApps([...lockedSet]);
                        
                    // Start monitoring service if there are locked apps
                    if (lockedSet.size > 0) {
                        if (AppLockModule && AppLockModule.startMonitoring) {
                            try {
                                AppLockModule.startMonitoring();
                                console.log("Monitoring started on app load for", lockedSet.size, "locked apps");
                            } catch (err) {
                                console.warn("Could not start monitoring service:", err);
                                // Fallback: MainActivity will handle monitoring (Android)
                            }
                        }
                    }
                    } catch (err) {
                        console.error("Error loading locked apps:", err);
                    }
                }
            }
        } catch (err) {
            console.error("Error loading locked apps:", err);
        }
    };

    const saveLockedApps = async (lockedSet) => {
        try {
            await AsyncStorage.setItem(LOCKED_APPS_KEY, JSON.stringify([...lockedSet]));
        } catch (err) {
            console.error("Error saving locked apps:", err);
        }
    };

    const toggleAppLock = async (packageName) => {
        const newLockedApps = new Set(lockedApps);
        if (newLockedApps.has(packageName)) {
            newLockedApps.delete(packageName);
        } else {
            newLockedApps.add(packageName);
        }
        setLockedApps(newLockedApps);
        await saveLockedApps(newLockedApps);
        
        // Update native module with locked apps list
        if (AppLockModule && AppLockModule.setLockedApps) {
            try {
                AppLockModule.setLockedApps([...newLockedApps]);
                
                // Start monitoring service if there are locked apps
                // Try to start service, but don't crash if it fails
                if (newLockedApps.size > 0) {
                    if (AppLockModule && AppLockModule.startMonitoring) {
                        try {
                            AppLockModule.startMonitoring();
                            console.log("Monitoring started for", newLockedApps.size, "locked apps");
                        } catch (err) {
                            console.warn("Could not start monitoring service:", err);
                            // Fallback: MainActivity will handle monitoring (Android)
                            // On iOS, monitoring is limited due to platform restrictions
                        }
                    }
                } else {
                    if (AppLockModule && AppLockModule.stopMonitoring) {
                        try {
                            AppLockModule.stopMonitoring();
                        } catch (err) {
                            console.warn("Could not stop monitoring service:", err);
                        }
                    }
                }
            } catch (err) {
                console.error("Error updating locked apps:", err);
            }
        }
    };

    const setupAppLockListener = () => {
        // Listen for app launch events from native module
        if (AppLockModule) {
            const eventEmitter = new NativeEventEmitter(AppLockModule);
            
            // Listen for blocked app navigation event (works on both Android and iOS)
            const navigationSubscription = eventEmitter.addListener("onAppBlockedNavigate", (data) => {
                const { packageName, appName } = data;
                // Navigate to AppBlocked screen
                navigation.navigate("AppBlocked", {
                    packageName,
                    appName,
                    icon: installedApps.find(app => app.packageName === packageName)?.icon || null
                });
            });
            
            // Listen for app launch blocked event (Android fallback)
            const blockedSubscription = eventEmitter.addListener("onAppLaunchBlocked", (data) => {
                const { packageName, appName } = data;
                showUnlockMessage(appName || packageName);
            });
            
            // iOS: Monitor app state changes
            if (Platform.OS === 'ios') {
                const handleAppStateChange = (nextAppState) => {
                    if (nextAppState === 'active') {
                        // When app becomes active, check if we should show blocked screen
                        // This is a workaround for iOS limitations
                    }
                };
                
                const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
                
                // Cleanup on unmount
                return () => {
                    navigationSubscription.remove();
                    blockedSubscription.remove();
                    appStateSubscription.remove();
                };
            }
            
            // Cleanup on unmount (Android)
            return () => {
                navigationSubscription.remove();
                blockedSubscription.remove();
            };
        }
    };

    const showUnlockMessage = (appName) => {
        if (Platform.OS === "android") {
            ToastAndroid.show(
                `🔒 ${appName} is locked. Please unlock it first.`,
                ToastAndroid.LONG
            );
        } else {
            Alert.alert(
                "App Locked",
                `${appName} is locked. Please unlock it first.`,
                [{ text: "OK" }]
            );
        }
    };

    const renderAppItem = ({ item }) => {
        const hasIconError = iconErrors.has(item.packageName || item.package);
        const shouldShowIcon = item.icon && !hasIconError;
        const packageName = item.packageName || item.package;
        const isLocked = lockedApps.has(packageName);
        
        return (
            <TouchableOpacity 
                style={[styles.appItem, isLocked && styles.appItemLocked]}
                onPress={() => toggleAppLock(packageName)}
                activeOpacity={0.7}
            >
                {shouldShowIcon ? (
                    <Image 
                        source={{ uri: item.icon }} 
                        style={[styles.appIcon, isLocked && styles.appIconLocked]}
                        onError={() => {
                            console.log("Failed to load icon for:", item.label);
                            handleIconError(packageName);
                        }}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.appIcon, styles.iconPlaceholder, isLocked && styles.appIconLocked]}>
                        <Text style={styles.iconPlaceholderText}>
                            {item.label ? item.label.charAt(0).toUpperCase() : "📱"}
                        </Text>
                    </View>
                )}
                <View style={styles.appInfo}>
                    <View style={styles.appNameRow}>
                        <Text style={[styles.appName, isLocked && styles.appNameLocked]}>
                            {item.label || "Unknown App"}
                        </Text>
                        {isLocked && <Text style={styles.lockBadge}>🔒</Text>}
                    </View>
                    <Text style={styles.appPackage} numberOfLines={1}>
                        {packageName}
                    </Text>
                </View>
                <View style={[styles.checkbox, isLocked && styles.checkboxChecked]}>
                    {isLocked && <Text style={styles.checkmark}>✓</Text>}
                </View>
            </TouchableOpacity>
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
                    {lockedApps.size > 0 && ` • ${lockedApps.size} locked`}
                </Text>
                {lockedApps.size > 0 && Platform.OS === 'android' && (
                    <TouchableOpacity 
                        style={styles.accessibilityButton}
                        onPress={async () => {
                            if (AppLockModule && AppLockModule.openAccessibilitySettings) {
                                try {
                                    AppLockModule.openAccessibilitySettings();
                                } catch (err) {
                                    console.error("Error opening accessibility settings:", err);
                                }
                            }
                        }}
                    >
                        <Text style={styles.accessibilityButtonText}>
                            ⚙️ Enable Accessibility Service for Better Protection
                        </Text>
                    </TouchableOpacity>
                )}
                {lockedApps.size > 0 && Platform.OS === 'ios' && (
                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            ℹ️ iOS Limitations: Due to iOS security restrictions, apps cannot be blocked in real-time like Android. Locked apps will be detected when you return to FWRD.
                        </Text>
                        <Text style={[styles.infoText, { marginTop: 8, fontSize: 11 }]}>
                            💡 For real blocking, Screen Time API is required (needs Apple approval). Current implementation provides detection and alerts.
                        </Text>
                    </View>
                )}
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