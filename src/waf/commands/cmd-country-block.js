//========================================================================

    const ACmd      = require('./a-cmd');
	const Tools 	= require('./../tools');


//========================================================================


//========================================================================
class CmdCountryBlock extends ACmd {

    constructor(wafApp) { super(wafApp )};
    get id()    { return "country-block" }
    //------------------------------------------------------------    
    async execute() {
        let countries = this.getArgvParams() || [];
        countries = countries.map( e => e.replace(/[\'\",]/gm, '') );
        if (!countries.length) return console.log(`> Missing or invalid parameters!`)
		else console.log('\t...Countries: %s ',countries.length)
		
		const CountryDb = this.waf().getDb('countries');
		let countryBlock = await CountryDb.countryBlock( countries, false );
		return { countryBlock };		
    }
    //------------------------------------------------------------
}
//========================================================================
module.exports = CmdCountryBlock;

// RU ID CN MX JP HK KP KR do SG CA TH AR EC IN PE TW KZ ZA VE GT KG CO IQ VN PH HN PY BO CL LY MM BD IR NI KE KH GH SV LA PK UZ