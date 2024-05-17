//========================================================================

    const ADb       = require('./a-db');

//========================================================================

    const _filedir = `${process.cwd()}/src/waf/data/`;
	const now = Date.now();
    const _template = {
        	created:now,
            lastModified:now,
            lastResolved:0,

            // wszystkie domeny które były przerobione
            domains:[],
            // wymagające decyzji - interakcji
            domainsToCheck:[],
            // {
            // [{"type":"isp","size":3072,"name":"BEE UNION (CAMBODIA) TELECOM CO., LTD","country":"KH","domain":"beeunion.net","asn":"AS137811"}    
            //     domain:'string',		
            //     asn:'string',
            // }

            // te elementy trzeba zablokować - rozwiązać odpowiednio asn->netblokc i dodać do master_file
            domainsToBlock:[]
            // {
            //     domain:'string',		
            //     asn:'string',
            // }
            
    }
    let _data       = false;
    let _stats      = false;


//========================================================================
class DomainsDb extends ADb {

    constructor(wafApp) {
        super(wafApp);
    }
    //------------------------------------------------------------
    // data providers
    createDataProviders() {
        this.createDataProvider( 'domainsToCheck', { 
            methodName:'getDomainsToCheck',
            traits:{type:'domain', action:'check'}, 
            filter:{isp:true,business:true,education:true,country:true} 
        } );

        this.createDataProvider( 'domainsToBlock', { 
            methodName:'getDomainsToBlock',
            traits:{type:'domain',action:'block'}, 
            filter:{} 
        } );
    }

    getDomainsToCheck( ) {
        return this.data.domainsToCheck || [];
    }    
    getDomainsToBlock() {
        return this.data.domainsToBlock || [];
    }    
    //------------------------------------------------------------
    get id()                { return 'domains' }
    get fileName()          { return 'domains.json' }
    get fileDir()           { return _filedir }
    get template()          { return _template }

    get data()              { return _data }
    set data(v)             { _data = v }
    //------------------------------------------------------------
	getStatus() {
		return {
			status:(_data.domainsToCheck.length ? ADb.Status.ACTION_REQUIRED :  ADb.Status.OK),
			lastModified:new Date(_data.lastModified).toJSON(),
		}
	}
    checkStats(display=false) {        

        const onClose = (stats, change ) => {            
            if (display) {
                console.log(`------------------------------------------------------------`)
                console.log(`> DOMAINS > Database Stats:`, JSON.stringify(stats, null, 4))                

                if (change) {
                    console.log(`---------------`)
                    console.log(`> Changes made:`,JSON.stringify(change, null, 4))                    
                }
            }
            return { stats, change }
        }

        let old = _stats ? Object.assign({},_stats) : false;
        let change = {}
        _stats = {
            domains:this.data.domains.length,
            domainsToCheck:this.data.domainsToCheck.length,
            domainsToBlock:this.data.domainsToBlock.length,            
        }
        if (!old)             
            return onClose(_stats, change);
        
        const keys = Object.keys(old);
        for (let k of keys) {
            change[k] = _stats[k] - old[k];
            if (change[k]==0) delete change[k];
        }

        return onClose(_stats, change);
    }
    //------------------------------------------------------------
    // async load(forced=false) {
    //     await super.load(forced);
    // }
    //------------------------------------------------------------
	hasDomain( entry ) { return _data.domains.find( d => (d.asn==entry.asn && d.domain==entry.domain) ) }
	hasNotDomain( entry ) { return !_data.domains.find( d => (d.asn==entry.asn && d.domain==entry.domain) ) }
    //------------------------------------------------------------
	async checkDomains( domainEntry, filtered=false ) {
		if (!Array.isArray(domainEntry)) domainEntry=[domainEntry];

		if (!filtered) domainEntry = domainEntry.filter( this.hasNotDomain );
		_data.domains = _data.domains.concat( domainEntry.map( e => { return {asn:e.asn,domain:e.domain}}));
		_data.domainsToCheck = _data.domainsToCheck.concat( domainEntry );		
	}
    //------------------------------------------------------------
	async touch() {
		_data.lastModified = Date.now();
	}
    //------------------------------------------------------------
    async maintain() {

    }
    //------------------------------------------------------------
    // async save() { }


}
//========================================================================
module.exports = DomainsDb;