//========================================================================

    const ABlueprint = require('./a-blueprint');

class Blueprint extends ABlueprint{
//========================================================================
	
	constructor(waf) {  super(waf) }
	//------------------------------------------------------------

	get id() 			{ return 'simple' }
	get rulesGroups() 	{ return [
									'white-rules', 
									'country-rules', 
									'ddos-rules', 
									'ratelimit-rules'
								] }    
    

	

	//------------------------------------------------------------
	createBaseTemplate() {
		return {
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
				},
				"platformApiHost": {
					"defaultValue": "api.platform.tv",
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
							rules:[]
					
						},
						"managedRules": {
							"managedRuleSets": [
								{
									"ruleSetType": "DefaultRuleSet",
									"ruleSetVersion": "preview-0.1",
									"ruleGroupOverrides": [
										{
											"ruleGroupName": "SQLI",
											"rules": [
												{
													"ruleId": "942432",
													"enabledState": "Enabled",
													"action": "Block",
													"exclusions": [
														{
															"matchVariable": "QueryStringArgNames",
															"selectorMatchOperator": "Equals",
															"selector": "_sessid"
														},
														{
															"matchVariable": "QueryStringArgNames",
															"selectorMatchOperator": "Equals",
															"selector": "lap"
														}
													]
												},
												{
													"ruleId": "942431",
													"enabledState": "Enabled",
													"action": "Block",
													"exclusions": [
														{
															"matchVariable": "QueryStringArgNames",
															"selectorMatchOperator": "Equals",
															"selector": "_sessid"
														},
														{
															"matchVariable": "QueryStringArgNames",
															"selectorMatchOperator": "Equals",
															"selector": "lap"
														}
													]
												},
												{
													"ruleId": "942430",
													"enabledState": "Enabled",
													"action": "Block",
													"exclusions": [
														{
															"matchVariable": "QueryStringArgNames",
															"selectorMatchOperator": "Equals",
															"selector": "_sessid"
														},
														{
															"matchVariable": "QueryStringArgNames",
															"selectorMatchOperator": "Equals",
															"selector": "lap"
														}
													]
												},
												{
													"ruleId": "942450",
													"enabledState": "Enabled",
													"action": "Block",
													"exclusions": [
														{
															"matchVariable": "QueryStringArgNames",
															"selectorMatchOperator": "Equals",
															"selector": "_sessid"
														},
														{
															"matchVariable": "QueryStringArgNames",
															"selectorMatchOperator": "Equals",
															"selector": "lap"
														}
													]
												}
											],
											"exclusions": []
										}
									],
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
	//------------------------------------------------------------
	//------------------------------------------------------------
	createBaseTemplateWBots20() {
		return {
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
				},
				"platformApiHost": {
					"defaultValue": "api.platform.tv",
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
							rules:[]
					
						},
						"managedRules": {
							"managedRuleSets": [
								{
									"ruleSetType": "Microsoft_DefaultRuleSet",
									"ruleSetVersion": "2.1",
									"ruleSetAction": "Block",
									"ruleGroupOverrides": [],
									"exclusions": []
								},
								{
									"ruleSetType": "Microsoft_BotManagerRuleSet",
									"ruleSetVersion": "1.0",
									"ruleGroupOverrides": [
										{
											"ruleGroupName": "UnknownBots",
											"rules": [
												{
													"ruleId": "Bot300700",
													"enabledState": "Enabled",
													"action": "Block",
													"exclusions": []
												},
												{
													"ruleId": "Bot300600",
													"enabledState": "Enabled",
													"action": "Block",
													"exclusions": []
												},
												{
													"ruleId": "Bot300500",
													"enabledState": "Enabled",
													"action": "Block",
													"exclusions": []
												},
												{
													"ruleId": "Bot300200",
													"enabledState": "Enabled",
													"action": "Block",
													"exclusions": []
												},
												{
													"ruleId": "Bot300100",
													"enabledState": "Enabled",
													"action": "Block",
													"exclusions": []
												},
												{
													"ruleId": "Bot300300",
													"enabledState": "Enabled",
													"action": "Block",
													"exclusions": []
												},
												{
													"ruleId": "Bot300400",
													"enabledState": "Enabled",
													"action": "Block",
													"exclusions": []
												}
											],
											"exclusions": []
										},
										{
											"ruleGroupName": "GoodBots",
											"rules": [
												{
													"ruleId": "Bot200200",
													"enabledState": "Enabled",
													"action": "Block",
													"exclusions": []
												},
												{
													"ruleId": "Bot200100",
													"enabledState": "Enabled",
													"action": "Block",
													"exclusions": []
												}
											],
											"exclusions": []
										}
									],
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
module.exports = Blueprint;
