//=========================================================

    const axios     = require('axios');
    const net       = require('net');
    const fs        = require('fs');
    const path      = require('path');
    const cidrtool  = require('cidr-tools')

//---------------------------------------------------------

    const _host     = `https://ipinfo.io`
    const _asnDb    = 'db-asn.json';


    // let _db        = false;


    let _db = false;


//=========================================================
class IPInfo {

    constructor( token ) { 
        this._token = token;
        this.loadDb();
    }
    //================================================
    async start(){
        this.loadDb();

        await this.processAsn( [ "AS1239", ] )

        this.saveDb();
    }
    //================================================
    

    loadDb() {
        if (_db) return;
        try {
            var asnDbPath = path.join(process.cwd(), _asnDb);
            _db = JSON.parse(fs.readFileSync(asnDbPath, 'utf8'));
            console.log('> db loaded.')
        } catch (ex) {
            console.log(ex);
            throw ex;
        }        
    }
    saveDb() {
        if (!_db) return;
        var asnDbPath = path.join(process.cwd(), _asnDb);
        fs.writeFileSync(asnDbPath, JSON.stringify(_db));
    }    

    dbAddAsnData( aInfo, isFiltered=false ) {
        if (!Array.isArray(aInfo)) aInfo=[aInfo];
        if (!isFiltered) aInfo = aInfo.filter( (e) => { return !this.asnExists(e.asn) });

        console.log('dbAddAsnData size:', aInfo.length)
        console.log('dbAddAsnData asn:', aInfo.map( e => e.asn ))

        for (let a of aInfo) {
            // console.log('asnDataItem:', a)
            if (!_db[a.type]) {
                throw new Error('ASN type unknown: ', a.type)

            }
            _db[ a.type ].push( a.asn );
        }
    
		this.doNeedsAttentionLogic( aInfo );

        let blocked = this.doBlockLogic( aInfo );
        return blocked;
    }
	needsAttentionLogicFilter( asnInfo ) {
		if (this.blockLogicFilter(asnInfo)) return false;
		let asnDomain = asnInfo.domain;
		if (!asnDomain) return true;
		
	}

	doNeedsAttentionLogic( asns ) {
        console.log(`> applying needs attention logic...`);
		let counter=0;
	}

    blockLogicFilter( asnInfo ) {
        return asnInfo.type == "hosting"
    }
    doBlockLogic( asns ) {
        console.log(`> applying blocking logic...`);
        console.log('doBlockLogic asns', asns.map(e=>e.asn));
        asns = asns.filter( this.blockLogicFilter );
        for (let asn of asns) {
            _db.blocked.asns.push(asn.asn);
            _db.blocked.nets = _db.blocked.nets.concat(asn.netblocks);
            _db.blocked.nets_merged = _db.blocked.nets_merged.concat( cidrtool.merge( asn.netblocks ) )
            _db.blocked.nets_merged = cidrtool.merge( _db.blocked.nets_merged );

            _db.blocked.nets6 = _db.blocked.nets6.concat(asn.netblocks6);
            _db.blocked.nets6_merged = _db.blocked.nets6_merged.concat( cidrtool.merge( asn.netblocks6 ) )
            _db.blocked.nets6_merged = cidrtool.merge( _db.blocked.nets6_merged );
        }
        return asns;
    }

    //================================================
    async getIPInfoData(entry='') {        
        try {
            let url = `${_host}/${entry}`;
            console.log('url',url)
            const { data } = await axios({         
                url,
                method: 'get',
                params: { token: this._token },
            });
            if (typeof(data)!="object")
                data = JSON.parse(data);
            return data;
        } catch(e) {
            console.log('IPINFO ERROR:',e)
            return false;
        }
    }
    //-----------------------------------------
    /*
        db={
			isp:[],
			education:[],
			business:[],
			hosting:[],
            
			blocked:{
				asns:[],
				nets:[],
				nets6:[],
				nets_merged:[],
				nets6_merged:[]
			}			
        }

    */

    
    //-----------------------------------------
    asnExists( asn ) {
        // return false;
        return (
            _db.hosting.includes( asn ) ||
            _db.education.includes( asn ) ||
            _db.business.includes( asn ) ||
            _db.isp.includes( asn ) 
        )
    }
    //-----------------------------------------


    async processAsn( asns ) {
        if (!Array.isArray(asns)) asns=[asns];        

        asns = asns.filter( (e)=> { return !this.asnExists(e) })
        let asnInfo = await this.populateAsn( asns );
        return this.dbAddAsnData( asnInfo, true );
    }

 



    async populateAsn( asns ) {
        if (!Array.isArray(asns)) asns=[asns];
        let res = []

        let errors = {
            count : 0,
            params: []
        }

        for( let asn of asns ) {
            let a = await this.getIPInfoData( asn );
            if (!a) {
                errors.count+=1;
                errors.params.push(asn);
                continue;
            }
            // console.log('a',a.prefixes)

            a.netblocks=[];
            a.netblocks6=[];
            // if (a.prefixes && (a.prefixes.length>0))
            a.prefixes.forEach(e=>{a.netblocks.push(e.netblock)})
            a.prefixes6.forEach(e=>{a.netblocks6.push(e.netblock)})
            

            delete a['prefixes']
            delete a['prefixes6']
            delete a['peers']
            delete a['upstreams']
            delete a['downstreams']

            res.push( a );
           
        }

        console.log(`ERRORS`, errors);
        // console.log(res)
        return res;
    }


}
//=========================================================
module.exports = IPInfo