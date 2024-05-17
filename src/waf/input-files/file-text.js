//========================================================================

	const LineByLineReader  = require('line-by-line');
	
	const AInputFileType    = require('./a-inf');
	const Tools             = require('./../tools')
//------------------------------------------------------------
/*
	Plik tekstowy .txt
	------------------
	- oczekiwane dane powinny być umieszczone w nowej linii
	- każda linia jest trim'owana
	- usuwane są również znaki: ', ", [spacja], [tab]
*/
//========================================================================
class TextInputFile extends AInputFileType {

	
	//------------------------------------------------------------
	// constructor
	//--------------------
	
		get id() { return "txt" }
		constructor(wafApp) { super(wafApp) }

	//------------------------------------------------------------
	// returns { params, files }
	parse(file) {
		return new Promise((resolve, reject)=>{

			let rl = new LineByLineReader(file);
			let contents = { params:[], files:[] };
	
			rl.on('line', (line) => {
				// console.log('Line: ' + line);
				line = line || "";
				line = line.trim();
				line = line.replace(/[\'\"]/gm, '');
				line = line.replace(/[\t,;]/gm, ' ');
				if (!line) return;                    

				let params = line.split(' ').filter(e=>e);
				
				// cidry na adres ip
				let ipsFromCIDR = params.filter( e => Tools.isCIDR(e)).map( c => Tools.startIpAddress(c) ).filter( e => e );
				
				contents.files = contents.files.concat( params.filter( e => Tools.isFileName(e) ) );
				contents.params = contents.params.concat( ipsFromCIDR, params.filter( e => (Tools.isASN(e) || Tools.isIP(e))) );

				// for (let c of lines) {
				// 	if (Tools.isFileName(c)) contents.files.push(c)
				// 	else contents.params.push(c);
				// }

			});
	
			rl.on('end', () => { 
				contents.params = Tools.removeDuplicates(contents.params);
				contents.files  = Tools.removeDuplicates(contents.files);
				resolve(contents);
			});
			rl.on('error', (e) => {
				app.logger.log(`> ${this.constructor.name} > parse ERROR`, e)
				reject(e);
			});    
		});    
	}
	//------------------------------------------------------------   
}
//========================================================================
module.exports = TextInputFile