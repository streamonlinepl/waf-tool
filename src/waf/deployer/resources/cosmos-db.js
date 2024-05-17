//==================================================================================

	const AzureResource 	= require('./azure-resource');

//==================================================================================
class DocumentDB extends AzureResource {
	constructor(platform, resourceClient) {
		super(platform, resourceClient);
	}

	
}
//==================================================================================
module.exports = DocumentDB;