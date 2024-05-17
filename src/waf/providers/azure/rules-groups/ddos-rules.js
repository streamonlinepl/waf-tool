//========================================================================

const ARulesGroup 	= require('./a-rulesgroup')

//========================================================================
class DdosRules extends ARulesGroup {

	constructor(waf) {  super(waf) }
	//------------------------------------------------------------
	
	get id() 			{ return 'ddos-rules' }
	get priorityFrom() 	{ return 300 }
	get priorityIncr()	{ return 1 }
		
	//------------------------------------------------------------
	createRules() {
		return [		
			{
				name: "BlockHostings",
				enabledState: "Enabled",
				priority: false,
				ruleType: "MatchRule",
				rateLimitDurationInMinutes: 1,
				rateLimitThreshold: 100,
				matchConditions: [
					{
						matchVariable: "SocketAddr",
						operator: "IPMatch",
						negateCondition: false,
						transforms: [],

						_dataProviders:[
							 'blockedNetsMerged'
						]						
					}
				],
				action: "Block"
			},
			{
				name: "BlockDirect",
				enabledState: "Enabled",
				action: "Block",
				ruleType: "MatchRule",
				rateLimitDurationInMinutes: 1,
				rateLimitThreshold: 100,
				matchConditions: [
					{
						matchVariable: "SocketAddr",
						operator: "IPMatch",
						negateCondition: false,
						transforms: [],

						_dataProviders:[
							'blockedDirectEntries'
						]	
					}
				],
			}
		]
	}
	//------------------------------------------------------------
	
}
//========================================================================
module.exports = DdosRules;

