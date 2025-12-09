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
            val apps = packageManager.getInstalledPackages(PackageManager.GET_META_DATA)
            val appList: WritableArray = Arguments.createArray()

            for (packageInfo in apps) {
                val appInfo = packageInfo.applicationInfo
                
                // Skip if applicationInfo is null
                if (appInfo == null) {
                    continue
                }
                
                // Filter out system apps (optional - you can remove this filter if you want all apps)
                val isSystemApp = (appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0
                
                // Skip system apps
                if (isSystemApp) {
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

