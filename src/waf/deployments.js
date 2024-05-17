//========================================================================

    const ADb       = require('./a-db');
    const Tools     = require('./../tools')

//========================================================================

    let _filedir = false;
	const now = Date.now();
    const _template = {
		created:now,
		lastModified:now,
		lastDeployed:0,
		lastDeployment:{
			master: {
				version:0,
				stats:{}
			},
			countries:{
				version:0,
				stats:{}
			},
		},		

		deployment:{
			rulesGroups:[
				'white-rules',
				'country-rules',
				'ddos-rules',
				'directentry-rules',
				'ratelimit-rules',
			]
		},

		rulesGroups:[

		],



		countries:[ ]
    }
    let _data       = false;

//========================================================================
class DeploymentsDb extends ADb {

    constructor(wafApp) {
		_filedir = `${process.cwd()}/src/waf/data/${wafApp.platformId}/`;
        super(wafApp);
    }
    //------------------------------------------------------------
    get fileName()          { return 'deployments.json' }
    get fileDir()           { return _filedir }

    get data()              { return _data }
    set data(v)             { _data = v }
    get template()          { return _template }
    //------------------------------------------------------------
	getStatus() {
		return {
			status:(_data.lastModified > _data.lastDeployed ? ADb.Status.OUT_OF_DATE : ADb.Status.OK),
			lastModified:new Date(_data.lastModified).toJSON(),
			lastDeployed:_data.lastDeployed ? new Date(_data.lastDeployed).toJSON() : 'NEVER!'
		}
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
    async impress() {
		_data.lastModified = Date.now();
    }
    //------------------------------------------------------------
	// input filtering - countries	
	
}
//========================================================================


module.exports = DeploymentsDb;