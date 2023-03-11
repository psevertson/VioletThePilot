//
//  CocosAnalyticsSDK.h
//  CocosAnalytics
//
//  Created by h4ck on 2021/9/10.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN
@class CAAgent;

// for v3 only
@interface CocosAnalyticsSDK : NSObject
+ (instancetype)sharedSDK;
- (void)enableDebug:(BOOL)enable;

- (long long)getAgentID:(CAAgent *)agent;
- (CAAgent *)getAgentWithID:(long long)iID;
- (CAAgent *)createAgentWithAppID:(NSString*)appID storeID:(NSString*)storeID engine:(NSString*)engine;
- (CAAgent *)createAgentWithAppID:(NSString*)appID storeID:(NSString*)storeID engine:(NSString*)engine callNumber:(NSString*)callNumber;
- (void)destoryAgent:(CAAgent *)agent;
@end

NS_ASSUME_NONNULL_END
