#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@class CAAccount, CATask, CALevels, CAVirtual, CAPayment, CAItem, CAEvent, CACustomEvent, CAAdvertising;

@interface CAAgent : NSObject
@property (nonatomic, copy, readonly) NSString *appID;
@property (nonatomic, copy, readonly) NSString *storeID;
@property (nonatomic, copy, readonly) NSString *engine;
@property (nonatomic, copy, readonly) NSString *callNumber;

@property (nonatomic, readonly) CAAccount *account;
@property (nonatomic, readonly) CATask *task;
@property (nonatomic, readonly) CALevels *levels;
@property (nonatomic, readonly) CAVirtual *virtualCoin;
@property (nonatomic, readonly) CAPayment *payment;
@property (nonatomic, readonly) CAItem *item;
@property (nonatomic, readonly) CAEvent *event;
@property (nonatomic, readonly) CACustomEvent *customEvent;
@property (nonatomic, readonly) CAAdvertising *advertising;

- (instancetype)init NS_UNAVAILABLE;

// v3 版本多实例接口
- (instancetype)init:(NSString*)appID storeID:(NSString*)storeID engine:(NSString*)engine;
- (instancetype)init:(NSString*)appID storeID:(NSString*)storeID engine:(NSString*)engine callNumber:(NSString*)callNumber;
- (void)onResume;
- (void)onPause;
- (void)onDestroy;
- (void)enableDebug:(BOOL)enable;
- (BOOL)isInited;

// v2 版本接口
+ (void)init:(NSString*)appID storeID:(NSString*)storeID engine:(NSString*)engine;
+ (void)init:(NSString*)appID storeID:(NSString*)storeID engine:(NSString*)engine callNumber:(NSString*)callNumber;
+ (void)onResume;
+ (void)onPause;
+ (void)onDestroy;
+ (void)enableDebug:(BOOL)enable;
+ (BOOL)isInited;

@end

NS_ASSUME_NONNULL_END
