//
//  Analytics.m
//  polish_project-mobile
//
//  Created by 杨欣 on 2018/10/22.
//

#import "ServiceAnalytics.h"

#import <CocosAnalytics/CocosAnalytics.h>

@implementation ServiceAnalytics

- (void)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [[CocosAnalyticsSDK sharedSDK] enableDebug:NO];
}

- (void)applicationDidEnterBackground:(UIApplication *)application {

}

- (void)applicationWillEnterForeground:(UIApplication *)application {

}

- (void)applicationWillTerminate:(UIApplication *)application {

}

+ (long)initAnalytics:(NSString*)appID storeID:(NSString*)storeID engine:(NSString*)engine callNumber:(NSString*)callNumber {
    CocosAnalyticsSDK *analyticsSDK = [CocosAnalyticsSDK sharedSDK];
    CAAgent *agent = [analyticsSDK createAgentWithAppID:appID
                                                storeID:storeID
                                                 engine:engine
                                             callNumber:callNumber];
    long iid = [analyticsSDK getAgentID:agent];
    NSLog(@"new agent id= %ld", iid);
    return iid;
}

+ (BOOL)isInited:(long)iid {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    if (agent) {
        return YES;
    } else {
        return NO;
    }
}

+ (void)logDebug:(long)iid enable:(BOOL)enable {
    // TODO: 只支持全局日志，针对每个 Agent 开关日志除了徒增资源貌似没有什么意义。
    [[CocosAnalyticsSDK sharedSDK] enableDebug:enable];
}

#pragma mark - Account
+ (void)loginAccountStart:(long)iid {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.account loginStart];
}

+ (void)loginAccountStart:(long)iid channel:(NSString *)channel {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.account loginStart:channel];
}

+ (void)loginAccountSuccess:(long)iid uid:(NSString *)uid {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.account loginSuccess:uid];
}

+ (void)loginAccountSuccess:(long)iid uid:(NSString *)uid age:(int)age sex:(int)sex channel:(NSString*)channel {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.account loginSuccess:uid age:age sex:sex channel:channel];
}

+ (void)loginAccountFailed:(long)iid reason:(NSString *)reason channel:(NSString*)channel {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.account loginFailed:reason channel:channel];
}

+ (void)logoutAccount:(long)iid {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.account logout];
}

+ (void)setAccountType:(long)iid type:(NSString *)accountType {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.account setAccountType:accountType];
}

+ (void)setAccountAge:(long)iid age:(int)age {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.account setAge:age];
}

+ (void)setAccountGender:(long)iid gender:(int)gender {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.account setGender:gender];
}

+ (void)setAccountLevel:(long)iid level:(int)level {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.account setLevel:level];
}

+ (void)createAccountRole:(long)iid roleID:(NSString*)roleID userName:(NSString*)userName race:(NSString*)race
         roleClass:(NSString*)roleClass gameServer:(NSString*)gameServer {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.account createRole:roleID userName:userName race:race roleClass:roleClass gameServer:gameServer];
}

#pragma mark - CAEvent
+ (void)onEvent:(long)iid eventName:(NSString *)eventName {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.event onEvent:eventName];
}

+ (void)onEventStart:(long)iid eventName:(NSString *)eventName {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.event onEventStart:eventName];
}

+ (void)onEventEnd:(long)iid eventName:(NSString *)eventName {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.event onEventEnd:eventName];
}

#pragma mark - CAPayment
+ (void)payBegin:(long)iid
          amount:(NSString*)amount
         orderID:(NSString*)orderID
         payType:(NSString*)payType
       subjectID:(NSString*)subjectID
    currencyType:(NSString*)currencyType
virtualCurrencyAmount:(NSString*)virtualCurrencyAmount
       accountID:(NSString*)accountID
         partner:(NSString*)partner
      gameServer:(NSString*)gameServer
           level:(NSString*)level
         mission:(NSString*)mission {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.payment payBegin:amount
                    orderID:orderID
                    payType:payType
                  subjectID:subjectID
               currencyType:currencyType
      virtualCurrencyAmount:virtualCurrencyAmount
                  accountID:accountID
                    partner:partner
                 gameServer:gameServer
                      level:level
                    mission:mission];
}

+ (void)paySuccess:(long)iid
          amount:(NSString*)amount
         orderID:(NSString*)orderID
         payType:(NSString*)payType
       subjectID:(NSString*)subjectID
    currencyType:(NSString*)currencyType
virtualCurrencyAmount:(NSString*)virtualCurrencyAmount
       accountID:(NSString*)accountID
         partner:(NSString*)partner
      gameServer:(NSString*)gameServer
           level:(NSString*)level
         mission:(NSString*)mission {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.payment paySuccess:amount
                    orderID:orderID
                    payType:payType
                  subjectID:subjectID
               currencyType:currencyType
      virtualCurrencyAmount:virtualCurrencyAmount
                  accountID:accountID
                    partner:partner
                 gameServer:gameServer
                      level:level
                    mission:mission];
}

+ (void)payFailed:(long)iid
          amount:(NSString*)amount
         orderID:(NSString*)orderID
         payType:(NSString*)payType
       subjectID:(NSString*)subjectID
    currencyType:(NSString*)currencyType
virtualCurrencyAmount:(NSString*)virtualCurrencyAmount
       accountID:(NSString*)accountID
         partner:(NSString*)partner
      gameServer:(NSString*)gameServer
           level:(NSString*)level
         mission:(NSString*)mission
           reason:(NSString*)reason {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.payment payFailed:amount
                    orderID:orderID
                    payType:payType
                  subjectID:subjectID
               currencyType:currencyType
      virtualCurrencyAmount:virtualCurrencyAmount
                  accountID:accountID
                    partner:partner
                 gameServer:gameServer
                      level:level
                    mission:mission
                     reason:reason];
}

+ (void)payCanceled:(long)iid
          amount:(NSString*)amount
         orderID:(NSString*)orderID
         payType:(NSString*)payType
       subjectID:(NSString*)subjectID
    currencyType:(NSString*)currencyType
virtualCurrencyAmount:(NSString*)virtualCurrencyAmount
       accountID:(NSString*)accountID
         partner:(NSString*)partner
      gameServer:(NSString*)gameServer
           level:(NSString*)level
         mission:(NSString*)mission {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.payment payCanceled:amount
                    orderID:orderID
                    payType:payType
                  subjectID:subjectID
               currencyType:currencyType
      virtualCurrencyAmount:virtualCurrencyAmount
                  accountID:accountID
                    partner:partner
                 gameServer:gameServer
                      level:level
                    mission:mission];
}

#pragma mark - CALevels
+ (void)levelBegin:(long)iid level:(NSString *)level {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.levels begin:level];
}

+ (void)levelComplete:(long)iid level:(NSString *)level {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.levels complete:level];
}

+ (void)levelFailed:(long)iid level:(NSString *)level reason:(NSString *)reason {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.levels failed:level reason:reason];
}

#pragma mark - CATask
+ (void)taskBegin:(long)iid taskID:(NSString *)taskID taskType:(int)taskType {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.task begin:taskID taskType:taskType];
}

+ (void)taskComplete:(long)iid taskID:(NSString *)taskID {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.task complete:taskID];
}

+ (void)taskFailed:(long)iid taskID:(NSString *)taskID reason:(NSString *)reason {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.task failed:taskID reason:reason];
}

#pragma mark - CAItem
+ (void)buyItem:(long)iid itemID:(NSString *)itemID type:(NSString *)itemType count:(int)itemCount virtualCoin:(int)virtualCoin virtualType:(NSString *)virtualType consumePoint:(NSString *)consumePoint {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.item buy:itemID type:itemType count:itemCount virtualCoin:virtualCoin virtualType:virtualType consumePoint:consumePoint];
}

+ (void)getItem:(long)iid itemID:(NSString *)itemID type:(NSString *)itemType count:(int)itemCount reason:(NSString *)reason {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.item get:itemID type:itemType count:itemCount reason:reason];
}

+ (void)consumeItem:(long)iid itemID:(NSString *)itemID type:(NSString *)itemType count:(int)itemCount reason:(NSString *)reason {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.item consume:itemID type:itemType count:itemCount reason:reason];
}

#pragma mark - CAVirtual
+ (void)setVirtualNum:(long)iid type:(NSString *)type count:(long)count {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.virtualCoin setVirtualNum:type count:count];
}

+ (void)getVirtual:(long)iid type:(NSString *)type count:(long)count reason:(NSString *)reason {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.virtualCoin get:type count:count reason:reason];
}

+ (void)consumeVirtual:(long)iid type:(NSString *)type count:(long)count reason:(NSString *)reason {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.virtualCoin consume:type count:count reason:reason];
}

#pragma mark - CAAdvertising
+ (void)beginAdvertising:(long)iid adID:(NSString *)adID {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.advertising begin:adID];
}

+ (void)completeAdvertising:(long)iid adID:(NSString *)adID timeLong:(NSString*)timeLong profit:(NSString*)profit {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.advertising complete:adID timeLong:timeLong profit:profit];
}

+ (void)failedAdvertising:(long)iid adID:(NSString *)adID reason:(NSString*)reason {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.advertising failed:adID reason:reason];
}

#pragma mark - CACustomEvent
+ (void)onCustomEventStarted:(long)iid eventID:(NSString*)eventID eventBody:(NSString*)eventData {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.customEvent onStarted:eventID eventBody:eventData];
}

+ (void)onCustomEventSuccess:(long)iid eventID:(NSString*)eventID eventBody:(NSString*)eventData {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.customEvent onSuccess:eventID eventBody:eventData];
}

+ (void)onCustomEventCancelled:(long)iid eventID:(NSString*)eventID eventBody:(NSString*)eventData {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.customEvent onCancelled:eventID eventBody:eventData];
}

+ (void)onCustomEventFailed:(long)iid eventID:(NSString*)eventID eventBody:(NSString*)eventData reason:(NSString*)reason {
    CAAgent *agent = [[CocosAnalyticsSDK sharedSDK] getAgentWithID:iid];
    [agent.customEvent onFailed:eventID eventBody:eventData reason:reason];
}
@end
