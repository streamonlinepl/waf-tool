//========================================================================

    const Tools 	    = require('./../tools');
    const Const 	    = require('./../waf-constants');
    const StringParser  = require('./../parsers/string-parser');
    
    const fs            = require('fs');
    const ACmd          = require('./a-cmd');

//========================================================================


//========================================================================
class CmdLearn extends ACmd {

    constructor(wafApp) { super(wafApp )};
    get id()    { return "learn" }
    //------------------------------------------------------------    
    async execute( params ) {

        params = params || this.getArgvParams();        
        params = ( params.length ? params.join(' ') : params );

        //------------------------------------
        // parsing
        const traits = Tools.getTraitsObject( { mode:Const.WAFMode.LEARN } )         // traits obj, bez false values
        const logics = this.waf().Logics.getLogicsFor( traits );  


        let parser = new StringParser();
        let parserResults = await parser.parse( params, {} );

        console.log( 'getEntries', parserResults.getEntries())

        let asnColl = await parserResults.populateToAsnInfo({ skipExisting:true });        
        
		// result[ logicId ] = ...
        let results = await this.waf().Logics.executeCollection( logics, asnColl );
        
        this.waf().getDb().checkStats(true);


        return results;


        // params = params || this.getArgvParams();        
        // params = Tools.lineToEntries( params.length ? params.join(' ') : params );

        // // najpierw pobieramy wszystkie parametry ze wszystkich plików 
        // // i dołączamy je do parametrów z cmdline
        // let filesToProcess  = params.filter( v => { return Tools.isFileName(v) } )
        // if (filesToProcess.length) {
        //     let filesParams = await this.waf().InputFiles.resolve( filesToProcess );
        //     if (filesParams && filesParams.length) {
        //         params = Tools.removeDuplicates(params.concat( filesParams ))
        //     }
        // }       
        // const ASNInfo = this.waf().getDM('ASNInfo');

        // // dzielimy parametry na...
        // const paramsIp      = params.filter( v => { return Tools.isIP(v) } )
        // const paramsAsn     = params.filter( v => { return Tools.isASN(v) } )

        // if (!(paramsIp.length || paramsAsn.length )) {
        //     console.log(`> Missing or invalid parameters!`);
        //     return false
        // }
		// else console.log('\t...IPs: %s\n\t...ASNs: %s',paramsIp.length, paramsAsn.length );
		

        // let asnInfo = [];
                
        // if (paramsIp.length)       asnInfo = asnInfo.concat( await this.waf().getAsnInfoByIp( paramsIp ));        
        // if (paramsAsn.length)      asnInfo = asnInfo.concat( await this.waf().getAsnInfo( paramsAsn ));		        
        
        // asnInfo     = this.waf().getDM('ASNInfo').optimiseCollection( asnInfo );
        
		// // result[ logicId ] = ...
        // const traits = Tools.getTraitsObject( { mode:Const.WAFMode.LEARN } )         // traits obj, bez false values
        // const logics = this.waf().Logics.getLogicsFor( traits );  

        // let results = await this.waf().Logics.executeCollection( logics, asnInfo );
        
        // this.waf().getDb().checkStats(true);


        // return results;
    }   

}
//========================================================================
module.exports = CmdLearn;