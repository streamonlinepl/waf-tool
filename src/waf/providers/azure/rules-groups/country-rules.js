//========================================================================

const ARulesGroup 	= require('./a-rulesgroup')
const Tools 		= require('./../../../tools')

class CountryRules extends ARulesGroup {
//========================================================================

	constructor(waf) {  super(waf) }
	//------------------------------------------------------------
	
	get id() 				{ return 'country-rules' }			
	get priorityFrom()		{ return 200 }
	get priorityIncr() 		{ return 10 }

	//------------------------------------------------------------
	createRules() {
		return [			
			{
				name: "blockCountries",
				enabledState: "Enabled",
				priority: false,	// weź z grupy
				ruleType: "MatchRule",
				rateLimitDurationInMinutes: 1,
				rateLimitThreshold: 100,
				matchConditions: [
					{
						matchVariable: "SocketAddr",
						operator: "GeoMatch",
						negateCondition: false,
						transforms: [],
	
						_matchValueLimit:10,
						_dataProviders:[
							 'blockedCountries' 
						]	
					}
				],
				action: "Block"
			}
		]
	}
	//------------------------------------------------------------
}
//========================================================================
module.exports = CountryRules;



//========================================================================


//========================================================================

