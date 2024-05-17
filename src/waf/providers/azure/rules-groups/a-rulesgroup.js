//========================================================================

	const Tools 		= require('./../../../tools')

class ARulesGroup {
//========================================================================
	
	#_waf;
	constructor(waf) { 
		if (this.constructor.name == 'ARulesGroup')
			throw new Error(`> ERROR > ARulesGroup is an abstract class, use inheritance to create its instance`)
		this.#_waf = waf 
	}
	//------------------------------------------------------------
	
	get id() 			{ throw new Error(`Member "id" not implemented in ${this.constructor.name}`) }
	get priorityFrom() 	{ throw new Error(`Member "priorityFrom" not implemented in ${this.constructor.name}`) }
	get priorityIncr() 	{ throw new Error(`Member "priorityIncr" not implemented in ${this.constructor.name}`) }
	
	createRules() 		{ throw new Error(`Member "createRules" not implemented in ${this.constructor.name}`) }
	
	//------------------------------------------------------------
	
	waf() { return this.#_waf };	

	build() {  
		const DP = this.waf().DataProviders;
		let rules = this.createRules();
		// console.log('> BUILDING RuleGroup:',this.id)

		for(let r of rules) {
			
			for(let c of r.matchConditions) {
				
				c._matchValueLimit = this.matchValueLimitFor( c.operator )
				c._values = c._values ||[];
				if (!c._dataProviders || !c._dataProviders.length) {
					c._dataProviders = [];					
				} else {
					c._dataProviders = c._dataProviders.map( id => DP.getProvider( id ));
				}

				
				if (! c._dataProviders.length) continue;
				c._values = c._dataProviders.reduce( (acc, dp) => {					
					let dpValue = dp.fetch();
					acc = acc.concat( dpValue );
					return acc;
				},[] );								
				
				c._values = Tools.removeDuplicates( c._values );
			}			
		}

		return { 
			id:this.id, 
			priority:this.priorityFrom, 
			rules, 
			rulesGroup:this
		}
	}
	//------------------------------------------------------------
	matchValueLimitFor( matchOperator ) {
		switch(matchOperator) {
			case 'IPMatch': return 600;
			case 'GeoMatch': return 10;
			case 'Any': return 0;
			case 'Equal': case 'Contains': case 'BeginsWith': case 'EndsWith': return 10;  
			case 'LessThan': case 'LessThanOrEqual': case 'GreaterThan': 
				case 'GreaterThanOrEqual':case 'RegEx': return 1;
		}
		return 10;
	}
	
	
}
//========================================================================
module.exports = ARulesGroup;