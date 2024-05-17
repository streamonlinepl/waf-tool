//========================================================================

	const LineByLineReader  = require('line-by-line');	
	const AFileParser    	= require('./a-fileparser');
	const StringParser 		= require('./../string-parser');
	const Tools            	= require('./../../tools');
	const Const 			= require('../../waf-constants')
//------------------------------------------------------------
/*
	Plik tekstowy .txt
	------------------
	- oczekiwane dane powinny być umieszczone w nowej linii
	- każda linia jest trim'owana
	- usuwane są również znaki: ', ", [spacja], [tab]
*/
//========================================================================


	let _stringParser = false;

//========================================================================
class CFLogFileParser extends AFileParser {

	static get validExtensions() { return ['gz', 'cflog'] }
	
	//------------------------------------------------------------
	// constructor
	//--------------------
	
		constructor(file, opts, results) { 
			super(file, opts, results) 
		}

		get stringParser() {
			if (_stringParser) return _stringParser;
			_stringParser = require('./../string-parser');
			return _stringParser;
		}

	//------------------------------------------------------------
	// returns { params, files }
	parse(file) {
		return new Promise((resolve, reject)=>{
			
			const opts = this._opts||{};
			let rl = new LineByLineReader(file);
			let stringParser = new this.stringParser(this.opts, this.results);
			let counter = 0;

			rl.on('line', async(line) => {

				let o = false;
				let entry = false;
				try {
					o = JSON.parse( line );				
					switch( opts.preferableEntryType||Const.WAFEntryType.ASN ) {
						case Const.WAFEntryType.IP: case Const.WAFEntryType.CIDR: 
							entry = o.ClientIp || false;
							break;						
						case Const.WAFEntryType.ASN: default: 
							if (o.ClientASN) o.ClientASN = `AS${o.ClientASN}`;
							entry = o.ClientASN || o.ClientIp || false;
					}
						
					if (!entry) return;
						
					counter++;
					await stringParser.parse( entry );
					if (counter % 100 == 0) {
						this.results.optimise();
						console.log(`> CFLogParser > entries read so far: ${counter}`)
					}

				} catch(e) {
					console.log(`> CFLogParser > ParsingError >`,e);
					console.log(line);
				}				
			});
	
			rl.on('end', () => { 				
				this.results.optimise();
				console.log(`> ${this.constructor.name} > entires read: ${counter}`)
				resolve(this.results);
			});
			rl.on('error', (e) => {
				console.log(`> ${this.constructor.name} > parse ERROR`, e)
				reject(e);
			});    
		});    
	}
	//------------------------------------------------------------   
}
//========================================================================
module.exports = CFLogFileParser