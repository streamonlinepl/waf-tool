//===========================================================

	const { ResourceManagementClient }  						= require("@azure/arm-resources");
	const { DefaultAzureCredential, ClientSecretCredential }    = require("@azure/identity");		

//===========================================================
	let AzureAppConfig 	= false;
	let rmClient 		= false;		// object -> ( subscriptionId : client )
//===========================================================
class AzureApplicationAuthorization {

	constructor( azureConfig=false ) { 
		if (azureConfig) AzureAppConfig = azureConfig;
		else this._obtainApplicationConfig();
	}
	//-------------------------------------------------------
	_obtainApplicationConfig() {
		AzureAppConfig 		= require('./azure-config');
	}
	_createClientSecretCredentials() {
		return new ClientSecretCredential(
			AzureAppConfig.tenantId,
			AzureAppConfig.clientId,
			AzureAppConfig.secret,
		)
	}
	//=======================================================
	async getResourceManagementClient( subscriptionId, renew=false ) {
		if ((!renew) && rmClient && rmClient[ subscriptionId ]) return rmClient[subscriptionId];
		try {
            // let auth = await msRestNodeAuth.interactiveLoginWithAuthResponse();            
            // let auth = await msRestNodeAuth.loginWithServicePrincipalSecretWithAuthResponse(_clientId, _secret, _tenantId);            
            let client = new ResourceManagementClient( this._createClientSecretCredentials(), subscriptionId );
			if (!rmClient) rmClient = {}
			rmClient[subscriptionId] = client;
            return client;
        } catch(e) { console.dir(e, {depth:null}); }
        return false;
	}

}
//===========================================================
module.exports = AzureApplicationAuthorization;