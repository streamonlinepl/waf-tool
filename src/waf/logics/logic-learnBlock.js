//========================================================================

    const ALogic        = require('./a-logic');
    const Const         = require('./../waf-constants');

//------------------------------------------------------------

    const _traits = {
        mode: [Const.WAFMode.LEARN]
    }

    const _defOpts = {
        resetResult:true,
        refreshData:false
    }

//========================================================================
class logicLearnBlock extends ALogic {

    constructor(wafApp) {
        super(wafApp);
    }
    get id()                { return 'logicLearnBlock' }
    get traits()            { return _traits }
	get enabled()			{ return true }    
	//------------------------------------------------------------
    // setListeners()          { }
	
    payloadFilter( asnInfo ) { return asnInfo.type == "hosting" }

	//------------------------------------------------------------
	// overriden
    async _run( asns, opts ) {
                   
        if (!opts.refreshData && asns && asns.length)
            asns = asns.filter( a => this.waf().getDb().notInUseAsn(a) );

        await this.waf().getDb().blockAsn( asns );
        
        return asns;
    }

}
//========================================================================
module.exports = logicLearnBlock