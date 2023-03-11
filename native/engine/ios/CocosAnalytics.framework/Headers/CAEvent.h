#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN
@class CAAgent;

@interface CAEvent : NSObject

- (void)onEvent:(NSString*)eventName;
- (void)onEventStart:(NSString*)eventName;
- (void)onEventEnd:(NSString*)eventName;

+ (void)onEvent:(NSString*)eventName;
+ (void)onEventStart:(NSString*)eventName;
+ (void)onEventEnd:(NSString*)eventName;
@end
NS_ASSUME_NONNULL_END
