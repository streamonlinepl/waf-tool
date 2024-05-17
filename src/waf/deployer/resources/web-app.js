//==================================================================================

	const AzureResource 	= require('./azure-resource');

//==================================================================================
class WebApp extends AzureResource {
	constructor(platform, resourceClient) {
		super(platform, resourceClient);
	}

	
}
//==================================================================================
module.exports = WebApp;