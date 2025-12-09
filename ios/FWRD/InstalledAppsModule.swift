import Foundation
import UIKit
import React

@objc(InstalledAppsModule)
class InstalledAppsModule: NSObject {
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  @objc
  func getInstalledApps(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.global(qos: .userInitiated).async {
      var appList: [[String: Any]] = []
      
      // Wrap everything in autoreleasepool and error handling
      autoreleasepool {
        // Try to use LSApplicationWorkspace (private API - for development only)
        // Note: This may crash on some iOS versions or devices, so we wrap it carefully
        if let workspaceClass = NSClassFromString("LSApplicationWorkspace"),
           let workspace = workspaceClass as? NSObjectProtocol {
          
          // Get default workspace instance
          let defaultWorkspaceSelector = NSSelectorFromString("defaultWorkspace")
          if workspace.responds(to: defaultWorkspaceSelector) {
            if let workspaceInstance = workspace.perform(defaultWorkspaceSelector)?.takeUnretainedValue() as? NSObject {
              
              // Get all installed applications
              let allAppsSelector = NSSelectorFromString("allInstalledApplications")
              if workspaceInstance.responds(to: allAppsSelector) {
                if let allApplications = workspaceInstance.perform(allAppsSelector)?.takeUnretainedValue() as? [AnyObject] {
                  
                  for app in allApplications {
                    // Safely extract app information
                    guard let appObj = app as? NSObject else {
                      continue
                    }
                    
                    var appDict: [String: Any] = [:]
                    
                    // Get bundle identifier
                    let bundleIdSelector = NSSelectorFromString("applicationIdentifier")
                    var bundleId: String? = nil
                    if appObj.responds(to: bundleIdSelector) {
                      if let appBundleId = appObj.perform(bundleIdSelector)?.takeUnretainedValue() as? String {
                        bundleId = appBundleId
                        appDict["packageName"] = appBundleId
                      }
                    }
                    
                    // Skip if no bundle ID
                    guard let currentBundleId = bundleId else {
                      continue
                    }
                    
                    // Get app name
                    let localizedNameSelector = NSSelectorFromString("localizedName")
                    var appLabel: String = currentBundleId.components(separatedBy: ".").last ?? currentBundleId
                    
                    if appObj.responds(to: localizedNameSelector) {
                      if let localizedName = appObj.perform(localizedNameSelector)?.takeUnretainedValue() as? String,
                         !localizedName.isEmpty {
                        appLabel = localizedName
                      }
                    }
                    appDict["label"] = appLabel
                    
                    // Check if it's a system app
                    let bundleURLSelector = NSSelectorFromString("bundleURL")
                    var isSystemApp = false
                    var bundleURL: URL? = nil
                    
                    if appObj.responds(to: bundleURLSelector) {
                      if let url = appObj.perform(bundleURLSelector)?.takeUnretainedValue() as? URL {
                        bundleURL = url
                        let path = url.path
                        // More accurate system app detection
                        isSystemApp = path.contains("/Applications/") || 
                                     path.contains("/System/") || 
                                     path.contains("/private/var/containers/Bundle/Application") ||
                                     path.contains("/var/containers/Bundle/Application")
                      }
                    }
                    
                    appDict["isSystemApp"] = isSystemApp
                    
                    // Only include user-installed apps (skip system apps) - matching Android behavior
                    if !isSystemApp {
                      // Try to get app icon
                      var iconBase64: String? = nil
                      if let url = bundleURL {
                        iconBase64 = self.getAppIcon(bundleURL: url, bundleId: currentBundleId)
                      }
                      
                      // Match Android: use null (NSNull) when icon is not available
                      if let icon = iconBase64 {
                        appDict["icon"] = icon
                      } else {
                        appDict["icon"] = NSNull()
                      }
                      
                      appList.append(appDict)
                    }
                  }
                }
              }
            }
          }
        }
      }
      
      // If we got no apps from private API, use URL scheme fallback
      if appList.isEmpty {
        appList = self.getAppsUsingURLSchemes()
      }
      
      // Sort apps by name (matching Android behavior)
      appList.sort { (app1, app2) -> Bool in
        let name1 = app1["label"] as? String ?? ""
        let name2 = app2["label"] as? String ?? ""
        return name1.localizedCaseInsensitiveCompare(name2) == .orderedAscending
      }
      
      // Always resolve, never reject (matching Android behavior)
      DispatchQueue.main.async {
        resolve(appList)
      }
    }
  }
  
  // Fallback method using URL scheme checking (App Store safe)
  private func getAppsUsingURLSchemes() -> [[String: Any]] {
    var appList: [[String: Any]] = []
    
    // Common app URL schemes
    let commonApps: [(scheme: String, name: String, bundleId: String)] = [
      ("whatsapp://", "WhatsApp", "net.whatsapp.WhatsApp"),
      ("instagram://", "Instagram", "com.burbn.instagram"),
      ("facebook://", "Facebook", "com.facebook.Facebook"),
      ("twitter://", "Twitter", "com.atebits.Tweetie2"),
      ("youtube://", "YouTube", "com.google.ios.youtube"),
      ("spotify://", "Spotify", "com.spotify.client"),
      ("snapchat://", "Snapchat", "com.toyopagroup.picaboo"),
      ("telegram://", "Telegram", "ph.telegra.Telegraph"),
      ("messenger://", "Messenger", "com.facebook.Messenger"),
      ("linkedin://", "LinkedIn", "com.linkedin.LinkedIn"),
      ("skype://", "Skype", "com.skype.skype"),
      ("viber://", "Viber", "com.viber"),
      ("zoom://", "Zoom", "us.zoom.videomeetings"),
      ("netflix://", "Netflix", "com.netflix.Netflix"),
      ("amazon://", "Amazon", "com.amazon.Amazon"),
      ("uber://", "Uber", "com.ubercab.UberClient"),
      ("gmail://", "Gmail", "com.google.Gmail"),
      ("maps://", "Maps", "com.apple.Maps"),
      ("photos://", "Photos", "com.apple.mobileslideshow"),
    ]
    
    for app in commonApps {
      if let appURL = URL(string: app.scheme) {
        if UIApplication.shared.canOpenURL(appURL) {
          var appDict: [String: Any] = [
            "packageName": app.bundleId,
            "label": app.name,
            "isSystemApp": false
          ]
          
          // Try to get icon (this might fail, but that's okay)
          if let iconBase64 = self.getAppIconForBundleId(app.bundleId) {
            appDict["icon"] = iconBase64
          } else {
            appDict["icon"] = NSNull()
          }
          
          appList.append(appDict)
        }
      }
    }
    
    return appList
  }
  
  // Get app icon for a bundle ID
  private func getAppIconForBundleId(_ bundleId: String) -> String? {
    // Try to get bundle URL first
    if let bundleURL = self.getBundleURL(for: bundleId) {
      return self.getAppIcon(bundleURL: bundleURL, bundleId: bundleId)
    }
    return nil
  }
  
  // Get bundle URL for a given bundle identifier
  private func getBundleURL(for bundleId: String) -> URL? {
    guard let workspaceClass = NSClassFromString("LSApplicationWorkspace"),
          let workspace = workspaceClass as? NSObjectProtocol else {
      return nil
    }
    
    let defaultWorkspaceSelector = NSSelectorFromString("defaultWorkspace")
    guard workspace.responds(to: defaultWorkspaceSelector) else {
      return nil
    }
    
    guard let workspaceInstance = workspace.perform(defaultWorkspaceSelector)?.takeUnretainedValue() as? NSObject else {
      return nil
    }
    
    let allAppsSelector = NSSelectorFromString("allInstalledApplications")
    guard workspaceInstance.responds(to: allAppsSelector) else {
      return nil
    }
    
    guard let allApplications = workspaceInstance.perform(allAppsSelector)?.takeUnretainedValue() as? [AnyObject] else {
      return nil
    }
    
    for app in allApplications {
      guard let appObj = app as? NSObject else {
        continue
      }
      
      let bundleIdSelector = NSSelectorFromString("applicationIdentifier")
      guard appObj.responds(to: bundleIdSelector) else {
        continue
      }
      
      guard let appBundleId = appObj.perform(bundleIdSelector)?.takeUnretainedValue() as? String,
            appBundleId == bundleId else {
        continue
      }
      
      let bundleURLSelector = NSSelectorFromString("bundleURL")
      guard appObj.responds(to: bundleURLSelector) else {
        continue
      }
      
      if let url = appObj.perform(bundleURLSelector)?.takeUnretainedValue() as? URL {
        return url
      }
    }
    
    return nil
  }
  
  // Get app icon from bundle and convert to base64
  private func getAppIcon(bundleURL: URL, bundleId: String) -> String? {
    // Try to get icon using LSApplicationWorkspace icon method
    if let workspaceClass = NSClassFromString("LSApplicationWorkspace"),
       let workspace = workspaceClass as? NSObjectProtocol {
      
      let defaultWorkspaceSelector = NSSelectorFromString("defaultWorkspace")
      if workspace.responds(to: defaultWorkspaceSelector),
         let workspaceInstance = workspace.perform(defaultWorkspaceSelector)?.takeUnretainedValue() as? NSObject {
        
        // Try using applicationForBundleIdentifier
        let appForBundleSelector = NSSelectorFromString("applicationForBundleIdentifier:")
        if workspaceInstance.responds(to: appForBundleSelector) {
          if let app = workspaceInstance.perform(appForBundleSelector, with: bundleId)?.takeUnretainedValue() as? NSObject {
            
            // Try to get icon data
            let iconDataSelector = NSSelectorFromString("iconDataForVariant:")
            if app.responds(to: iconDataSelector),
               let iconData = app.perform(iconDataSelector, with: 0)?.takeUnretainedValue() as? Data,
               let image = UIImage(data: iconData) {
              return imageToBase64(image: image)
            }
          }
        }
      }
    }
    
    // Fallback: Try to read from app bundle (this usually doesn't work due to sandboxing)
    let iconPaths = [
      bundleURL.appendingPathComponent("AppIcon60x60@2x.png"),
      bundleURL.appendingPathComponent("AppIcon60x60@3x.png"),
      bundleURL.appendingPathComponent("AppIcon@2x.png"),
      bundleURL.appendingPathComponent("AppIcon@3x.png"),
      bundleURL.appendingPathComponent("AppIcon.png"),
    ]
    
    for iconPath in iconPaths {
      if FileManager.default.fileExists(atPath: iconPath.path),
         let image = UIImage(contentsOfFile: iconPath.path) {
        return imageToBase64(image: image)
      }
    }
    
    return nil
  }
  
  // Convert UIImage to base64 string
  private func imageToBase64(image: UIImage) -> String? {
    // Resize image to 64x64 for consistency (matching Android)
    let size = CGSize(width: 64, height: 64)
    UIGraphicsBeginImageContextWithOptions(size, false, 0.0)
    defer { UIGraphicsEndImageContext() }
    
    image.draw(in: CGRect(origin: .zero, size: size))
    guard let resizedImage = UIGraphicsGetImageFromCurrentImageContext(),
          let imageData = resizedImage.pngData() else {
      return nil
    }
    
    return imageData.base64EncodedString(options: .lineLength64Characters)
  }
}
