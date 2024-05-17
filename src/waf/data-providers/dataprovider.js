//========================================================================

	const Tools 	= require('../tools');

	//------------------------------------------------------------



//========================================================================
class DataProvider  {

	//------------------------------------------------------------
	// CONSTRUCTOR

		// _waf;
		// #_config;

		// #_validateConfig( c ) {
		// 	return c.id && c.database && Array.isArray(c.traits) 
		// 		&& c.methodName && c.database[c.methodName]
		// }

		constructor( waf, config ) {
			this._waf 		= waf;
			this._config 	= config;

			console.log('> DataProvider created:', config.id)			
		}

	//------------------------------------------------------------
	// GETTERS SETTERS

		get id() 		{ return this._config.id }
		get database() 	{ return this._config.database }
		get traits() 	{ return this._config.traits }	

	//------------------------------------------------------------
	waf() { return this._waf }
	//--------------------
	initialize() { }
	//--------------------
	fetch(opts=false) {		
		if (!opts) opts = this._config.filter;
		else opts = Object.assign(this._config.filter, opts);
		return this._config.database[this._config.methodName]( opts );
	}
	//--------------------
	// TRAITS

		hasPerfectTraits( traits ) 	{ return this.traits.length==traits.length && this.hasAllTraits( traits )  }
		hasAllTraits( traits ) 		{ return traits.every( e => traits[e]==this.traits[e] ); }
		hasSomeTraits( traits ) 	{ return traits.some( e => traits[e]==this.traits[e] ); }
	
	//------------------------------------------------------------
}
//========================================================================
module.exports = DataProvider;