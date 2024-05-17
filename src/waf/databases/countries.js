//========================================================================

    const ADb       = require('./a-db');
    const Tools     = require('./../tools')

//========================================================================

    let _filedir = false;
	const now = Date.now();
    const _template = {
       	created:now,
		lastModified:now,
		lastDeployed:0,

		countries:[ ]
    }
    let _data       = false;
	let _countryCodes = false;

//========================================================================
class CountryDb extends ADb {

    constructor(wafApp) {
		_filedir = `${process.cwd()}/src/waf/data/${wafApp.platformId}/`;
		_countryCodes = Object.keys( countryDictionary );
        super(wafApp);
    }
    //------------------------------------------------------------
    // data providers
    createDataProviders() {
        this.createDataProvider( 'allowedCountries', { 
            methodName:'getAllowedCountries',
            traits:{type:'country', action:'allow'}, 
            filter:{} 
        } );

        this.createDataProvider( 'blockedCountries', { 
            methodName:'getBlockedCountries',
            traits:{type:'country',action:'block'}, 
            filter:{} 
        } );
    }

    getAllowedCountries( ) {
        return this.data.allowedCountries || [];
    }    
    getBlockedCountries() {
        return this.data.countries;
    }
	//------------------------------------------------------------

    get id()                { return 'countries' }
    get fileName()          { return 'countries.json' }
    get fileDir()           { return _filedir }

    get data()              { return _data }
    set data(v)             { _data = v }
    get template()          { return _template }
    //------------------------------------------------------------
	getStatus() {
		return {
			status:(_data.lastModified > _data.lastDeployed ? ADb.Status.OUT_OF_DATE : ADb.Status.OK),
			lastModified:new Date(_data.lastModified).toJSON(),
			lastDeployed:_data.lastDeployed ? new Date(_data.lastDeployed).toJSON() : 'NEVER!'
		}
	}

	getStats() {
		return {
			_numberOfCountries:_data.countries.length
		}
	}
    //------------------------------------------------------------
    // async load(forced=false) {
    //     await super.load(forced);
    // }
    //------------------------------------------------------------
    async maintain() {

    }
    //------------------------------------------------------------
    // async save() { }

    //------------------------------------------------------------
    // operacje na danych
	getCountryName( code ) { return countryDictionary[code.toUpperCase()] }
	validCountryCode( code ) { return _countryCodes.includes( code.toUpperCase() ) }

    hasCountry( country ) { return  ( _data.countries.includes( country ) ) }
    
    //------------------------------------------------------------
    async impress() {
		_data.lastModified = Date.now();
    }
    //------------------------------------------------------------
	// input filtering - countries	
	filterCountriesInput( countries, validate=true ) {
		if (!Array.isArray(countries)) countries=[countries];
		countries = Tools.removeDuplicates( countries );
		countries = countries.map( c => c.toUpperCase() ).filter( c => {
			const throwErr = () => { throw new Error(`Invalid country code: ${c}`) }
			return this.validCountryCode(c) ? true : (validate?throwErr():false);
		});
		return countries;
	}
    //------------------------------------------------------------
    async countryBlock( countries, filtered=false ) {
		if (!filtered) countries = this.filterCountriesInput( countries )

		let entryCount = _data.countries.length;
		_data.countries = _data.countries.concat( countries );
		_data.countries = Tools.removeDuplicates( _data.countries );

		if (entryCount != _data.countries.length) {
			_data.countries.sort();
			await this.impress();
		}

		return Math.abs(_data.countries.length - entryCount);
	}
    //------------------------------------------------------------
    async countryUnblock( countries, filtered=false ) {
		if (!filtered) countries = this.filterCountriesInput( countries )

		let entryCount = _data.countries.length;
		_data.countries = _data.countries.filter( c => !countries.includes(c) );
		
		if (entryCount != _data.countries.length) 
			await this.impress();

		return Math.abs(_data.countries.length - entryCount);
    }
    //------------------------------------------------------------
	async countryList( countries=false, withNames=false) {
		
		if (countries && countries.length) {
			countries = this.filterCountriesInput(countries, false);
			return countries.reduce( (a,e)=>{
				a[e] = this.hasCountry( e ) ? 'blocked' : 'allowed';
				return a;
			},{})
		}

		if (withNames) 
			return _data.countries.reduce( (a, e) => {
				a[e] = this.getCountryName(e);
				return a;
			},{})

		return _data.countries;
	}
    
}
//========================================================================

const countryDictionary = {
	'AD':"Andorra",
	'AE':"United Arab Emirates",
	'AF':"Afghanistan",
	'AG':"Antigua and Barbuda",
	'AL':"Albania",
	'AM':"Armenia",
	'AO':"Angola",
	'AR':"Argentina", 
	'AS':"American Samoa",
	'AT':"Austria",
	'AU':"Australia",
	'AZ':"Azerbaijan",
	'BA':"Bosnia and Herzegovina",
	'BB':"Barbados",
	'BD':"Bangladesh",
	'BE':"Belgium",
	'BF':"Burkina Faso",
	'BG':"Bulgaria",
	'BH':"Bahrain",
	'BI':"Burundi",
	'BJ':"Benin",
	'BL':"Saint Barthélemy",
	'BN':"Brunei Darussalam",
	'BO':"Bolivia",
	'BR':"Brazil",
	'BS':"Bahamas",
	'BT':"Bhutan",
	'BW':"Botswana",
	'BY':"Belarus",
	'BZ':"Belize",
	'CA':"Canada",
	'CD':"Democratic Republic of the Congo",
	'CF':"Central African Republic",
	'CH':"Switzerland",
	'CI':"Cote d'Ivoire",
	'CL':"Chile",
	'CM':"Cameroon",
	'CN':"China",
	'CO':"Colombia",
	'CR':"Costa Rica",
	'CU':"Cuba",
	'CV':"Cabo Verde",
	'CY':"Cyprus",
	'CZ':"Czech Republic",
	'DE':"Germany",
	'DK':"Denmark",
	'DO':"Dominican Republic",
	'DZ':"Algeria",
	'EC':"Ecuador",
	'EE':"Estonia",
	'EG':"Egypt",
	'ES':"Spain",
	'ET':"Ethiopia",
	'FI':"Finland",
	'FJ':"Fiji",
	'FM':"Micronesia, Federated States of",
	'FR':"France",
	'GB':"United Kingdom",
	'GE':"Georgia",
	'GF':"French Guiana",
	'GH':"Ghana",
	'GN':"Guinea",
	'GP':"Guadeloupe",
	'GR':"Greece",
	'GT':"Guatemala",
	'GY':"Guyana",
	'HK':"Hong Kong SAR",
	'HN':"Honduras",
	'HR':"Croatia",
	'HT':"Haiti",
	'HU':"Hungary",
	'ID':"Indonesia",
	'IE':"Ireland",
	'IL':"Israel",
	'IN':"India",
	'IQ':"Iraq",
	'IR':"Iran, Islamic Republic of",
	'IS':"Iceland",
	'IT':"Italy",
	'JM':"Jamaica",
	'JO':"Jordan",
	'JP':"Japan",
	'KE':"Kenya",
	'KG':"Kyrgyzstan",
	'KH':"Cambodia",
	'KI':"Kiribati",
	'KN':"Saint Kitts and Nevis",
	'KP':"Korea, Democratic People's Republic of",
	'KR':"Korea, Republic of",
	'KW':"Kuwait",
	'KY':"Cayman Islands",
	'KZ':"Kazakhstan",
	'LA':"Lao People's Democratic Republic",
	'LB':"Lebanon",
	'LI':"Liechtenstein",
	'LK':"Sri Lanka",
	'LR':"Liberia",
	'LS':"Lesotho",
	'LT':"Lithuania",
	'LU':"Luxembourg",
	'LV':"Latvia",
	'LY':"Libya",
	'MA':"Morocco",
	'MD':"Moldova, Republic of",
	'MG':"Madagascar",
	'MK':"North Macedonia",
	'ML':"Mali",
	'MM':"Myanmar",
	'MN':"Mongolia",
	'MO':"Macao SAR",
	'MQ':"Martinique",
	'MR':"Mauritania",
	'MT':"Malta",
	'MV':"Maldives",
	'MW':"Malawi",
	'MX':"Mexico",
	'MY':"Malaysia",
	'MZ':"Mozambique",
	'NA':"Namibia",
	'NE':"Niger",
	'NG':"Nigeria",
	'NI':"Nicaragua",
	'NL':"Netherlands",
	'NO':"Norway",
	'NP':"Nepal",
	'NR':"Nauru",
	'NZ':"New Zealand",
	'OM':"Oman",
	'PA':"Panama",
	'PE':"Peru",
	'PH':"Philippines",
	'PK':"Pakistan",
	'PL':"Poland",
	'PR':"Puerto Rico",
	'PT':"Portugal",
	'PW':"Palau",
	'PY':"Paraguay",
	'QA':"Qatar",
	'RE':"Reunion",
	'RO':"Romania",
	'RS':"Serbia",
	'RU':"Russian Federation",
	'RW':"Rwanda",
	'SA':"Saudi Arabia",
	'SD':"Sudan",
	'SE':"Sweden",
	'SG':"Singapore",
	'SI':"Slovenia",
	'SK':"Slovakia",
	'SN':"Senegal",
	'SO':"Somalia",
	'SR':"Suriname",
	'SS':"South Sedan",
	'SV':"El Salvador",
	'SY':"Syrian Arab Republic",
	'SZ':"Swaziland",
	'TC':"Turks and Caicos Islands",
	'TG':"Togo",
	'TH':"Thailand",
	'TN':"Tunisia",
	'TR':"Turkey",
	'TT':"Trinidad and Tobago",
	'TW':"Taiwan",
	'TZ':"Tanzania, United Republic of",
	'UA':"Ukraine",
	'UG':"Uganda",
	'US':"United States",
	'UY':"Uruguay",
	'UZ':"Uzbekistan",
	'VC':"Saint Vincent and the Grenadines",
	'VE':"Venezuela",
	'VG':"Virgin Islands, British",
	'VI':"Virgin Islands, U.S.",
	'VN':"Vietnam",
	'ZA':"South Africa",
	'ZM':"Zambia",
	'ZW':"Zimbabwe",
	'ZZ':"Unknown",
}
//------------------------------------------------------------
// clash countries
// "AF", "AZ", "CL", "CN", "CR", "CU", "HK", "KE", "KH", "IL", "IQ", "IR", "KP", "KR", "LY", "NP", "PA", 
// "PH", "PK", "BD", "IN", "MX", "SD", "SN", "SO", "TW", "TZ", "UZ", "VN", "BD", "BR", "CO", "ID", "JP", "PK", "RU", "US"

module.exports = CountryDb;