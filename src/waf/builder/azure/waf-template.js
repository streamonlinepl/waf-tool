//========================================================================

	const AAzureRule 	= require("./a-azure-rule");

//========================================================================
class WAFTemplate   {

	constructor(waf) {
		super(waf);		
	}
	//------------------------------------------------------------
	waf() { return this._waf }
	//------------------------------------------------------------


	// getDataProvider( providerId ) { }

	getDataProviders() {
		return {
			countryRules:CountryDataProvider,
			hostingRules:HostingDataProvider,
			// countryRules:CountryDataProvider,

		}
	}

	async resolve( template ) {
		for (let ph of template.placeholders) {
			const DataProvider = this.getDataProvider( template.dataProviders[ ph ] );
						
		}
	}

	getTemplate() {
		return {
			dataProviders: this.getDataProviders(),
			placeholders: this.baseTemplatePlaceholders(),
			base: this.baseTemplateObject()
		}
	}	



	
	baseTemplatePlaceholders() {
		return [
			countryRules,
			hostingRules,
		]
	}

	baseTemplateObject() {
		return
		{
			"$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
			"contentVersion": "1.0.0.0",
			"parameters": {
				"wafName": {
					"defaultValue": "defaultWafName",
					"type": "String"
				},
				"wafSKU": {
					"defaultValue": "Premium_AzureFrontDoor",
					"type": "String"
				}
			},
			"variables": {},
			"resources": [
				{
					"type": "Microsoft.Network/frontdoorwebapplicationfirewallpolicies",
					"apiVersion": "2020-11-01",
					"name": "[parameters('wafName')]",
					"location": "Global",
					"sku": {
						"name": "[parameters('wafSKU')]"
					},
					"properties": {
						"policySettings": {
							"enabledState": "Enabled",
							"mode": "Prevention",
							"customBlockResponseStatusCode": 429,
							"requestBodyCheck": "Disabled"
						},
						"customRules": {
							"rules": [
								{
									"name": "blockCountries1",
									"enabledState": "Enabled",
									"priority": 30,
									"ruleType": "MatchRule",
									"rateLimitDurationInMinutes": 1,
									"rateLimitThreshold": 100,
									"matchConditions": [
										{
											"matchVariable": "RemoteAddr",
											"operator": "GeoMatch",
											"negateCondition": false,
											"matchValue": [
												"AF",
												"AZ",
												"CL",
												"CN",
												"CR",
												"CU",
												"KE",
												"KH"
											],
											"transforms": []
										}
									],
									"action": "Block"
								},
								{
									"name": "allowPayUServers",
									"enabledState": "Enabled",
									"priority": 20,
									"ruleType": "MatchRule",
									"rateLimitDurationInMinutes": 1,
									"rateLimitThreshold": 100,
									"matchConditions": [
										{
											"matchVariable": "RemoteAddr",
											"operator": "IPMatch",
											"negateCondition": false,
											"matchValue": [
												"185.68.12.10",
												"185.68.12.11",
												"185.68.12.12",
												"185.68.12.26",
												"185.68.12.27",
												"185.68.12.28",
												"185.68.14.10",
												"185.68.14.11",
												"185.68.14.12",
												"185.68.14.26",
												"185.68.14.27",
												"185.68.14.28"
											],
											"transforms": []
										}
									],
									"action": "Allow"
								},
								{
									"name": "blockCountries2",
									"enabledState": "Enabled",
									"priority": 31,
									"ruleType": "MatchRule",
									"rateLimitDurationInMinutes": 1,
									"rateLimitThreshold": 100,
									"matchConditions": [
										{
											"matchVariable": "RemoteAddr",
											"operator": "GeoMatch",
											"negateCondition": false,
											"matchValue": [
												"IL",
												"IQ",
												"IR",
												"KP",
												"KR",
												"LY",
												"NP",
												"PA",
												"PH",
												"PK"
											],
											"transforms": []
										}
									],
									"action": "Block"
								},
								{
									"name": "blockCountries3",
									"enabledState": "Enabled",
									"priority": 32,
									"ruleType": "MatchRule",
									"rateLimitDurationInMinutes": 1,
									"rateLimitThreshold": 100,
									"matchConditions": [
										{
											"matchVariable": "RemoteAddr",
											"operator": "GeoMatch",
											"negateCondition": false,
											"matchValue": [
												"IN",
												"BD",
												"SD",
												"SN",
												"SO",
												"TW",
												"TZ",
												"UZ",
												"VN"
											],
											"transforms": []
										}
									],
									"action": "Block"
								},
								{
									"name": "AllowHotPayServers",
									"enabledState": "Enabled",
									"priority": 21,
									"ruleType": "MatchRule",
									"rateLimitDurationInMinutes": 1,
									"rateLimitThreshold": 100,
									"matchConditions": [
										{
											"matchVariable": "RemoteAddr",
											"operator": "IPMatch",
											"negateCondition": false,
											"matchValue": [
												"35.159.7.168"
											],
											"transforms": []
										}
									],
									"action": "Allow"
								},
								{
									"name": "rateLimit60Per1Min",
									"enabledState": "Enabled",
									"priority": 200,
									"ruleType": "RateLimitRule",
									"rateLimitDurationInMinutes": 1,
									"rateLimitThreshold": 70,
									"matchConditions": [
										{
											"matchVariable": "RequestUri",
											"operator": "Contains",
											"negateCondition": false,
											"matchValue": [
												"externalauth/auth",
												"product/buy",
												"users/activate",
												"users/login",
												"users/logout",
												"users/me",
												"users/register",
												"users\\login",
												"users\\me",
												"users\\register"
											],
											"transforms": [
												"Lowercase"
											]
										}
									],
									"action": "Block"
								},
								{
									"name": "rateLimit5Per1Min",
									"enabledState": "Enabled",
									"priority": 201,
									"ruleType": "RateLimitRule",
									"rateLimitDurationInMinutes": 1,
									"rateLimitThreshold": 5,
									"matchConditions": [
										{
											"matchVariable": "RequestUri",
											"operator": "Contains",
											"negateCondition": false,
											"matchValue": [
												"product/codeRedeem",
												"product/codeVerifyVoucher",
												"ticket/create",
												"ticket\\create",
												"users/recoverpswd",
												"users/recoverpswdchange",
												"users/update",
												"users\\recoverpswd",
												"users\\recoverpswdchange",
												"users\\update"
											],
											"transforms": [
												"Lowercase"
											]
										}
									],
									"action": "Block"
								},
								{
									"name": "rateLimit50Per1Min",
									"enabledState": "Enabled",
									"priority": 202,
									"ruleType": "RateLimitRule",
									"rateLimitDurationInMinutes": 1,
									"rateLimitThreshold": 50,
									"matchConditions": [
										{
											"matchVariable": "RequestUri",
											"operator": "Contains",
											"negateCondition": false,
											"matchValue": [
												"product/watch",
												"product\\watch"
											],
											"transforms": [
												"Lowercase"
											]
										}
									],
									"action": "Block"
								},
								{
									"name": "rateLimit10Per1Min",
									"enabledState": "Enabled",
									"priority": 203,
									"ruleType": "RateLimitRule",
									"rateLimitDurationInMinutes": 1,
									"rateLimitThreshold": 10,
									"matchConditions": [
										{
											"matchVariable": "RequestUri",
											"operator": "Contains",
											"negateCondition": false,
											"matchValue": [
												"product/buysms",
												"product\\buysms",
												"ticket/list",
												"ticket\\list"
											],
											"transforms": [
												"Lowercase"
											]
										}
									],
									"action": "Block"
								},
								{
									"name": "allowStripeIPs",
									"enabledState": "Enabled",
									"priority": 22,
									"ruleType": "MatchRule",
									"rateLimitDurationInMinutes": 1,
									"rateLimitThreshold": 100,
									"matchConditions": [
										{
											"matchVariable": "RemoteAddr",
											"operator": "IPMatch",
											"negateCondition": false,
											"matchValue": [
												"212.180.228.135",
												"54.187.174.169",
												"54.187.205.235",
												"54.187.216.72",
												"54.241.31.102",
												"54.241.31.99",
												"54.241.34.107"
											],
											"transforms": []
										}
									],
									"action": "Allow"
								},
								{
									"name": "rateLimit3Per1Min",
									"enabledState": "Enabled",
									"priority": 204,
									"ruleType": "RateLimitRule",
									"rateLimitDurationInMinutes": 1,
									"rateLimitThreshold": 3,
									"matchConditions": [
										{
											"matchVariable": "RequestUri",
											"operator": "Contains",
											"negateCondition": false,
											"matchValue": [
												"product\\codeRedeem",
												"product\\codeVerifyVoucher",
												"users/bme",
												"users\\bme"
											],
											"transforms": [
												"Lowercase"
											]
										}
									],
									"action": "Block"
								},
								{
									"name": "allowKangaPath",
									"enabledState": "Enabled",
									"priority": 24,
									"ruleType": "MatchRule",
									"rateLimitDurationInMinutes": 1,
									"rateLimitThreshold": 100,
									"matchConditions": [
										{
											"matchVariable": "RequestUri",
											"operator": "Contains",
											"negateCondition": false,
											"matchValue": [
												"transactions/KangaPay/notify",
												"transactions/kangapay/notify",
												"transactions\\KangaPay\\notify",
												"transactions\\kangapay\\notify"
											],
											"transforms": [
												"Lowercase"
											]
										}
									],
									"action": "Allow"
								},								
								{
									"name": "allowPayPalIPs",
									"enabledState": "Enabled",
									"priority": 23,
									"ruleType": "MatchRule",
									"rateLimitDurationInMinutes": 1,
									"rateLimitThreshold": 100,
									"matchConditions": [
										{
											"matchVariable": "RemoteAddr",
											"operator": "IPMatch",
											"negateCondition": false,
											"matchValue": [
												"151.101.1.21/32",
												"151.101.1.35/32",
												"151.101.129.21/32",
												"151.101.129.35/32",
												"151.101.130.133/32",
												"151.101.193.21/32",
												"151.101.193.35/32",
												"151.101.194.133/32",
												"151.101.2.133/32",
												"151.101.65.21/32",
												"151.101.65.35/32",
												"151.101.66.133/32",
												"159.242.240.0/21",
												"173.0.80.0/20",
												"184.105.254.0/24",
												"185.177.52.0/22",
												"198.199.247.0/24",
												"198.54.216.0/23",
												"204.109.13.0/24",
												"205.189.102.0/24",
												"205.189.103.0/24",
												"208.76.140.0/22",
												"64.4.240.0/21",
												"64.4.248.0/22",
												"66.211.168.0/22",
												"91.243.72.0/23"
											],
											"transforms": []
										}
									],
									"action": "Allow"
								},
								{
									"name": "blockCountries4",
									"enabledState": "Enabled",
									"priority": 33,
									"ruleType": "MatchRule",
									"rateLimitDurationInMinutes": 1,
									"rateLimitThreshold": 100,
									"matchConditions": [
										{
											"matchVariable": "RemoteAddr",
											"operator": "GeoMatch",
											"negateCondition": false,
											"matchValue": [
												"BD",
												"BR",
												"CO",
												"ID",
												"PK"
											],
											"transforms": []
										}
									],
									"action": "Block"
								},
								{
									"name": "blockRoot",
									"enabledState": "Enabled",
									"priority": 125,
									"ruleType": "MatchRule",
									"rateLimitDurationInMinutes": 1,
									"rateLimitThreshold": 100,
									"matchConditions": [
										{
											"matchVariable": "RequestUri",
											"operator": "Equal",
											"negateCondition": false,
											"matchValue": [
												"/",
												"api.highlive.tv",
												"https://api.highlive.tv",
												"https://api.highlive.tv/"
											],
											"transforms": []
										}
									],
									"action": "Block"
								},
																
								
								
							]
						},
						"managedRules": {
							"managedRuleSets": [
								{
									"ruleSetType": "DefaultRuleSet",
									"ruleSetVersion": "preview-0.1",
									"ruleGroupOverrides": [],
									"exclusions": []
								},
								{
									"ruleSetType": "BotProtection",
									"ruleSetVersion": "preview-0.1",
									"ruleGroupOverrides": [],
									"exclusions": []
								}
							]
						}
					}
				}
			]
		}
	}

}
//========================================================================
module.exports = WAFTemplate; 