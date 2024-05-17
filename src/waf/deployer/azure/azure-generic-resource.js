

class AzureGenericResource {

	constructor(resourceOpts=false) {				
	}

	get resourceId() 			{ return 'AppService' }
	get resourceType() 			{ return "Microsoft.Web/site" }
	get resourceParameters()	{ 
		return []
	}
	get currenTemplate() 		{ return false }
	get defaultTemplate() 		{ return false }
	
	get resourceParent()	{ return false }
	get resourceChildren()	{ return [

	] }


}
module.exports = AzureGenericResource;