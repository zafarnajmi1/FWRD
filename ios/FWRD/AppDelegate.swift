import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?
  
  // Store last blocked app info for iOS
  static var lastBlockedApp: [String: String]? = nil

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "FWRD",
      in: window,
      launchOptions: launchOptions
    )
    
    // Monitor app state changes
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(applicationDidBecomeActive),
      name: UIApplication.didBecomeActiveNotification,
      object: nil
    )
    
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(applicationWillResignActive),
      name: UIApplication.willResignActiveNotification,
      object: nil
    )

    return true
  }
  
  @objc func applicationDidBecomeActive() {
    // When app becomes active, check if we need to show blocked screen
    var blockedApp: [String: String]? = AppDelegate.lastBlockedApp
    
    // Also check UserDefaults as backup
    if blockedApp == nil {
      if let stored = UserDefaults.standard.dictionary(forKey: "FWRD_LastBlockedApp") as? [String: String] {
        blockedApp = stored
        UserDefaults.standard.removeObject(forKey: "FWRD_LastBlockedApp")
      }
    }
    
    if let app = blockedApp {
      sendBlockedAppEvent(app)
      AppDelegate.lastBlockedApp = nil // Clear after sending
    }
    
    // Check for locked apps that might be running
    checkAndBlockLockedApps()
  }
  
  // Intercept URL scheme opening to block locked apps
  func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    // Check if this URL scheme corresponds to a locked app
    let scheme = url.scheme ?? ""
    let lockedApps = UserDefaults.standard.array(forKey: "FWRD_LockedApps") as? [String] ?? []
    
    // Map URL schemes to bundle IDs
    let schemeToBundleId: [String: String] = [
      "youtube": "com.google.ios.youtube",
      "instagram": "com.burbn.instagram",
      "whatsapp": "net.whatsapp.WhatsApp",
      "facebook": "com.facebook.Facebook",
      "twitter": "com.atebits.Tweetie2",
      "spotify": "com.spotify.client",
      "snapchat": "com.toyopagroup.picaboo",
      "telegram": "ph.telegra.Telegraph",
      "messenger": "com.facebook.Messenger",
      "linkedin": "com.linkedin.LinkedIn",
      "skype": "com.skype.skype",
      "viber": "com.viber",
      "zoom": "us.zoom.videomeetings",
      "netflix": "com.netflix.Netflix",
      "amazon": "com.amazon.Amazon",
      "uber": "com.ubercab.UberClient",
      "gmail": "com.google.Gmail",
    ]
    
    if let bundleId = schemeToBundleId[scheme.lowercased()],
       lockedApps.contains(bundleId) {
      // App is locked, block the URL opening
      let appName = getAppName(for: bundleId) ?? bundleId
      blockAppLaunch(bundleId: bundleId, appName: appName)
      return false // Prevent opening
    }
    
    return true // Allow opening if not locked
  }
  
  private func getAppName(for bundleId: String) -> String? {
    // Try to get app name from installed apps list
    // This is a simplified version - in production you'd cache this
    return nil
  }
  
  private func blockAppLaunch(bundleId: String, appName: String) {
    // Store blocked app info
    let appInfo: [String: String] = [
      "packageName": bundleId,
      "appName": appName
    ]
    
    AppDelegate.lastBlockedApp = appInfo
    UserDefaults.standard.set(appInfo, forKey: "FWRD_PendingBlockedApp")
    UserDefaults.standard.synchronize()
    
    // Show alert
    DispatchQueue.main.async {
      let alert = UIAlertController(
        title: "App Locked",
        message: "🔒 \(appName) is locked. Please unlock it first.",
        preferredStyle: .alert
      )
      alert.addAction(UIAlertAction(title: "OK", style: .default))
      
      if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
         let rootViewController = windowScene.windows.first?.rootViewController {
        rootViewController.present(alert, animated: true)
      }
    }
    
    // Send event to React Native
    sendBlockedAppEvent(appInfo)
  }
  
  private func checkAndBlockLockedApps() {
    // Check if any locked apps are currently running
    // This is limited on iOS, but we can try to detect via URL scheme checking
    let lockedApps = UserDefaults.standard.array(forKey: "FWRD_LockedApps") as? [String] ?? []
    
    if lockedApps.isEmpty {
      return
    }
    
    // Try to detect if a locked app was recently opened
    // Store timestamp when app becomes active
    let lastActiveTime = UserDefaults.standard.double(forKey: "FWRD_LastActiveTime")
    let currentTime = Date().timeIntervalSince1970
    
    // If app was inactive for more than 2 seconds, might have switched apps
    if currentTime - lastActiveTime > 2.0 {
      // Check if we need to show blocked screen
      if let pendingApp = UserDefaults.standard.dictionary(forKey: "FWRD_PendingBlockedApp") as? [String: String] {
        sendBlockedAppEvent(pendingApp)
      }
    }
    
    UserDefaults.standard.set(currentTime, forKey: "FWRD_LastActiveTime")
  }
  
  @objc func applicationWillResignActive() {
    // App is going to background - store timestamp
    UserDefaults.standard.set(Date().timeIntervalSince1970, forKey: "FWRD_LastResignTime")
  }
  
  private func sendBlockedAppEvent(_ appInfo: [String: String]) {
    // Use a delay to ensure React Native is ready
    DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
      // Store in UserDefaults for React Native to pick up
      let defaults = UserDefaults.standard
      defaults.set(appInfo, forKey: "FWRD_PendingBlockedApp")
      defaults.synchronize()
      
      // Post notification that React Native can listen to
      NotificationCenter.default.post(
        name: NSNotification.Name("FWRD_AppBlocked"),
        object: nil,
        userInfo: appInfo
      )
    }
  }
  
  deinit {
    NotificationCenter.default.removeObserver(self)
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
