//========================================================================

    const ACmd      = require('./a-cmd');
	const Tools 	= require('./../tools');


//========================================================================


//========================================================================
class CmdCountryList extends ACmd {

    constructor(wafApp) { super(wafApp )};
    get id()    { return "country-list" }
    //------------------------------------------------------------    
    async execute() {
        let countries = this.getArgvParams();				
        if (countries.length) console.log('\t...Countires: %s ',countries.length)
		else countries=false;
	
		const CountryDb = this.waf().getDb('countries');
		let countryList = await CountryDb.countryList( countries, true );
		console.log(countryList)
		console.log(`> Number of countries blocked:`,Object.keys(countryList).length)
		return { NumberOfCountriesBlocked:Object.keys(countryList).length };		
    }
    //------------------------------------------------------------
}
//========================================================================
module.exports = CmdCountryList;