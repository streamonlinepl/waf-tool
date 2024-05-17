//========================================================================

	const App 				= require('../../waf-app')
	const ParserResults 	= require('../parser-results')

//========================================================================



//========================================================================
class AFileParser {
	
	static get validExtensions() { return [] }

	constructor(file, opts={}, parserResults) {
		if (this.constructor.name == 'AFileParser') throw new Error(`"AFileParser" is an abstract class and cannot be instantiated!`)
		if (!parserResults) parserResults = new ParserResults();
		this._app = App.getInstance();
		this._opts = opts; 
		this._results = parserResults; 
	}

	waf() 			{ return this._app }

	get opts() 		{ return this._opts }
	get results() 	{ return this._results }
	//------------------------------------------------------------    
	// to override
	//--------------------

	async parse(file)   { throw new Error(`Method "parse()" not implemented in ${this.constructor.name}`) }

	//------------------------------------------------------------
	//------------------------------------------------------------
}
//========================================================================
module.exports = AFileParser