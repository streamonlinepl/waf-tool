//========================================================================

    const ALogic        = require('./a-logic');
    const Const         = require('./../waf-constants');

//------------------------------------------------------------

    const _traits = {
        action: [Const.RuleAction.BLOCK],   // false - nie działa, true - dla wszystkich, [sd] - dla wybranych
        mode: [Const.WAFMode.COMMAND]
    }
    

//========================================================================
class CmdBlockLogic extends ALogic {

    constructor(wafApp) {
        super(wafApp);
    }
    get id()                { return 'cmdBlockLogic' }
	get enabled()			{ return true }
	get traits()            { return _traits }
    // setListeners()          { }
	
    payloadFilter( asnInfo ){ return true }

	//------------------------------------------------------------
	// overriden
    async _run( payload, opts ) {
        console.log(`> executing logic: ${this.id} - ${this.constructor.name}`)

        // payload is an array

        // let asns = this._payload.filter( this.blockLogicFilter );        
        // asns = asns.filter( this.waf().getDb().notBlockedAsn );

        await this.waf().getDb().blockAsn( payload );
        // this._result = asns;
        return payload;
    }

}
//========================================================================
module.exports = CmdBlockLogic