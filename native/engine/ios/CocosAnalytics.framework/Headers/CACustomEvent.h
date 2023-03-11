#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN
@class CAAgent;

@interface CACustomEvent : NSObject

- (void)onStarted:(NSString*)eventID eventData:(NSDictionary*)eventData;
- (void)onSuccess:(NSString*)eventID eventData:(NSDictionary*)eventData;
- (void)onCancelled:(NSString*)eventID eventData:(NSDictionary*)eventData;
- (void)onFailed:(NSString*)eventID eventData:(NSDictionary*)eventData reason:(NSString*)reason;

- (void)onStarted:(NSString*)eventID eventBody:(NSString*)eventBody;
- (void)onSuccess:(NSString*)eventID eventBody:(NSString*)eventBody;
- (void)onCancelled:(NSString*)eventID eventBody:(NSString*)eventBody;
- (void)onFailed:(NSString*)eventID eventBody:(NSString*)eventBody reason:(NSString*)reason;


+ (void)onStarted:(NSString*)eventID eventData:(NSDictionary*)eventData;
+ (void)onSuccess:(NSString*)eventID eventData:(NSDictionary*)eventData;
+ (void)onCancelled:(NSString*)eventID eventData:(NSDictionary*)eventData;
+ (void)onFailed:(NSString*)eventID eventData:(NSDictionary*)eventData reason:(NSString*)reason;

+ (void)onStarted:(NSString*)eventID eventBody:(NSString*)eventBody;
+ (void)onSuccess:(NSString*)eventID eventBody:(NSString*)eventBody;
+ (void)onCancelled:(NSString*)eventID eventBody:(NSString*)eventBody;
+ (void)onFailed:(NSString*)eventID eventBody:(NSString*)eventBody reason:(NSString*)reason;
@end
NS_ASSUME_NONNULL_END
