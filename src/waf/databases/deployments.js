//========================================================================

    const ADb       = require('./a-db');
    const Tools     = require('./../tools')

//========================================================================

    let _filedir = false;
	const now = Date.now();
    const _template = {
       	created:now,			// when the file was created
		lastModified:now,		// last modification
		lastDeployed:0,			// last deployment

		deployments:[ 
			{
				created:'ts',
				providerId:'Azure',

				databases:{
					master: {}, 	// stats of that time
					countries: {},				
				}
			} 
		]
    }
    let _data       = false;

//========================================================================
class DeploymentDb extends ADb {

    constructor(wafApp) {
		_filedir = `${process.cwd()}/src/waf/data/${wafApp.platformId}/`;
        super(wafApp);
    }
    //------------------------------------------------------------
    // data providers
    createDataProviders() { } 
	//------------------------------------------------------------

    get id()                { return 'deployments' }
    get fileName()          { return 'deployments.json' }
    get fileDir()           { return _filedir }

    get data()              { return _data }
    set data(v)             { _data = v }
    get template()          { return _template }
	get dbsToCompareTo() 	{ return  ['master', 'countries'] }
		
    //------------------------------------------------------------
	getStatus() {
		const dbsToCompareTo = this.dbsToCompareTo;
		let dbStatuses = dbsToCompareTo.map(e => this.waf().getDb(e).getStatus() ).filter(e=>e)
		return {
			status:(dbStatuses.some( s => s.lastModified >_data.lastDeployed ) ? ADb.Status.OUT_OF_DATE : ADb.Status.OK),
			lastModified:new Date(_data.lastModified).toJSON(),
			lastDeployed:_data.lastDeployed ? new Date(_data.lastDeployed).toJSON() : 'NEVER!'
		}
	}
    //------------------------------------------------------------
	deploymentCreate( providerId ) {
		
		const dbsToCompareTo = this.dbsToCompareTo;
		let databases = dbsToCompareTo.reduce( (acc,e)=>{
			acc[e] = this.waf().getDb(e).getStats();
			return acc;
		}, {});
		
		let deployment = { created:Date.now(), providerId, databases }

		_data.deployments.push( deployment );
	}
	

    //------------------------------------------------------------
    // async load(forced=false) {
    //     await super.load(forced);
    // }
    //------------------------------------------------------------
    async maintain() {

    }
    //------------------------------------------------------------
    // async save() { }

    //------------------------------------------------------------
    // operacje na danych	
    //------------------------------------------------------------
	async countryList( countries=false, withNames=false) {
		
		if (countries && countries.length) {
			countries = this.filterCountriesInput(countries, false);
			return countries.reduce( (a,e)=>{
				a[e] = this.hasCountry( e ) ? 'blocked' : 'allowed';
				return a;
			},{})
		}

		if (withNames) 
			return _data.countries.reduce( (a, e) => {
				a[e] = this.getCountryName(e);
				return a;
			},{})

		return _data.countries;
	}
    
}
//========================================================================
module.exports = DeploymentDb;