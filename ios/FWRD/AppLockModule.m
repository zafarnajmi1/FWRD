#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(AppLockModule, NSObject)

RCT_EXTERN_METHOD(setLockedApps:(NSArray *)apps)
RCT_EXTERN_METHOD(checkAppLock:(NSString *)packageName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getLockedApps:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getPendingBlockedApp:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(openAccessibilitySettings)
RCT_EXTERN_METHOD(isAccessibilityServiceEnabled:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(startMonitoring)
RCT_EXTERN_METHOD(stopMonitoring)
RCT_EXTERN_METHOD(checkURLSchemeLock:(NSString *)scheme
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(blockAppLaunch:(NSString *)packageName
                  appName:(NSString *)appName)

@end

