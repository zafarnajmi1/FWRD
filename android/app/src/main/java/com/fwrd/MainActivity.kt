package com.fwrd

import android.app.ActivityManager
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.modules.core.DeviceEventManagerModule

class MainActivity : ReactActivity() {

  private var appLockModule: AppLockModule? = null
  private val handler = Handler(Looper.getMainLooper())
  private var checkRunnable: Runnable? = null
  private var lastForegroundApp: String? = null
  private val currentPackageName = "com.fwrd"

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "FWRD"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    
    // Check if we need to navigate to AppBlocked screen
    val navigateTo = intent.getStringExtra("navigateTo")
    val blockedPackageName = intent.getStringExtra("blockedPackageName")
    val blockedAppName = intent.getStringExtra("blockedAppName")
    
    if (navigateTo == "AppBlocked" && blockedPackageName != null) {
      // Wait for React Native to initialize, then navigate
      handler.postDelayed({
        try {
          val reactContext = reactNativeHost?.reactInstanceManager?.currentReactContext
          if (reactContext != null) {
            val params = Arguments.createMap()
            params.putString("packageName", blockedPackageName)
            params.putString("appName", blockedAppName ?: blockedPackageName)
            
            reactContext
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
              .emit("onAppBlockedNavigate", params)
          }
        } catch (e: Exception) {
          // Will retry in onResume
        }
      }, 1000)
    }
    
    // Get AppLockModule instance after React Native is initialized
    handler.postDelayed({
      try {
        val reactContext = reactNativeHost?.reactInstanceManager?.currentReactContext
        appLockModule = reactContext?.getNativeModule(AppLockModule::class.java)
        if (appLockModule != null) {
          startMonitoringAppLaunches()
        }
      } catch (e: Exception) {
        // React Native not ready yet, will try again in onResume
      }
    }, 2000)
  }

  override fun onResume() {
    super.onResume()
    
    // Try to get AppLockModule if not already set
    if (appLockModule == null) {
      try {
        val reactContext = reactNativeHost?.reactInstanceManager?.currentReactContext
        appLockModule = reactContext?.getNativeModule(AppLockModule::class.java)
      } catch (e: Exception) {
        // React Native not ready yet
      }
    }
    
    if (appLockModule != null) {
      startMonitoringAppLaunches()
    }
  }

  override fun onPause() {
    super.onPause()
    stopMonitoringAppLaunches()
  }

  override fun onDestroy() {
    super.onDestroy()
    stopMonitoringAppLaunches()
  }

  private fun startMonitoringAppLaunches() {
    stopMonitoringAppLaunches()
    
    checkRunnable = object : Runnable {
      override fun run() {
        checkForegroundApp()
        handler.postDelayed(this, 1000) // Check every second
      }
    }
    handler.post(checkRunnable!!)
  }

  private fun stopMonitoringAppLaunches() {
    checkRunnable?.let { handler.removeCallbacks(it) }
    checkRunnable = null
  }

  private fun checkForegroundApp() {
    val appLock = appLockModule ?: return
    
    try {
      val activityManager = getSystemService(ACTIVITY_SERVICE) as ActivityManager
      val runningProcesses = activityManager.runningAppProcesses
      
      if (runningProcesses != null) {
        for (processInfo in runningProcesses) {
          if (processInfo.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
            val packageName = processInfo.pkgList?.getOrNull(0)
            
            // Skip if it's our app
            if (packageName == null || packageName == currentPackageName) {
              continue
            }
            
            // Check if this is a new app (different from last checked)
            if (packageName != lastForegroundApp) {
              lastForegroundApp = packageName
              
              // Check if app is locked
              if (appLock.isAppLocked(packageName)) {
                // Show toast
                val appName = appLock.getAppName(packageName)
                appLock.showUnlockToast(appName)
                
                // Send event to React Native
                sendAppLaunchBlockedEvent(packageName, appName)
                
                // Bring our app to foreground
                val intent = packageManager.getLaunchIntentForPackage(currentPackageName)
                if (intent != null) {
                  intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
                  startActivity(intent)
                }
              }
              break
            }
          }
        }
      }
    } catch (e: Exception) {
      // Ignore security exceptions
    }
  }

  private fun sendAppLaunchBlockedEvent(packageName: String, appName: String) {
    try {
      val reactContext = reactNativeHost?.reactInstanceManager?.currentReactContext
      reactContext?.let {
        val params: WritableMap = Arguments.createMap()
        params.putString("packageName", packageName)
        params.putString("appName", appName)
        
        it
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          .emit("onAppLaunchBlocked", params)
      }
    } catch (e: Exception) {
      // React Native not ready, ignore
    }
  }
}
