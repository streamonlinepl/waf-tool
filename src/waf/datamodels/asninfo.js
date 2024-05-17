//========================================================================

    const ADataModel    = require('./a-dm');
    const Tools         = require('./../tools');
    const IpInfo        = require('./../../utils/ipinfo').getInstance();

//========================================================================
class ASNInfo extends ADataModel {

    constructor(wafApp) { super(wafApp) }
    //------------------------------------------------------------
    optimiseCollection(objs) { return Tools.removeDuplicates( objs, 'asn' ) }
    //------------------------------------------------------------
    
    // { asn, ip }
    async getByEntries( entries, opts ) {
        // console.log('> getByEntries >', entries)
        let res = [];
        if (entries.ip) 
            res = await this.getByIp( entries.ip, opts );
        // console.log(`ip`, res)
        if (entries.asn) 
            res = res.concat( await this.getByAsn( entries.asn, opts ))
        // console.log(`asn`, res)
        return res;
    }

    async getByAsn( asns, opts={skipExisting:true} ) {
        if (!asns) return []
        if (!Array.isArray(asns)) asns=[asns];        
        const db = this.waf().getDb();
        asns = Tools.removeDuplicates( asns );

        if (opts.skipExisting)
            asns = asns.filter( (e)=> { return !db.hasAsn(e) })

        let asnInfo = await this.populateEntry( asns );

        // return this.dbAddAsnData( asnInfo, true );    
        return asnInfo;
    }

    async getByIp( ips, opts={skipExisting:true} ) {
        if (!ips) return []
        if (!Array.isArray(ips)) ips=[ips];
        ips = Tools.removeDuplicates( ips );
		// console.log('asninfo getByIps ips:', ips)
        // na później - sprawdzanie czy ip
        // const ipDb = this.waf().getDb('ip'); 
        let ipInfo = await this.populateEntry( ips );
		// console.log('asninfo getByIps ipInfo:', ipInfo)
        let asns = ipInfo.filter(e => e.asn && e.asn.asn ).map(e => e.asn.asn);
		// console.log('asninfo getByIps asns:', asns)
        return this.getByAsn(asns, opts);
    }

    // async getByFile( files ) {
    //     if (!Array.isArray( files )) files=[files];
    //     let inputParams = [];
    //     for(let f of files) {            
    //         try {
    //             inputParams = inputParams.concat( await this.waf().InputFiles.loadFile( f ) );
    //         } catch(e){
    //             console.log('ERROR while loading', f);
    //             console.log(e);
    //         }
    //     }

    // }
    //------------------------------------------------------------
	// asn helpers
	asnGetDomain( asn ) {
		return asn.domain || false;
	}


    //------------------------------------------------------------
    // pobiera dane z ipinfo dla każdego z asna
    async populateEntry( entries ) {

        const splitArray = (inputArray, perChunk=600) => {
			return inputArray.reduce((resultArray, item, index) => { 
				const chunkIndex = Math.floor(index/perChunk)
				if(!resultArray[chunkIndex]) resultArray[chunkIndex] = [] //new chunk            
				resultArray[chunkIndex].push(item)
				return resultArray
			}, [])
		}

        if (!Array.isArray(entries)) entries=[entries];
        let res = [];

        let parts = [entries];
        if (entries.length>1000)
            parts = splitArray(entries, 600);

        for (let part of parts) {
            entries = await IpInfo.batch( part );
            // console.log('ansinfo populateEntry entries', entries)
            for( let entry of Object.keys(entries) ) {        
                let a = entries[entry];     

                if (!a.query)
                    a.query=entry || false;                                    

                if (a.prefixes) {
                    a.netblocks=[];
                    a.netblocks6=[];
                    a.prefixes.forEach(e=>{a.netblocks.push(e.netblock)})
                    a.prefixes6.forEach(e=>{a.netblocks6.push(e.netblock)})
                }
                
                // delete a['prefixes']
                // delete a['prefixes6']
                delete a['peers']
                delete a['upstreams']
                delete a['downstreams']
    
                // console.log('a',a);

                res.push( a );
            }    
        }

        // console.log('populate', res)
        return res;   
    }


}
//========================================================================
module.exports = ASNInfo