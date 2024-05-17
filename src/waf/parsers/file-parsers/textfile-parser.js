//========================================================================

	const LineByLineReader  = require('line-by-line');	
	const AFileParser    	= require('./a-fileparser');
	const Tools            	= require('./../../tools');

//------------------------------------------------------------
/*
	Plik tekstowy .txt
	------------------
	- oczekiwane dane powinny być umieszczone w nowej linii
	- każda linia jest trim'owana
	- usuwane są również znaki: ', ", [spacja], [tab]
*/
let _stringParser = false;

//========================================================================
class TextFileParser extends AFileParser {

	static get validExtensions() { return ['txt'] }
	
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

			let rl = new LineByLineReader(file);
			let stringParser = new this.stringParser(this.opts, this.results);

			// let stringParser = new StringParser(this.opts, this.results);


			rl.on('line', async(line) => {
				// console.log('Line: ' + line);
				await stringParser.parse( line );
				// console.log('after line entries:',this.results.getEntries());
			});
	
			rl.on('end', () => { 
				// contents.params = Tools.removeDuplicates(contents.params);
				// contents.files  = Tools.removeDuplicates(contents.files);
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
module.exports = TextFileParser