//========================================================================


    const FolderLoader      = require('./../../../utils/folder-loader');
    const Common            = require('./../../../utils/common');
    const Tools  		    = require('./../../tools');
	const Blueprint 	    = require('./blueprints/blueprint')
	
	let _rulesGroups = false


    // const WhiteRules        = require('rule-groups/white-rules');
    // const CountryRules      = require('rule-groups/country-rules');
    // const DDOSRules         = require('rule-groups/ddos-rules');
    // const RatelimitRules    = require('rule-groups/ratelimit-rules');


//========================================================================
class WAFBuilder {
    #_provider;
	#_waf;
    #_blueprint;    
    //--------------------
    // constructors
	constructor(provider) {
		this.#_provider 	= provider;
		this.#_waf 	    	= provider.waf();
        this.#_blueprint	= new Blueprint( this.waf() )

		this.loadRulesGroups();
	}
    //--------------------
	
	get blueprint() { return this.#_blueprint; }
	
    //--------------------
	loadRulesGroups() {
        if (_rulesGroups) return;
        _rulesGroups = {}
        let fl = new FolderLoader(`${process.cwd()}/src/waf/providers/azure/rules-groups`);
        fl.stripExt().exclude('a-rulesgroup.js').loadTo( _rulesGroups );
        
        for (let rg of Object.keys(_rulesGroups)) {
            let Class               = _rulesGroups[rg];
            let rgObj              = new Class(this.waf());
            delete _rulesGroups[rg];
            _rulesGroups[rgObj.id]    = rgObj;
            console.log(`> WAFBuilder[Azure] > RulesGroup "${rgObj.id}" loaded!`)
        }
    }
    waf() 	{ return this.#_waf; }
	
    //========================================================================
	// getRulesGroupsIds() 	{ return Object.keys(_rulesGroups)}   
    //--------------------    
    buildTemplate( filename='wafTemplate.json') {
        // zawiera rules groups, ustawienia generowania templatki, jej wersję bazową,
        
        let template 	= this.blueprint.createBaseTemplate();		
		let rulesGroups = this.blueprint.rulesGroups.map( id => this.getRulesGroup(id).build() );        
        let rules  		= this.populateRules( rulesGroups );

       	template.resources[0].properties.customRules = { rules };
        let location = this.saveTemplate(template, filename);
        return { template, filename, location }
    }
	//--------------------
    populateRules( rulesGroups ) {        
		let rules = [];
		let priority = 0;
        for (let rg of rulesGroups) {			            
            for( let rule of rg.rules) {	
                priority = priority<rg.priority?rg.priority:priority+ this.getRulesGroup(rg.id).priorityIncr;
				let c = rule.matchConditions[0];
				let chunks = Tools.splitArray(c._values, c._matchValueLimit);
				delete c['_values'];
				delete c['_dataProviders'];
				delete c['_matchValueLimit'];
				for (let i=0;i<chunks.length; i++) {
					let mc = Object.assign({},c,{matchValue:chunks[i]});
					let rp = Object.assign({},rule,{priority:(priority+i), name:rule.name+(i>0?i+1:'')});
					rp.matchConditions=[mc];
					rules.push(rp);
				}
			}			
        }
        return rules;
    }
    //------------------------------------------------------------
    saveTemplate( template, filename='wafTemplate.json' ) {
        if (!template) return;        
        let fullpath = `${process.cwd()}/src/waf/data/${this.waf().platformId}/templates/${filename}`;
        Common.writeFileSync(template, fullpath);
        return fullpath;
    }
    
    //--------------------

    getRulesGroup(id)      	{ return _rulesGroups[id] }
    
    //------------------------------------------------------------
}
//========================================================================
module.exports = WAFBuilder