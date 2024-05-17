//========================================================================

    const ACmd      = require('./a-cmd');
	const Tools 	= require('./../tools');


//========================================================================


//========================================================================
class CmdBuild extends ACmd {

    constructor(wafApp) { super(wafApp )};
    get id()    { return "build" }
    //------------------------------------------------------------    
    async execute() {
        let providerId = this.getArgvParams()[0];				
        
        let provider = this.waf().Providers.getProvider(providerId);
        if (!provider) {
            console.log(`> ERROR > Provider "${providerId}" not found!`);
            console.log(`> List of available providers:`,this.waf().Providers.getIds());
            return process.exit(0);
        }

        console.log('\tBuilding WAF Template for: %s ',  this.waf().platformId);
        console.log('\t    WAF Template Provider: %s ',  providerId);
        

        let builder     = provider.getWAFBuilder();
        let { template, filename, location }    = builder.buildTemplate();

		console.log('> Done!')
		console.log(`> Template was saved to "${filename}"`)
		var taken;
        let stats = {
            templateFile:filename,
            location,
            rulesCount:(taken=(template.resources[0].properties.customRules.rules).length),
            rulesLeft:100-taken
        }

		return { stats };		
    }
    //------------------------------------------------------------
}
//========================================================================
module.exports = CmdBuild;