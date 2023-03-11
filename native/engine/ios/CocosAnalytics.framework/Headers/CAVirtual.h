#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN
@class CAAgent;

@interface CAVirtual : NSObject

- (void)setVirtualNum:(NSString*)type count:(long)count;
- (void)get:(NSString*)type count:(long)count reason:(NSString*)reason;
- (void)consume:(NSString*)type count:(long)count reason:(NSString*)reason;

+ (void)setVirtualNum:(NSString*)type count:(long)count;
+ (void)get:(NSString*)type count:(long)count reason:(NSString*)reason;
+ (void)consume:(NSString*)type count:(long)count reason:(NSString*)reason;
@end
NS_ASSUME_NONNULL_END
