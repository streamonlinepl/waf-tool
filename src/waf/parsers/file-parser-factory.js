//========================================================================

	const fs 				= require('fs');

	const FolderLoader      = require('./../../utils/folder-loader');
	const DirParser 		= require('./file-parsers/dir-parser');

	let _extMap 	= {}
	let _instance 	= false;

//========================================================================
class FileParserFactory {

	static getInstance() {
		if (_instance) return _instance;
		return new FileParserFactory();
	}

	constructor() {
		if (_instance) throw new Error(`FileParseFactory - use getInstance() instead of "new" keyword!`);
		_instance = this;

		this.loadParsers();
	}
	
	//------------------------------------------------------------

	loadParsers() {
		if (Object.keys(_extMap).length) return;
        let _loaded = {};
        let fl = new FolderLoader(`${process.cwd()}/src/waf/parsers/file-parsers`);
        fl.stripExt().exclude(['a-fileparser.js', 'dir-parser.js']).loadTo( _loaded );
        
        for (let dm of Object.keys(_loaded)) {
            let aclass    	= _loaded[dm];
			let exts 		= aclass.validExtensions;
			exts.forEach( x => {
				if (_extMap[x]) throw new Error(`> FileParser: Extension ${x} already assigned`);
				_extMap[x] = aclass;
			})
            
            console.log(`> FileParser "${aclass.name}" loaded!`)
    	}
	}


	//------------------------------------------------------------
	getParser(file, opts, results) {
		try {
			if(fs.statSync(file).isDirectory()) {
				console.log(`> getParser > DirParser set for: ${file}`)
				return new DirParser(file, opts, results);
			}
		} catch(e) {
			console.log(`> getParser error >`,e);
			return false;
		}
		let ext = file.substr(file.lastIndexOf('.')+1);
		ext = ext?ext.toLowerCase():false;
		const ParserClass = _extMap[ext];
		if (ParserClass)
			return new ParserClass(file, opts, results);
		return false;		
	}    
	
	//------------------------------------------------------------
}
//========================================================================
module.exports = FileParserFactory.getInstance();