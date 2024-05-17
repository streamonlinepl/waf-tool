//============================================================================================================================
	const path 		= require('path');
	const fs 		= require('fs');
//============================================================================================================================
class AzureResource {

	constructor(platform, resourceClient) {
		this._platform 			= platform;
		if (this.constructor.name == 'AzureResource') throw new Error('AzureResource is an abstract class and cannot be instantiated - inherit instead!')
		try {
			this._templateFile 		= platform.resources[ this.name ].templateFile;
			this._parameters 		= platform.resources[ this.name ].parameters;		
		} catch(e) {}
		this._resourceClient	= resourceClient;
	}

	get name() 				{ return this.constructor.name }
	get parameters() 		{ return this._parameters }
	get template() 			{ return this._template || this.reloadTemplate() }
	get templateFile() 		{ return this._templateFile }
	get templateFilaPath()	{ return path.join(process.cwd(), this.templateFile) }

	//----------------------------------------------------------------------------------	
	//----------------------------------------------------------------------------------
	reloadTemplate() { 		
		let tplFilePath = this.templateFilaPath;
		this._template = JSON.parse(fs.readFileSync(tplFilePath, 'utf8'));
		return this._template;        
	}
	//----------------------------------------------------------------------------------
	/**
	 * Saves stored-in-memory template to a template file
	 * @param {ResourceTemplate} template A template, JSON object, complaint with Azure.deploymentTemplate schema
	 */	
	async saveTemplate( template=false ) {
		if (!template) template = this.template;
		try {
            fs.writeFileSync(this.templateFilePath, JSON.stringify(template))
			this._template = template;
            console.log(`> Template ${this.name} saved!`)
        } catch (err) {
            console.error(err);
            throw err
        }
	}
	//----------------------------------------------------------------------------------
	async deployTemplate(params=false, resourceClient=false) {

		if (resourceClient) this._resourceClient = resourceClient;
		if (!this._resourceClient) throw new Error(this.constructor.name +' > deployTemplate > No ResourceManagementClient provided');
        console.log(`> Deploying template: ${this.name}`);

		let template = this.template;
		let parameters = Object.entries(params || this.parameters).reduce( (acc, e) => {
			acc[e[0]]={value:e[1]};
			return acc;
		},{})

        const parameter = {
            properties: {
                mode: "Incremental",
                template: template,
                parameters
            },
        };
        const createResult_deployment = await this._resourceClient.deployments.beginCreateOrUpdateAndWait(
            this._platform.resourceGroupName,
            "deployment-" + Math.random().toString().substr(5,5),
            parameter
        );

        console.log(JSON.stringify(createResult_deployment, null, 3));        
		// console.log('---------- OUTPUTS --------');
    	// console.log(JSON.stringify(createResult_deployment.properties.outputResources, null, 4));        

        console.log(`> Deployment finished.`)
		return createResult_deployment;
	}

}
//============================================================================================================================
module.exports = AzureResource;