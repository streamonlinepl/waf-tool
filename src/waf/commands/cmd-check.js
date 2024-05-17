//========================================================================

    const Tools 	    = require('./../tools');
    const Const 	    = require('./../waf-constants');
    const StringParser  = require('./../parsers/string-parser');
    
    const fs            = require('fs');
    const ACmd          = require('./a-cmd');
const ASNInfo = require('../datamodels/asninfo');

//========================================================================


//========================================================================
class CmdCheck extends ACmd {

    constructor(wafApp) { super(wafApp )};
    get id()    { return "check" }
    //------------------------------------------------------------    
    async execute( params ) {

        params = params || this.getArgvParams();        
        params = ( params.length ? params.join(' ') : params );

        //------------------------------------
        // parsing
        const traits = Tools.getTraitsObject( { mode:Const.WAFMode.CHECK } )         // traits obj, bez false values
        const logics = this.waf().Logics.getLogicsFor( traits );  
        const ASNInfo = this.waf().getDM('ASNInfo');

        let parser = new StringParser();
        let parserResults = await parser.parse( params, {} );

        console.log( 'getEntries', parserResults.getEntries())

        let ipsColl = parserResults.getEntriesByType( 'ip' );
        ipsColl = Tools.removeDuplicates( ipsColl );

        let ipsAsnColl = await ASNInfo.populateEntry( ipsColl, {skipExisting:false});		
		let results = ipsAsnColl.map( e => ({query:e.query, ipinfo:e }) );
		results.forEach( e => {
			delete e.ipinfo['query'];
			e.ipinfo.asn.domain = `http://${e.ipinfo.asn.domain}`;
			e.ipinfo._more_on_asn = `https://ipinfo.io/${e.ipinfo.asn.asn}?token=f8c14b6c142bec`;
		})        			
		
        for (let e of results){
            e.isBlocked 			= this.waf().getDb().isEntryBlocked( e.query || e.ipinfo.asn.route )    
            e.inDatabase 			= this.waf().getDb().hasAsn( e.ipinfo.asn.asn );
            e.inBlockedSection 		= this.waf().getDb().blockedAsn( e.ipinfo.asn );
            e.inUnblockedSection 	= this.waf().getDb().unblockedAsn( e.ipinfo.asn );
        }
		
		
        this.waf().getDb().checkStats(true);
        return results;
       
    }   

}
//========================================================================
module.exports = CmdCheck;