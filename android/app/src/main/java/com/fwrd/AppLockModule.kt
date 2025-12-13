package com.fwrd

import android.app.ActivityManager
import android.content.Context
import android.content.pm.PackageManager
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.widget.Toast
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.Arguments
import java.util.concurrent.CopyOnWriteArraySet

class AppLockModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var lockedApps: Set<String> = CopyOnWriteArraySet()
    private val mainHandler = Handler(Looper.getMainLooper())
    private var appLockService: AppLockService? = null

    override fun getName(): String {
        return "AppLockModule"
    }

    @ReactMethod
    fun setLockedApps(apps: ReadableArray) {
        val newSet = CopyOnWriteArraySet<String>()
        for (i in 0 until apps.size()) {
            val packageName = apps.getString(i)
            if (packageName != null) {
                newSet.add(packageName)
            }
        }
        lockedApps = newSet
        
        // Save to SharedPreferences for AccessibilityService
        saveLockedAppsToPrefs(newSet)
        
        // Update service if running
        appLockService?.setAppLockModule(this)
    }
    
    private fun saveLockedAppsToPrefs(apps: Set<String>) {
        try {
            val prefs = reactApplicationContext.getSharedPreferences("AppLockPrefs", Context.MODE_PRIVATE)
            val editor = prefs.edit()
            val jsonArray = org.json.JSONArray()
            for (app in apps) {
                jsonArray.put(app)
            }
            editor.putString("lockedApps", jsonArray.toString())
            editor.apply()
        } catch (e: Exception) {
            android.util.Log.e("AppLockModule", "Error saving locked apps to prefs: ${e.message}")
        }
    }
    
    @ReactMethod
    fun startMonitoring() {
        try {
            // Try to start foreground service
            val intent = android.content.Intent(reactApplicationContext, AppLockService::class.java)
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                reactApplicationContext.startForegroundService(intent)
            } else {
                reactApplicationContext.startService(intent)
            }
        } catch (e: Exception) {
            // Service might not be able to start due to permissions
            // Fall back to MainActivity monitoring
            android.util.Log.e("AppLockModule", "Failed to start monitoring service: ${e.message}")
        }
    }
    
    @ReactMethod
    fun isAccessibilityServiceEnabled(promise: Promise) {
        val enabled = checkAccessibilityServiceEnabled()
        promise.resolve(enabled)
    }
    
    @ReactMethod
    fun openAccessibilitySettings() {
        try {
            val intent = android.content.Intent(android.provider.Settings.ACTION_ACCESSIBILITY_SETTINGS)
            intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(intent)
        } catch (e: Exception) {
            android.util.Log.e("AppLockModule", "Failed to open accessibility settings: ${e.message}")
        }
    }
    
    private fun checkAccessibilityServiceEnabled(): Boolean {
        val enabledServices = android.provider.Settings.Secure.getString(
            reactApplicationContext.contentResolver,
            android.provider.Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        ) ?: return false
        
        val serviceName = "${reactApplicationContext.packageName}/${AppLockAccessibilityService::class.java.name}"
        return enabledServices.contains(serviceName)
    }
    
    @ReactMethod
    fun stopMonitoring() {
        val intent = android.content.Intent(reactApplicationContext, AppLockService::class.java)
        reactApplicationContext.stopService(intent)
    }
    
    fun setAppLockService(service: AppLockService) {
        appLockService = service
        service.setAppLockModule(this)
    }

    @ReactMethod
    fun checkAppLock(packageName: String, promise: Promise) {
        val isLocked = lockedApps.contains(packageName)
        promise.resolve(isLocked)
    }

    @ReactMethod
    fun getLockedApps(promise: Promise) {
        val array: WritableArray = Arguments.createArray()
        for (app in lockedApps) {
            array.pushString(app)
        }
        promise.resolve(array)
    }

    fun isAppLocked(packageName: String): Boolean {
        return lockedApps.contains(packageName)
    }

    fun showUnlockToast(appName: String) {
        mainHandler.post {
            Toast.makeText(
                reactApplicationContext,
                "🔒 $appName is locked. Please unlock it first.",
                Toast.LENGTH_LONG
            ).show()
        }
    }

    fun getAppName(packageName: String): String {
        return try {
            val packageManager = reactApplicationContext.packageManager
            val appInfo = packageManager.getApplicationInfo(packageName, 0)
            packageManager.getApplicationLabel(appInfo).toString()
        } catch (e: Exception) {
            packageName
        }
    }
}

