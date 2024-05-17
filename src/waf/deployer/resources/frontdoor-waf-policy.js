//==================================================================================

	const AzureResource 	= require('./azure-resource');

//==================================================================================
class FrontDoorWAFPolicy extends AzureResource {
	constructor(platform, resourceClient) {
		super(platform, resourceClient);
	}


	async createRuleFromJSON( jsonFileName ) { 
		try {
            var asnFilePath = path.join(process.cwd(), jsonFileName);
            var asn = JSON.parse(fs.readFileSync(asnFilePath, 'utf8'));
        } catch (ex) {
            console.log(ex);
            throw ex;
        }

        delete asn['asnDomain'];
        delete asn['ipList'];
        delete asn['cfFormat'];    

        let ruleOpts = { ips:asn.ipListMerged, priority }
        ruleOpts = Object.assign(ruleOpts, asn);

        return this.createMatchRuleTemplate( ruleOpts );
	}
	// ruleObject
	//-------------------------------------------------------------------
	/*
        priority : X,
        asnType: "hosting",
        asnCountry: "DE",
        asnName: "Contabo GmbH",
        asn: "AS51167",
        ips : Array
    */
	async addRule( ruleOpts ) {
		const splitArray = (inputArray, perChunk=600) => {
			return inputArray.reduce((resultArray, item, index) => { 
				const chunkIndex = Math.floor(index/perChunk)
				if(!resultArray[chunkIndex]) resultArray[chunkIndex] = [] //new chunk            
				resultArray[chunkIndex].push(item)
				return resultArray
			}, [])
		}

        let template 	= this.template;
        let rules 		= template.resources[0].properties.customRules.rules;

        let name = `${ruleOpts.asnType}${ruleOpts.asn}${ruleOpts.asnName.replace(/[^0-9a-z]/gi, '')}${ruleOpts.asnCountry}`
        let rule = false;
        if (!ruleOpts.name) ruleOpts.name = name;
        if (!ruleOpts.priority) {
            let matchRules = rules.filter( e => e.ruleType == "MatchRule" );
            matchRules = matchRules.sort( (a,b) => {
                return a.priority>b.priority ? -1:1;
            } )
            ruleOpts.priority = matchRules[0].priority+1;
        }

        let ipChunks = splitArray( ruleOpts.ips, ruleOpts.perChunk||600 );            
        if (ipChunks.length>1) {
            for (let index=1; index <= ipChunks.length; index++) {

                ruleOpts.priority += (index - 1);
                rule = this.createMatchRuleTemplate( {
                    name : `${name}part${index}`,
                    priority : ruleOpts.priority + index - 1,
                    ips : ipChunks[index-1]
                } )
                await this.addRuleTemplate( rule );
            }
        } else {
            rule = this.createMatchRuleTemplate( ruleOpts )
            await this.addRuleTemplate( rule );
        }

		await this.saveTemplate();
	}
	//-------------------------------------------------------------------
	/**
	 * Adds TemplateRule to current template
	 * @param {TemplateRule} ruleTpl A rule template, JSON object, complaint with FrontDoorWAFPolicy match-rule
	 * @returns 
	 */
	async addRuleTemplate( ruleTpl ) {
		let rules =  this.template.resources[0].properties.customRules.rules;
        if (rules.find( e => e.priority == ruleTpl.priority )) throw new Error(`Priority: ${ruleTpl.priority} already in use! (${ruleTpl.name})`)
        if (rules.find( e => e.name == ruleTpl.name )) {
            console.log(`> Rule name: ${ruleTpl.name} already exists - skipping...`)
            return;
        }
        rules.push( ruleTpl );		
		console.log(`> Rule name: ${ruleTpl.name} added to template...`)
	}
	//-------------------------------------------------------------------
	countIpEntries() {
		let rules =  this.template.resources[0].properties.customRules.rules
		let count = 0;
		for (let r of rules) {
			count += r.matchConditions[0].matchValue.length
		}
		console.log('> countIpEntries:', count)
		return count
	}
	//------------------------------------------------------------------------------
	createMatchRuleTemplate( opts ) {
		if (!(opts.name 
            && opts.priority
            && opts.ips))
            throw new Error('ruleOpts object incomplete!')
        return  {
            "name": opts.name,
            "enabledState": opts.enabled===false ? "Disabled" : "Enabled",
            "priority": opts.priority,
            "ruleType": "MatchRule",
            "rateLimitDurationInMinutes": 1,
            "rateLimitThreshold": 100,
            "matchConditions": [
                {
                    "matchVariable": "RemoteAddr",
                    "operator": opts.matchOperator || "IPMatch",
                    "negateCondition": false,
                    "matchValue": opts.ips,
                    "transforms": []
                }
            ],
            "action": "Block"
        }
	}
}
//==================================================================================
module.exports = FrontDoorWAFPolicy;