//========================================================================

    const ADb       = require('./a-db');
    const Tools     = require('./../tools')
    const Const     = require('./../waf-constants');
//========================================================================

    const _filedir = `${process.cwd()}/src/waf/data/`;
	const now = Date.now();
    const _template = {
		created:now,
		lastModified:now,
		lastDeployed:0,
        statsDeployed:{},

        // przeorane asny
        isp:[],				
        education:[],
        business:[],
        hosting:[],

        allowed:{
            asns:[]
        },
        disallowed:{
            asns:[]
        },    
        unblocked:{
            asns:[],
            domains:[
                
            ]
        },
    
        blocked:{
            asns:[],	// blokowane całe asny            
            nets:[],	// wsystkie netbloki - pobrane z asn'ów
            nets6:[],
            nets_merged:[],	// j.w. merged
            nets6_merged:[],
        }
    }
    let _data       = false;
    let _stats      = false;

//========================================================================
class MasterDb extends ADb {

    constructor(wafApp) {
        super(wafApp);
    }
    //------------------------------------------------------------
    // data providers
    createDataProviders() {
        this.createDataProvider( 'blockedNetsMerged', { 
            methodName:'getBlockedMergedNets',
            traits:{type:'net', action:'block'}, 
            filter:{ipv4:true,ipv6:true} 
        } );

        this.createDataProvider( 'blockedDirectEntries', { 
            methodName:'getBlockedEntries',
            traits:{type:'direct',action:'block'}, 
            filter:{} 
        } );
    }

    getBlockedMergedNets( filter={ipv4:true,ipv6:true} ) {
        return [].concat(filter.ipv4?this.data.blocked.nets_merged:[], filter.ipv6?this.data.blocked.nets6_merged:[]) || [];
    }    
    getBlockedEntries() {
        return this.data.blocked.direct || [];
    }
    //------------------------------------------------------------

    get id()                { return 'master' }
    get fileName()          { return 'master.json' }
    get fileDir()           { return _filedir }

    get data()              { return _data }
    set data(v)             { _data = v }
    get template()          { return _template }
    
	getStatus() {
		return {
			status:(_data.lastModified > _data.lastDeployed ? ADb.Status.OUT_OF_DATE : ADb.Status.OK ),
			lastModified:new Date(_data.lastModified).toJSON(),
			lastDeployed:_data.lastDeployed ? new Date(_data.lastDeployed).toJSON() : 'NEVER!'
		}
	}
    checkStats(display=false) {        

        const onClose = (stats, change ) => {            
            if (display) {
                console.log(`------------------------------------------------------------`)
                console.log(`> Database Stats:`, JSON.stringify(stats, null, 4))                

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
            isp:this.data.isp.length,
            education:this.data.education.length,
            business:this.data.business.length,
            hosting:this.data.hosting.length,
            nets:this.data.blocked.nets.length,
            nets6:this.data.blocked.nets6.length,
            nets_merged:this.data.blocked.nets_merged.length,
            nets6_merged:this.data.blocked.nets6_merged.length,
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

	getStats(){
		return {
			isp:this.data.isp.length,
			education:this.data.education.length,
			business:this.data.business.length,
			hosting:this.data.hosting.length,
			nets:this.data.blocked.nets.length,
			nets6:this.data.blocked.nets6.length,
			nets_merged:this.data.blocked.nets_merged.length,
			nets6_merged:this.data.blocked.nets6_merged.length,
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
    hasAsn( asn ) { 
        return  (
            _data.isp.includes( asn ) ||
            _data.business.includes( asn ) ||
            _data.hosting.includes( asn ) ||
            _data.education.includes( asn ) 
        )
    }
    hasDomain( domain ) { }
    blockedAsn( asnInfo ) { return _data.blocked.asns.includes( asnInfo.asn ) }
    notBlockedAsn( asnInfo ) { return !this.blockedAsn( asnInfo ) }
    unblockedAsn( asnInfo ) { return _data.unblocked.asns.includes( asnInfo.asn ) }
    notInUseAsn( asnInfo ) { return this.getAsnState( asnInfo ) == false }
    inUseAsn( asnInfo ) { return !this.notInUseAsn( asnInfo ) }
    //------------------------------------------------------------
    async touchAsn( asns ) {
        if (!Array.isArray(asns)) asns=[asns];
        let toTouch = asns.filter( (e) => { return !this.hasAsn(e.asn) });

        for (let a of toTouch) {
            if (!a.allocated || a.type=="inactive") continue;
            if (!_data[a.type]) {
                console.log('ERROR a', JSON.stringify(a, null, 4))
                throw new Error('ASN type unknown: ', a.type)
            }
            _data[ a.type ].push( a.asn );
        }
        return asns;
    }
    //------------------------------------------------------------
    async blockDomain( domains ) {

    }
    //------------------------------------------------------------
    async blockAsn( asns, refresh=false ) {
        if (!Array.isArray) asns=[asns];
        for (let asn of asns) {
            if (!refresh && _data.blocked.asns.includes(asn.asn)) continue;

            _data.blocked.asns.push(asn.asn);
            _data.blocked.nets = _data.blocked.nets.concat(asn.netblocks);
            _data.blocked.nets_merged = _data.blocked.nets_merged.concat( Tools.mergeCidr( asn.netblocks ) )
            _data.blocked.nets_merged = Tools.mergeCidr( _data.blocked.nets_merged );

            _data.blocked.nets6 = _data.blocked.nets6.concat(asn.netblocks6);
            _data.blocked.nets6_merged = _data.blocked.nets6_merged.concat( Tools.mergeCidr( asn.netblocks6 ) )
            _data.blocked.nets6_merged = Tools.mergeCidr( _data.blocked.nets6_merged );
        }
        _data.blocked.asns = Tools.removeDuplicates(_data.blocked.asns)
        await this.touchAsn( asns );
    }
    //------------------------------------------------------------    
    getAsnState( asn ) {
        let c=false, s = Const.AsnStatesList;        
        return s.some( state => (c=false,_data[state].asns.includes(asn.asn) && (c=state)) ), c;
    }
    // !uwaga przenosi tylko sam asn do innego stanu, czyści pozostałości, nie wpływa na sieci
    setAsnState( asn, state ) {
        let s;  
        state = Tools.toAsnState(state);      
        while( s = this.getAsnState(asn) ) 
            _data[s].asns = Tools.deleteItem(_data[s].asns, asn.asn)
        _data[state].asns.push(asn.asn);
    }
    //------------------------------------------------------------

    actOnAsn( asns, mode=false, action=false ) {

        if (!Array.isArray(asns)) asns = [asns];

        const traits = Tools.getTraitsObject( { mode, action } )         // traits obj, bez false values
        const logics = this.waf().Logics.getLogicsFor( traits );        // pobieramy logiki dla action / mode


        // let newState = action ? Tools.actionToState( action ) : false;


        // return 
        //     this.actionAllowed( newState, oldState ) 
        //     && 


    }


    //------------------------------------------------------------

    async unblockAsn( asns, refresh=false ) {

        if (!Array.isArray) asns=[asns];
        for (let asn of asns) {
            if ( !refresh && _data.unblocked.asns.includes(asn.asn) ) continue;                        
                         
            Tools.deleteItems(_data.blocked.nets, asn.netblocks );
            _data.blocked.nets_merged = Tools.mergeCidr( _data.blocked.nets );
                        
            Tools.deleteItems(_data.blocked.nets6, asn.netblocks6 );
            _data.blocked.nets6_merged = Tools.mergeCidr( _data.blocked.nets6 )
            
            // blocked, unblocked lista
            _data.unblocked.asns.push( asn.asn );
            _data.blocked.asns = Tools.deleteItem(_data.blocked.asns, asn.asn );                   

            if (!asn.allocated || asn.type=="inactive") continue;
            if (!_data[asn.type]) {
                console.log('ERROR asn type unknown', JSON.stringify(asn, null, 4))
                // throw new Error('ASN type unknown: ', a.type)
                continue;
            }
        }
        _data.unblocked.asns = Tools.removeDuplicates(_data.unblocked.asns);
        await this.touchAsn( asns );

    }

    //------------------------------------------------------------

    isEntryBlocked( entry ) {
        switch(true) {
            case Tools.isIPv4(entry): return Tools.cidrContains( _data.blocked.nets_merged, entry );
            case Tools.isIPv6(entry): return Tools.cidrContains( _data.blocked.nets6_merged, entry );
            case Tools.isCIDRv4(entry): return Tools.cidrContains( _data.blocked.nets_merged, entry );
            case Tools.isCIDRv6(entry): return Tools.cidrContains( _data.blocked.nets6_merged, entry );
        }
        return 'unknown?'
    }

    //------------------------------------------------------------
}
//========================================================================
module.exports = MasterDb;