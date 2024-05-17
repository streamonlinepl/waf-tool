//============================================================================

	// const AzureResource 		= require('./../resources/azure-resource');
	const FolderLoader	 		= require('./../../../utils/folder-loader');
	const path 					= require('path');

//============================================================================

	let resources = {}

	const _resourceNames = {
		FRONTDOOR_WAF_POLICY 	: 'FrontDoorWAFPolicy',
		// CosmosDB 			: 'CosmosDB',
		// AppService 			: 'AppService',
		// Maps 				: 'Maps',
	}

//============================================================================
class AzureResourceManager {

	static get Resources() { return _resourceNames }

	constructor(platform, resourceClient) {
		this._platform 			= platform;
		this._resourceClient 	= resourceClient;
		this.loadDefaultTemplates();
	}

	loadDefaultTemplates() {
		let files = {}
		let fl = new FolderLoader( path.join( process.cwd(), 'src/waf/deployer/azure/resources'));
		fl.loadTo( files );
		Object.keys(files).forEach(async (e) => {
			try{
				let r = new files[e](this._platform, this._resourceClient);
				resources[ r.name ] = r;
			}catch(e) {}
		});
	}	
	
	loadResources() {
		const WAF = require('../resources/frontdoor-waf-policy');
		let waf = new WAF(this._platform, this._resourceClient );
		resources[ waf.name ] = waf;
	}

	getResourceNames() 	{ return Object.keys(resources) }
	getResource( name  ) { 
		return resources[name] 
	}
}
//============================================================================

module.exports = AzureResourceManager;