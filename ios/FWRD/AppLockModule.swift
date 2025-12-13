import Foundation
import UIKit
import React

@objc(AppLockModule)
class AppLockModule: NSObject {
  
  private var lockedApps: Set<String> = []
  private var appStateObserver: NSObjectProtocol?
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  override init() {
    super.init()
    setupAppStateMonitoring()
  }
  
  @objc
  func setLockedApps(_ apps: [String]) {
    lockedApps = Set(apps)
    
    // Save to UserDefaults for AppDelegate access
    let defaults = UserDefaults.standard
    defaults.set(Array(lockedApps), forKey: "FWRD_LockedApps")
    defaults.synchronize()
  }
  
  @objc
  func checkAppLock(_ packageName: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let isLocked = lockedApps.contains(packageName)
    resolve(isLocked)
  }
  
  @objc
  func getLockedApps(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve(Array(lockedApps))
  }
  
  @objc
  func getPendingBlockedApp(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    // Get pending blocked app from UserDefaults
    let defaults = UserDefaults.standard
    if let appInfo = defaults.dictionary(forKey: "FWRD_PendingBlockedApp") as? [String: String] {
      defaults.removeObject(forKey: "FWRD_PendingBlockedApp")
      defaults.synchronize()
      resolve(appInfo)
    } else {
      resolve(nil)
    }
  }
  
  @objc
  func openAccessibilitySettings() {
    // Open iOS Accessibility Settings
    if let settingsUrl = URL(string: UIApplication.openSettingsURLString) {
      DispatchQueue.main.async {
        if UIApplication.shared.canOpenURL(settingsUrl) {
          UIApplication.shared.open(settingsUrl, completionHandler: { (success) in
            if !success {
              print("Failed to open settings")
            }
          })
        }
      }
    }
  }
  
  @objc
  func isAccessibilityServiceEnabled(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    // On iOS, we don't have accessibility service like Android
    // Return false as iOS doesn't support this feature
    resolve(false)
  }
  
  func isAppLocked(_ packageName: String) -> Bool {
    return lockedApps.contains(packageName)
  }
  
  // iOS: Check if a URL scheme is locked
  @objc
  func checkURLSchemeLock(_ scheme: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    // Map URL schemes to bundle IDs
    let schemeToBundleId: [String: String] = [
      "youtube://": "com.google.ios.youtube",
      "instagram://": "com.burbn.instagram",
      "whatsapp://": "net.whatsapp.WhatsApp",
      "facebook://": "com.facebook.Facebook",
      "twitter://": "com.atebits.Tweetie2",
      "spotify://": "com.spotify.client",
      "snapchat://": "com.toyopagroup.picaboo",
      "telegram://": "ph.telegra.Telegraph",
      "messenger://": "com.facebook.Messenger",
      "linkedin://": "com.linkedin.LinkedIn",
      "skype://": "com.skype.skype",
      "viber://": "com.viber",
      "zoom://": "us.zoom.videomeetings",
      "netflix://": "com.netflix.Netflix",
      "amazon://": "com.amazon.Amazon",
      "uber://": "com.ubercab.UberClient",
      "gmail://": "com.google.Gmail",
    ]
    
    if let bundleId = schemeToBundleId[scheme] {
      let isLocked = lockedApps.contains(bundleId)
      resolve(isLocked)
    } else {
      resolve(false)
    }
  }
  
  // iOS: Block app launch attempt
  @objc
  func blockAppLaunch(_ packageName: String, appName: String) {
    // Store blocked app info in UserDefaults for AppDelegate to handle
    let defaults = UserDefaults.standard
    let appInfo: [String: String] = [
      "packageName": packageName,
      "appName": appName
    ]
    defaults.set(appInfo, forKey: "FWRD_PendingBlockedApp")
    defaults.set(appInfo, forKey: "FWRD_LastBlockedApp")
    defaults.synchronize()
    
    // Set AppDelegate's static property
    AppDelegate.lastBlockedApp = appInfo
    
    // Try to close the app using LSApplicationWorkspace (private API)
    DispatchQueue.main.async {
      // Try to open our app to bring it to foreground
      if let ourAppURL = URL(string: "\(Bundle.main.bundleIdentifier ?? ""):") {
        if UIApplication.shared.canOpenURL(ourAppURL) {
          UIApplication.shared.open(ourAppURL, options: [:], completionHandler: nil)
        }
      }
      
      // Show alert
      let alert = UIAlertController(
        title: "App Locked",
        message: "🔒 \(appName) is locked. Please unlock it first.",
        preferredStyle: .alert
      )
      alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
        // Try to bring FWRD to foreground after alert is dismissed
        if let settingsUrl = URL(string: UIApplication.openSettingsURLString) {
          // This will open Settings, user can then switch back to FWRD
        }
      })
      
      if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
         let rootViewController = windowScene.windows.first?.rootViewController {
        rootViewController.present(alert, animated: true)
      }
      
      // Post notification for React Native
      NotificationCenter.default.post(
        name: NSNotification.Name("FWRD_AppBlocked"),
        object: nil,
        userInfo: appInfo
      )
    }
  }
  
  private func setupAppStateMonitoring() {
    // Monitor app state changes
    appStateObserver = NotificationCenter.default.addObserver(
      forName: UIApplication.didBecomeActiveNotification,
      object: nil,
      queue: .main
    ) { [weak self] _ in
      // App became active - check if we need to show blocked screen
      self?.checkForBlockedApps()
    }
  }
  
  private func checkForBlockedApps() {
    // Check if there's a pending blocked app
    let defaults = UserDefaults.standard
    if let appInfo = defaults.dictionary(forKey: "FWRD_PendingBlockedApp") as? [String: String] {
      // There's a blocked app - send event to React Native
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
        NotificationCenter.default.post(
          name: NSNotification.Name("FWRD_AppBlocked"),
          object: nil,
          userInfo: appInfo
        )
      }
    }
    
    // Also check if any locked apps might be running
    // This is limited on iOS, but we try our best
    if !lockedApps.isEmpty {
      // Store that we're checking - React Native will handle showing blocked screen
      defaults.set(true, forKey: "FWRD_ShouldCheckBlocked")
      defaults.synchronize()
    }
  }
  
  private var monitoringTimer: Timer?
  private var lastForegroundApp: String? = nil
  
  @objc
  func startMonitoring() {
    // Stop any existing timer
    stopMonitoring()
    
    // Start aggressive monitoring on iOS
    // Check every 0.5 seconds for faster detection
    monitoringTimer = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { [weak self] _ in
      self?.checkForBlockedApps()
      self?.monitorForegroundApps()
    }
    
    // Also check immediately
    checkForBlockedApps()
    monitorForegroundApps()
  }
  
  private func monitorForegroundApps() {
    // Use LSApplicationWorkspace to detect foreground apps (private API - development only)
    guard !lockedApps.isEmpty else {
      return
    }
    
    guard let workspaceClass = NSClassFromString("LSApplicationWorkspace") as? NSObjectProtocol else {
      return
    }
    
    let defaultWorkspaceSelector = NSSelectorFromString("defaultWorkspace")
    guard workspaceClass.responds(to: defaultWorkspaceSelector) else {
      return
    }
    
    guard let workspaceInstance = workspaceClass.perform(defaultWorkspaceSelector)?.takeUnretainedValue() as? NSObject else {
      return
    }
    
    // Try multiple methods to detect foreground app
    
    // Method 1: Try to get open applications
    let openAppsSelector = NSSelectorFromString("openApplications")
    if workspaceInstance.responds(to: openAppsSelector),
       let openApps = workspaceInstance.perform(openAppsSelector)?.takeUnretainedValue() as? [AnyObject] {
      
      // Check each open app
      for app in openApps {
        guard let appObj = app as? NSObject else {
          continue
        }
        
        let bundleIdSelector = NSSelectorFromString("applicationIdentifier")
        if appObj.responds(to: bundleIdSelector),
           let bundleId = appObj.perform(bundleIdSelector)?.takeUnretainedValue() as? String {
          
          // Skip our own app
          if bundleId == Bundle.main.bundleIdentifier {
            continue
          }
          
          // Check if this is a new app (different from last checked)
          if bundleId != lastForegroundApp {
            lastForegroundApp = bundleId
            
            // Check if app is locked
            if isAppLocked(bundleId) {
              // Get app name
              let localizedNameSelector = NSSelectorFromString("localizedName")
              var appName = bundleId
              if appObj.responds(to: localizedNameSelector),
                 let name = appObj.perform(localizedNameSelector)?.takeUnretainedValue() as? String {
                appName = name
              }
              
              print("🔒 FWRD: Detected locked app \(appName) (\(bundleId))")
              
              // Block the app
              blockAppLaunch(bundleId, appName: appName)
              break // Only block one at a time
            }
          }
        }
      }
    }
    
    // Method 2: Try to get frontmost application
    let frontmostAppSelector = NSSelectorFromString("frontmostApplication")
    if workspaceInstance.responds(to: frontmostAppSelector),
       let frontmostApp = workspaceInstance.perform(frontmostAppSelector)?.takeUnretainedValue() as? NSObject {
      
      let bundleIdSelector = NSSelectorFromString("applicationIdentifier")
      if frontmostApp.responds(to: bundleIdSelector),
         let bundleId = frontmostApp.perform(bundleIdSelector)?.takeUnretainedValue() as? String,
         bundleId != Bundle.main.bundleIdentifier,
         bundleId != lastForegroundApp {
        
        lastForegroundApp = bundleId
        
        if isAppLocked(bundleId) {
          let localizedNameSelector = NSSelectorFromString("localizedName")
          var appName = bundleId
          if frontmostApp.responds(to: localizedNameSelector),
             let name = frontmostApp.perform(localizedNameSelector)?.takeUnretainedValue() as? String {
            appName = name
          }
          
          print("🔒 FWRD: Detected locked app in foreground \(appName) (\(bundleId))")
          blockAppLaunch(bundleId, appName: appName)
        }
      }
    }
  }
  
  @objc
  func stopMonitoring() {
    // Stop monitoring timer
    monitoringTimer?.invalidate()
    monitoringTimer = nil
  }
  
  deinit {
    if let observer = appStateObserver {
      NotificationCenter.default.removeObserver(observer)
    }
  }
}

