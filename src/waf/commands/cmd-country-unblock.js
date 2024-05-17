//========================================================================

    const ACmd      = require('./a-cmd');
	const Tools 	= require('./../tools');


//========================================================================


//========================================================================
class CmdCountryUnblock extends ACmd {

    constructor(wafApp) { super(wafApp )};
    get id()    { return "country-unblock" }
    //------------------------------------------------------------    
    async execute() {
        const countries = this.getArgvParams();				
        if (!countries.length) return console.log(`> Missing or invalid parameters!`)
		else console.log('\t...Countires: %s ',countries.length)
		
		const CountryDb = this.waf().getDb('countries');
		let countryUnblock = await CountryDb.countryUnblock( countries, false );
		return { countryUnblock };		
    }
    //------------------------------------------------------------
}
//========================================================================
module.exports = CmdCountryUnblock;