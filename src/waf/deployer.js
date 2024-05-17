//--------------------------------------------------

	const Tools     	= require('./tools');

	const AzureAppAuthorization 	= require('./deployer/azure/azure-authorization')
	const AzureResourceManager 		= require('./deployer/azure/azure-resource-manager')

//--------------------------------------------------

	// const MatchRuleCreator 	= require('./rules/match-rule-creator');

class Deployer  {
//========================================================================
	#_waf;
	#_resourceClient;
	#_azureResourceManager;
	constructor(waf) {        		
		this.#_waf = waf;
	}
	//------------------------------------------------------------
	waf() { return this.#_waf }
	
	get resourceClient() 		{ return this.#_resourceClient }
	get azureResourceManager() 	{ return this.#_azureResourceManager }

	//------------------------------------------------------------

	async authorize() {
		console.log('> Azure > authorization...');
		const AppAuthorization 		= new AzureAppAuthorization();        		
		this.#_resourceClient		= await AppAuthorization.getResourceManagementClient( this.waf().platform.subscriptionId );
		this.#_azureResourceManager = new AzureResourceManager( this.waf().platform, this.resourceClient );
		this.#_azureResourceManager.loadResources();
		console.log('> Azure > logged in!');
	}

}
//========================================================================
module.exports = Deployer;