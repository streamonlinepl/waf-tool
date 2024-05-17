//========================================================================

    const ALogic        = require('./a-logic');
    const Const         = require('./../waf-constants');

//------------------------------------------------------------

    const _traits = {
        mode: [Const.WAFMode.COMMAND],
        action: [Const.RuleAction.UNBLOCK]
    }

    const _defOpts = {
        resetResult:true,
        refreshData:false
    }

//========================================================================
class logicCmdAsnUnblock extends ALogic {

    constructor(wafApp) {
        super(wafApp);
    }
    get id()                { return 'logicCmdAsnUnblock' }
    get traits()            { return _traits }
	get enabled()			{ return true }    
	//------------------------------------------------------------
    // setListeners()          { }
	
    payloadFilter( asnInfo ) { return true }

	//------------------------------------------------------------
	// overriden
    async _run( asns, opts ) {                           

        await this.waf().getDb().unblockAsn( asns, opts.refreshData );
        
        return asns;
    }

}
//========================================================================
module.exports = logicCmdAsnUnblock