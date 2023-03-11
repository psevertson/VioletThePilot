#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN
@class CAAgent;

@interface CAAdvertising : NSObject
- (instancetype)initWithAgent:(CAAgent *)agent;

- (void)begin:(NSString*)aid;
- (void)complete:(NSString*)aid timeLong:(NSString*)timeLong profit:(NSString*)profit;
- (void)failed:(NSString*)aid reason:(NSString*)reason;

+ (void)begin:(NSString*)_id;
+ (void)complete:(NSString*)_id timeLong:(NSString*)timeLong profit:(NSString*)profit;
+ (void)failed:(NSString*)_id reason:(NSString*)reason;
@end
NS_ASSUME_NONNULL_END
