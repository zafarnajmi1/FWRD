package com.fwrd

import android.accessibilityservice.AccessibilityService
import android.app.ActivityManager
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.widget.Toast
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost

class AppLockAccessibilityService : AccessibilityService() {
    
    private var appLockModule: AppLockModule? = null
    private val handler = Handler(Looper.getMainLooper())
    private val currentPackageName = "com.fwrd"
    private var lastBlockedPackage: String? = null
    private var lastBlockTime: Long = 0
    
    companion object {
        private const val PREFS_NAME = "AppLockPrefs"
        private const val LOCKED_APPS_KEY = "lockedApps"
        private const val TAG = "AppLockAccessibility"
    }
    
    override fun onServiceConnected() {
        super.onServiceConnected()
        Log.d(TAG, "Accessibility service connected")
        updateAppLockModule()
    }
    
    private fun updateAppLockModule() {
        try {
            val application = applicationContext as? ReactApplication
            val reactHost = application?.reactHost
            val reactContext = reactHost?.currentReactContext
            appLockModule = reactContext?.getNativeModule(AppLockModule::class.java)
            Log.d(TAG, "AppLockModule updated: ${appLockModule != null}")
        } catch (e: Exception) {
            Log.e(TAG, "Error updating AppLockModule: ${e.message}")
        }
    }
    
    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        when (event.eventType) {
            AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED -> {
                val packageName = event.packageName?.toString()
                
                if (packageName != null && packageName != currentPackageName) {
                    // Prevent duplicate blocks within 1 second
                    val currentTime = System.currentTimeMillis()
                    if (packageName != lastBlockedPackage || (currentTime - lastBlockTime) > 1000) {
                        checkAndBlockApp(packageName)
                    }
                }
            }
        }
    }
    
    override fun onInterrupt() {
        Log.d(TAG, "Accessibility service interrupted")
    }
    
    private fun isAppLocked(packageName: String): Boolean {
        // Try to get from AppLockModule first
        appLockModule?.let {
            return it.isAppLocked(packageName)
        }
        
        // Fallback to SharedPreferences
        try {
            val prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val lockedAppsJson = prefs.getString(LOCKED_APPS_KEY, "[]")
            if (lockedAppsJson != null) {
                val jsonArray = org.json.JSONArray(lockedAppsJson)
                for (i in 0 until jsonArray.length()) {
                    if (jsonArray.getString(i) == packageName) {
                        return true
                    }
                }
            }
            return false
        } catch (e: Exception) {
            Log.e(TAG, "Error reading locked apps: ${e.message}")
            return false
        }
    }
    
    private fun checkAndBlockApp(packageName: String) {
        if (isAppLocked(packageName)) {
            Log.d(TAG, "Blocking locked app: $packageName")
            handler.post {
                blockApp(packageName)
            }
        }
    }
    
    private fun blockApp(packageName: String) {
        lastBlockedPackage = packageName
        lastBlockTime = System.currentTimeMillis()
        
        val appName = try {
            val pm = packageManager
            val appInfo = pm.getApplicationInfo(packageName, 0)
            pm.getApplicationLabel(appInfo).toString()
        } catch (e: Exception) {
            packageName
        }
        
        Log.d(TAG, "Blocking app: $appName ($packageName)")
        
        // Immediately press HOME button to minimize/kill the app
        performGlobalAction(GLOBAL_ACTION_HOME)
        
        // Show toast
        Toast.makeText(
            this,
            "🔒 $appName is locked. Please unlock it first.",
            Toast.LENGTH_LONG
        ).show()
        
        // Kill the app process aggressively
        handler.postDelayed({
            try {
                val activityManager = getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
                
                // Method 1: Kill background processes
                activityManager.killBackgroundProcesses(packageName)
                
                // Method 2: Get running tasks and try to minimize them
                try {
                    val runningTasks = activityManager.getRunningTasks(50)
                    for (task in runningTasks) {
                        if (task.topActivity?.packageName == packageName) {
                            // Task is already being handled by HOME button press
                            // No need to do anything else here
                        }
                    }
                } catch (e: Exception) {
                    // getRunningTasks may require permission, ignore
                }
                
                // Method 3: Try to force stop (may require system permission)
                try {
                    val pm = packageManager
                    val intent = Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
                    intent.data = android.net.Uri.parse("package:$packageName")
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                } catch (e: Exception) {
                    // Ignore
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error killing app: ${e.message}")
            }
        }, 100)
        
        // Bring our app to foreground and navigate to AppBlocked screen
        handler.postDelayed({
            try {
                val intent = Intent().apply {
                    setPackage(currentPackageName)
                    setClassName(currentPackageName, "$currentPackageName.MainActivity")
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
                    putExtra("navigateTo", "AppBlocked")
                    putExtra("blockedPackageName", packageName)
                    putExtra("blockedAppName", appName)
                }
                startActivity(intent)
                
                // Also send event to React Native to navigate
                sendNavigationEvent(packageName, appName)
            } catch (e: Exception) {
                Log.e(TAG, "Error bringing FWRD to foreground: ${e.message}")
                // Fallback to regular launch
                try {
                    val intent = packageManager.getLaunchIntentForPackage(currentPackageName)
                    if (intent != null) {
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
                        startActivity(intent)
                    }
                } catch (e2: Exception) {
                    Log.e(TAG, "Error with fallback launch: ${e2.message}")
                }
            }
        }, 200)
    }
    
    private fun sendNavigationEvent(packageName: String, appName: String) {
        try {
            val application = applicationContext as? ReactApplication
            val reactHost = application?.reactHost
            val reactContext = reactHost?.currentReactContext
            
            reactContext?.let {
                val params = com.facebook.react.bridge.Arguments.createMap()
                params.putString("packageName", packageName)
                params.putString("appName", appName)
                
                it.getJSModule(
                    com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter::class.java
                ).emit("onAppBlockedNavigate", params)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error sending navigation event: ${e.message}")
        }
    }
    
    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "Accessibility service destroyed")
    }
}

