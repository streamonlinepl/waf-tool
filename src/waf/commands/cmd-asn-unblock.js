//========================================================================

    const ACmd      = require('./a-cmd');
	const Tools 	= require('../tools');
    const Const         = require('./../waf-constants');

    const StringParser  = require('./../parsers/string-parser');



//========================================================================


//========================================================================
class CmdAsnUnblock extends ACmd {

    constructor(wafApp) { super(wafApp )};
    get id()    { return "asn-unblock" }
    //------------------------------------------------------------    
    async execute( params ) {

        params = params || this.getArgvParams();        
        params = ( params.length ? params.join(' ') : params );

        //------------------------------------
        // parsing

        let parser = new StringParser();
        let parserResults = await parser.parse( params );

        let asnColl = await parserResults.populateToAsnInfo({ skipExisting:false });
        console.log('asn coll:', asnColl.map( e => e.asn ))
        // traits obj, bez false values
        const traits = Tools.getTraitsObject( { 
            mode:Const.WAFMode.COMMAND, 
            action:Const.RuleAction.UNBLOCK 
        } )         
        const logics = this.waf().Logics.getLogicsFor( traits );  
        
        let results = await this.waf().Logics.executeCollection( logics, asnColl );
        
        this.waf().getDb().checkStats(true);
        
        
        // result[ logicId ] = ...
        return results;


    }   

}
//========================================================================
module.exports = CmdAsnUnblock;