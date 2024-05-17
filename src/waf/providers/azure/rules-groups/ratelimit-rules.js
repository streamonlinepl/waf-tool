//========================================================================

	const ARulesGroup 	= require('./a-rulesgroup')

class RatelimitRules extends ARulesGroup {
//========================================================================

	constructor(waf) {  super(waf) }
	//------------------------------------------------------------
	
	get id() 				{ return 'ratelimit-rules' }
	get priorityFrom()		{ return 500 }
	get priorityIncr() 		{ return 10 }

	//------------------------------------------------------------
		
	createRules() {
		return [		
			{
				name: "rate60Logins",
				enabledState: "Enabled",
				ruleType: "RateLimitRule",
				rateLimitDurationInMinutes: 1,
				rateLimitThreshold: 60,
				action: "Block",
				matchConditions: [
					{
						matchVariable: "RequestUri",
						operator: "Contains",
						negateCondition: false,
						transforms: [ "Lowercase" ],

						_values: [
							"users/login",
							"users/logout",
							"users/me",
							"useraccess/get",
							"useraccess/download"
						],
					}
				],
			},
			{
				name: "rate60Buys",
				enabledState: "Enabled",
				ruleType: "RateLimitRule",
				rateLimitDurationInMinutes: 1,
				rateLimitThreshold: 60,
				action: "Block",
				matchConditions: [
					{
						matchVariable: "RequestUri",
						operator: "Contains",
						negateCondition: false,
						transforms: [ "Lowercase" ],

						_values: [
							"product/buy",
							"users/bme",
							"product/buysms",
							"payments/codeverify",
							"payments/checkout",
						],
					}
				],
			},
			{
				name: "rate20RegisterRcvrRedeem",
				enabledState: "Enabled",
				ruleType: "RateLimitRule",
				rateLimitDurationInMinutes: 1,
				rateLimitThreshold: 20,
				matchConditions: [
					{
						matchVariable: "RequestUri",
						operator: "Contains",
						negateCondition: false,
						transforms: [ "Lowercase" ],
						
						_values: [
							"users/activate",
							"users/register",		
							"users/update",
							"users/recoverpswd",
							"users/recoverpswdchange",
							"product/coderedeem",
							"product/codeverifyvoucher",
							"ticket/create",
							"ticket/list"
						],
						
					}
				],
				action: "Block"
			},
			{
				name: "rate50Watch",
				enabledState: "Enabled",
				ruleType: "RateLimitRule",
				rateLimitDurationInMinutes: 1,
				rateLimitThreshold: 50,
				matchConditions: [
					{
						matchVariable: "RequestUri",
						operator: "Contains",
						negateCondition: false,
						transforms: [ "Lowercase" ],

						_values: [
							"product/watch"
						],
					}
				],
				action: "Block"
			},
			{
				name: "rate60GetLicense",
				enabledState: "Enabled",
				ruleType: "RateLimitRule",
				rateLimitDurationInMinutes: 1,
				rateLimitThreshold: 60,
				matchConditions: [
					{
						matchVariable: "RequestUri",
						operator: "Contains",
						negateCondition: false,
						transforms: [ "Lowercase" ],

						_values: [
							"players/getlicense"
						],
					}
				],
				action: "Block"
			},
			{
				name: "rate50ExternalAuth",
				enabledState: "Enabled",
				ruleType: "RateLimitRule",
				rateLimitDurationInMinutes: 1,
				rateLimitThreshold: 50,
				matchConditions: [
					{
						matchVariable: "RequestUri",
						operator: "Contains",
						negateCondition: false,
						transforms: [ "Lowercase" ],

						_values: [
							"externalauth/auth"
						],
					}
				],
				action: "Block"
			},
			{
				name: "globalLimiter",
				enabledState: "Enabled",
				ruleType: "RateLimitRule",
				rateLimitDurationInMinutes: 1,
				rateLimitThreshold: 100,
				action: "Block",
				matchConditions: [
					{
						matchVariable: "RequestHeader",
						selector: "Host",
						operator: "GreaterThanOrEqual",
						negateCondition: false,
						_values: [
							"0"
						],
						transforms: []
					}
				],
			}
		]
	}
	
	
}
//========================================================================
module.exports = RatelimitRules;