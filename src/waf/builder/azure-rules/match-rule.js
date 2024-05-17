//========================================================================

	const AAzureRule 	= require("./a-azure-rule");

//========================================================================
class MatchRuleIPMatch extends AAzureRule  {

	constructor(waf) {
		super(waf);		
	}
	waf() { return this._waf }
	
	get ruleType() 			{ return this.RuleType.MATCH_RULE }
	get matchVariable() 	{ return this.MatchVariable.REMOTE_ADDRESS }
	get matchOperator() 	{ return this.MatchOperator.IP_MATCH }
	get matchTransforms() 	{ return [] }
	get maxSize() 			{ return this.RuleMaxSize.MATCH_RULE }

	template( ruleOpts, iteration) {
		return {
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
		}
	}	

	createRule( ruleOpts ) {
		ruleOpts = {
			action:this.RuleAction.ALLOW,
			priority:100
		}

	}



}
//========================================================================
module.exports = MatchRuleIPMatch; 