#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN
@class CAAgent;

@interface CAPayment : NSObject
- (instancetype)initWithAgent:(CAAgent *)agent;

- (void)payBegin:(NSString*)amount orderID:(NSString*)orderID payType:(NSString*)payType subjectID:(NSString*)subjectID currencyType:(NSString*)currencyType virtualCurrencyAmount:(NSString*)virtualCurrencyAmount accountID:(NSString*)accountID partner:(NSString*)partner gameServer:(NSString*)gameServer level:(NSString*)level mission:(NSString*)mission;

- (void)paySuccess:(NSString*)amount orderID:(NSString*)orderID payType:(NSString*)payType subjectID:(NSString*)subjectID currencyType:(NSString*)currencyType virtualCurrencyAmount:(NSString*)virtualCurrencyAmount accountID:(NSString*)accountID partner:(NSString*)partner gameServer:(NSString*)gameServer level:(NSString*)level mission:(NSString*)mission;

- (void)payFailed:(NSString*)amount orderID:(NSString*)orderID payType:(NSString*)payType subjectID:(NSString*)subjectID currencyType:(NSString*)currencyType virtualCurrencyAmount:(NSString*)virtualCurrencyAmount accountID:(NSString*)accountID partner:(NSString*)partner gameServer:(NSString*)gameServer level:(NSString*)level mission:(NSString*)mission reason:(NSString*)reason;

- (void)payCanceled:(NSString*)amount orderID:(NSString*)orderID payType:(NSString*)payType subjectID:(NSString*)subjectID currencyType:(NSString*)currencyType virtualCurrencyAmount:(NSString*)virtualCurrencyAmount accountID:(NSString*)accountID partner:(NSString*)partner gameServer:(NSString*)gameServer level:(NSString*)level mission:(NSString*)mission;

+ (void)payBegin:(NSString*)amount orderID:(NSString*)orderID payType:(NSString*)payType subjectID:(NSString*)subjectID currencyType:(NSString*)currencyType virtualCurrencyAmount:(NSString*)virtualCurrencyAmount accountID:(NSString*)accountID partner:(NSString*)partner gameServer:(NSString*)gameServer level:(NSString*)level mission:(NSString*)mission;

+ (void)paySuccess:(NSString*)amount orderID:(NSString*)orderID payType:(NSString*)payType subjectID:(NSString*)subjectID currencyType:(NSString*)currencyType virtualCurrencyAmount:(NSString*)virtualCurrencyAmount accountID:(NSString*)accountID partner:(NSString*)partner gameServer:(NSString*)gameServer level:(NSString*)level mission:(NSString*)mission;

+ (void)payFailed:(NSString*)amount orderID:(NSString*)orderID payType:(NSString*)payType subjectID:(NSString*)subjectID currencyType:(NSString*)currencyType virtualCurrencyAmount:(NSString*)virtualCurrencyAmount accountID:(NSString*)accountID partner:(NSString*)partner gameServer:(NSString*)gameServer level:(NSString*)level mission:(NSString*)mission reason:(NSString*)reason;

+ (void)payCanceled:(NSString*)amount orderID:(NSString*)orderID payType:(NSString*)payType subjectID:(NSString*)subjectID currencyType:(NSString*)currencyType virtualCurrencyAmount:(NSString*)virtualCurrencyAmount accountID:(NSString*)accountID partner:(NSString*)partner gameServer:(NSString*)gameServer level:(NSString*)level mission:(NSString*)mission;
@end
NS_ASSUME_NONNULL_END
