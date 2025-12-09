#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(InstalledAppsModule, NSObject)

RCT_EXTERN_METHOD(getInstalledApps:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end

