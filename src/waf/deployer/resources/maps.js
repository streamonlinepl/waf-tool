//==================================================================================

	const AzureResource 	= require('./azure-resource');

//==================================================================================
class AzureMaps extends AzureResource {
	constructor(platform, resourceClient) {
		super(platform, resourceClient);
	}

	
}
//==================================================================================
module.exports = AzureMaps;