package com.fwrd

import android.app.*
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.widget.Toast
import androidx.core.app.NotificationCompat
import android.content.pm.PackageManager
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost

class AppLockService : Service() {
    
    private var appLockModule: AppLockModule? = null
    private val handler = Handler(Looper.getMainLooper())
    private var checkRunnable: Runnable? = null
    private var lastForegroundApp: String? = null
    private val currentPackageName = "com.fwrd"
    private var usageStatsManager: UsageStatsManager? = null
    
    override fun onCreate() {
        super.onCreate()
        usageStatsManager = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, createNotification())
        
        // Get AppLockModule from React Native
        try {
            val application = applicationContext as? ReactApplication
            val reactHost = application?.reactHost
            val reactContext = reactHost?.currentReactContext
            appLockModule = reactContext?.getNativeModule(AppLockModule::class.java)
        } catch (e: Exception) {
            // Will retry in onStartCommand
        }
    }
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Try to get AppLockModule if not already set
        if (appLockModule == null) {
            try {
                val application = applicationContext as? ReactApplication
                val reactHost = application?.reactHost
                val reactContext = reactHost?.currentReactContext
                appLockModule = reactContext?.getNativeModule(AppLockModule::class.java)
            } catch (e: Exception) {
                // Will retry later
            }
        }
        
        startMonitoring()
        return START_STICKY // Restart if killed
    }
    
    override fun onBind(intent: Intent?): IBinder? {
        return null
    }
    
    fun setAppLockModule(module: AppLockModule) {
        appLockModule = module
    }
    
    private fun startMonitoring() {
        stopMonitoring()
        
        checkRunnable = object : Runnable {
            override fun run() {
                checkForegroundApp()
                handler.postDelayed(this, 500) // Check every 500ms for faster detection
            }
        }
        handler.post(checkRunnable!!)
    }
    
    private fun stopMonitoring() {
        checkRunnable?.let { handler.removeCallbacks(it) }
        checkRunnable = null
    }
    
    private fun checkForegroundApp() {
        val appLock = appLockModule ?: return
        
        try {
            // Method 1: Try UsageStatsManager (more reliable)
            if (usageStatsManager != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                val time = System.currentTimeMillis()
                val events = usageStatsManager!!.queryEvents(time - 2000, time)
                
                var lastEvent: UsageEvents.Event? = null
                while (events.hasNextEvent()) {
                    val event = UsageEvents.Event()
                    events.getNextEvent(event)
                    if (event.eventType == UsageEvents.Event.MOVE_TO_FOREGROUND) {
                        lastEvent = event
                    }
                }
                
                if (lastEvent != null) {
                    val packageName = lastEvent.packageName
                    if (packageName != null && packageName != currentPackageName && packageName != lastForegroundApp) {
                        lastForegroundApp = packageName
                        
                        if (appLock.isAppLocked(packageName)) {
                            blockApp(packageName, appLock)
                        }
                    }
                }
            }
            
            // Method 2: Fallback to ActivityManager
            val activityManager = getSystemService(Context.ACTIVITY_SERVICE) as android.app.ActivityManager
            val runningProcesses = activityManager.runningAppProcesses
            
            if (runningProcesses != null) {
                for (processInfo in runningProcesses) {
                    if (processInfo.importance == android.app.ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
                        val packageName = processInfo.pkgList?.getOrNull(0)
                        
                        if (packageName != null && packageName != currentPackageName && packageName != lastForegroundApp) {
                            lastForegroundApp = packageName
                            
                            if (appLock.isAppLocked(packageName)) {
                                blockApp(packageName, appLock)
                            }
                            break
                        }
                    }
                }
            }
        } catch (e: Exception) {
            // Ignore exceptions
        }
    }
    
    private fun blockApp(packageName: String, appLock: AppLockModule) {
        // Show toast
        val appName = appLock.getAppName(packageName)
        handler.post {
            Toast.makeText(
                this,
                "🔒 $appName is locked. Please unlock it first.",
                Toast.LENGTH_LONG
            ).show()
        }
        
        // Immediately kill the app process - be aggressive
        try {
            val activityManager = getSystemService(Context.ACTIVITY_SERVICE) as android.app.ActivityManager
            
            // Method 1: Kill background processes
            activityManager.killBackgroundProcesses(packageName)
            
            // Method 2: Force stop using package manager (requires system permission, may not work)
            try {
                val pm = packageManager
                pm.setApplicationEnabledSetting(
                    packageName,
                    android.content.pm.PackageManager.COMPONENT_ENABLED_STATE_DISABLED_USER,
                    0
                )
                // Re-enable immediately (we just want to stop it)
                handler.postDelayed({
                    try {
                        pm.setApplicationEnabledSetting(
                            packageName,
                            android.content.pm.PackageManager.COMPONENT_ENABLED_STATE_DEFAULT,
                            0
                        )
                    } catch (e: Exception) {
                        // Ignore
                    }
                }, 100)
            } catch (e: Exception) {
                // May not have permission, that's okay
            }
            
            // Method 3: Kill all running tasks for this package
            val runningTasks = activityManager.getRunningTasks(50)
            for (task in runningTasks) {
                if (task.topActivity?.packageName == packageName) {
                    try {
                        activityManager.moveTaskToFront(task.id, android.app.ActivityManager.MOVE_TASK_WITH_HOME)
                    } catch (e: Exception) {
                        // Ignore
                    }
                }
            }
        } catch (e: Exception) {
            // Ignore
        }
        
        // Bring our app to foreground immediately
        val intent = packageManager.getLaunchIntentForPackage(currentPackageName)
        if (intent != null) {
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
            startActivity(intent)
        }
        
        // Send event to React Native
        sendAppLaunchBlockedEvent(packageName, appName)
    }
    
    private fun sendAppLaunchBlockedEvent(packageName: String, appName: String) {
        // Send event through AppLockModule if available
        appLockModule?.let { module ->
            // The event will be sent through React Native bridge
            // For now, we'll rely on Toast and bringing app to foreground
        }
    }
    
    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "App Lock Service",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Monitors app launches to block locked apps"
            }
            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }
    }
    
    private fun createNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("App Lock Active")
            .setContentText("Monitoring app launches")
            .setSmallIcon(android.R.drawable.ic_lock_idle_lock)
            .setOngoing(true)
            .build()
    }
    
    override fun onDestroy() {
        super.onDestroy()
        stopMonitoring()
    }
    
    companion object {
        private const val CHANNEL_ID = "AppLockServiceChannel"
        private const val NOTIFICATION_ID = 1
    }
}

