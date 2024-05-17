//========================================================================

	const fs 				= require('fs');
	const path 				= require('path');

	const AFileParser    	= require('./a-fileparser');
	const Tools            	= require('./../../tools');
	const Const            	= require('./../../waf-constants');

//------------------------------------------------------------
/*
	Plik tekstowy .txt
	------------------
	- oczekiwane dane powinny być umieszczone w nowej linii
	- każda linia jest trim'owana
	- usuwane są również znaki: ', ", [spacja], [tab]
*/
//========================================================================
class DirParser extends AFileParser {

	static get validExtensions() { return ['dir'] }
	
	//------------------------------------------------------------
	// constructor
	//--------------------
	
		constructor(file, opts, results) { 
			super(file, opts, results) 
		}

	//------------------------------------------------------------
	// returns { params, files }
	async parse(dir) {
		try {
			
			if (!fs.statSync(dir).isDirectory()) {
				console.log(`> DirParser > Warning > No folder found in: ${dir}`);
				return this._results;
			} 
			let counter = 0;
			let files = this.getFileList(dir);
			this._results.addEntry( Const.WAFEntryType.FILE, files );
			console.log(`> dir parser > files`, files)
			console.log(`> DirParser > found files: ${files.length}`);

			for (let file of files) {
				
				counter++;
				const Parser = this.fileParserFactory.getParser( file, this._opts, this._results );
				if (!Parser) {
					this._results.addUnknownFile( file );
					continue;
				}
				console.log(`> ${Parser.constructor.name} > ${file} (${counter} / ${files.length})`)
				await Parser.parse( file );
			}	
			return this._results;	// ParserResults

		} catch (err) {
			console.log(`> DirParser > ERROR >`,err);				
		}
		
		return this._results;
	}

	get fileParserFactory() { 
		let f = require('./../file-parser-factory');
		return f;
	}

	getFileList(dir, opts={recursive:false}, files = []) {		
		const fileList = fs.readdirSync(dir);		
		for (const file of fileList) {
			const name = path.resolve(`${dir}/${file}`);		  
		  	try {
				if (fs.statSync(name).isDirectory()) {
					if (opts.recursive)
						this.getFileList(name, opts, files);
				} else {			
					files.push( path.resolve(name) );
				}
			} catch(e) {
				console.log(`> getFileList error >`,e)
			}
		}
		return files;
	  }

	//------------------------------------------------------------   
}
//========================================================================
module.exports = DirParser