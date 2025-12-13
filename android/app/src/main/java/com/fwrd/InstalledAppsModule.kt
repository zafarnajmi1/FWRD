package com.fwrd

import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Base64
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import java.io.ByteArrayOutputStream

class InstalledAppsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "InstalledAppsModule"
    }

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val packageManager = reactApplicationContext.packageManager
            val currentPackageName = reactApplicationContext.packageName
            val apps = packageManager.getInstalledPackages(PackageManager.GET_META_DATA)
            val appList: WritableArray = Arguments.createArray()

            for (packageInfo in apps) {
                val appInfo = packageInfo.applicationInfo
                
                // Skip if applicationInfo is null
                if (appInfo == null) {
                    continue
                }
                
                // Skip the current app itself
                if (packageInfo.packageName == currentPackageName) {
                    continue
                }
                
                // Check if app has a launcher activity (user-launchable apps)
                val launchIntent = packageManager.getLaunchIntentForPackage(packageInfo.packageName)
                if (launchIntent == null) {
                    // Skip apps that can't be launched by users (system services, etc.)
                    continue
                }
                
                // Determine if it's a system app
                val isSystemApp = (appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0 || 
                                 (appInfo.flags and ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) != 0
                
                // Skip system apps (internal services, system UI components, etc.)
                if (isSystemApp) {
                    // Only allow certain well-known system apps that users actually use
                    val allowedSystemApps = setOf(
                        "com.google.android.gm", // Gmail
                        "com.google.android.youtube", // YouTube
                        "com.google.android.apps.photos", // Google Photos
                        "com.android.chrome", // Chrome
                        "com.google.android.apps.maps" // Google Maps
                    )
                    
                    if (packageInfo.packageName !in allowedSystemApps) {
                        continue
                    }
                }
                
                // Filter out internal/system service apps by package name patterns
                val packageName = packageInfo.packageName.lowercase()
                val appLabel = packageManager.getApplicationLabel(appInfo).toString().lowercase()
                
                // Skip apps with service-related keywords
                val serviceKeywords = listOf(
                    "service", "viewservice", "uiservice", "systemui", 
                    "inputmethod", "keyboard", "ime", "wallpaper",
                    "launcher", "launcher3", "launcher2", "trebuchet",
                    "com.android.systemui", "com.android.settings",
                    "com.google.android.setupwizard", "com.android.providers",
                    "com.android.server", "com.android.internal",
                    "com.qualcomm", "com.mediatek", "com.samsung.android",
                    "com.huawei", "com.xiaomi", "com.oppo", "com.vivo",
                    "com.oneplus", "com.miui", "com.coloros", "com.funtouch"
                )
                
                // Check if package name or label contains service keywords
                val isInternalService = serviceKeywords.any { keyword ->
                    packageName.contains(keyword) || appLabel.contains(keyword)
                }
                
                if (isInternalService) {
                    continue
                }
                
                // Skip apps with very short or generic names (likely system components)
                if (appLabel.length < 3) {
                    continue
                }

                val appMap: WritableMap = Arguments.createMap()
                appMap.putString("packageName", packageInfo.packageName)
                appMap.putString("label", packageManager.getApplicationLabel(appInfo).toString())
                appMap.putBoolean("isSystemApp", isSystemApp)
                
                // Get app icon as base64 string
                try {
                    val icon = packageManager.getApplicationIcon(packageInfo.packageName)
                    val iconBase64 = drawableToBase64(icon)
                    appMap.putString("icon", iconBase64)
                } catch (e: Exception) {
                    appMap.putString("icon", null)
                }

                appList.pushMap(appMap)
            }

            promise.resolve(appList)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to get installed apps: ${e.message}", e)
        }
    }

    private fun drawableToBase64(drawable: Drawable): String? {
        return try {
            val bitmap = drawableToBitmap(drawable)
            // Resize bitmap to a reasonable size (64x64) to reduce memory usage
            val resizedBitmap = Bitmap.createScaledBitmap(bitmap, 64, 64, true)
            val outputStream = ByteArrayOutputStream()
            // Use JPEG with quality 85 for smaller file size, or PNG for better quality
            resizedBitmap.compress(Bitmap.CompressFormat.PNG, 85, outputStream)
            val byteArray = outputStream.toByteArray()
            Base64.encodeToString(byteArray, Base64.NO_WRAP)
        } catch (e: Exception) {
            android.util.Log.e("InstalledAppsModule", "Error converting icon to base64: ${e.message}")
            null
        }
    }

    private fun drawableToBitmap(drawable: Drawable): Bitmap {
        if (drawable is BitmapDrawable && drawable.bitmap != null) {
            return drawable.bitmap
        }

        // Use a standard size for app icons (64x64 dp)
        val iconSize = 64
        val bitmap = Bitmap.createBitmap(iconSize, iconSize, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        drawable.setBounds(0, 0, iconSize, iconSize)
        drawable.draw(canvas)
        return bitmap
    }
}

