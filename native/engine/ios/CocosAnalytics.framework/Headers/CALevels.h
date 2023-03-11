#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN
@class CAAgent;

@interface CALevels : NSObject

- (void)begin:(NSString*)level;
- (void)complete:(NSString*)level;
- (void)failed:(NSString*)level reason:(NSString*)reason;

+ (void)begin:(NSString*)level;
+ (void)complete:(NSString*)level;
+ (void)failed:(NSString*)level reason:(NSString*)reason;
@end

NS_ASSUME_NONNULL_END
