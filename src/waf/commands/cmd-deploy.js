//========================================================================

    const ACmd      = require('./a-cmd');
	const Tools 	= require('./../tools');


//========================================================================

    // const Deployer  = require('./../deployer')

//========================================================================
class CmdDeploy extends ACmd {

    constructor(wafApp) { super(wafApp )};
    get id()    { return "deploy" }
    //------------------------------------------------------------    
    async execute() {
        let providerId = this.getArgvParams()[0];		
        
        let provider = this.waf().Providers.getProvider(providerId);
        if (!provider) {
            console.log(`> ERROR > Provider "${providerId}" not found!`);
            console.log(`> List of available providers:`,this.waf().Providers.getIds());
            return process.exit(0);
        }        

        const Deployer  = this.waf().Deployer;
        await Deployer.authorize();
     
        try {
            var WAF = Deployer.azureResourceManager.getResource('FrontDoorWAFPolicy' );
            await WAF.deployTemplate();

            this.waf().getDb('deployments').deploymentCreate( providerId );

            return;
        }catch(e){
            console.log(e);
        }		    
        
        // console.log(`> It is possible, there's no template built for the platform...`);
        // console.log(`  Try to invoke "build" command first.`)            
		// console.log(`> Template built  .... is out dated comparing to the latest database version`)
		
		return {  };		
    }
    //------------------------------------------------------------
}
//========================================================================
module.exports = CmdDeploy;