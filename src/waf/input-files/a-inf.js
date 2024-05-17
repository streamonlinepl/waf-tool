//========================================================================


//========================================================================
class AInputFileType {
	
	waf()       { return this._wafApp }

	constructor(wafApp) {
		if (this.constructor.name == 'AInputFileType') throw new Error(`"AInputFileType" is an abstract class and cannot be instantiated!`)
		this._wafApp        = wafApp;    
	}
	//------------------------------------------------------------    
	// to override
	//--------------------

		get id()                    { throw new Error(`"id()" getter not implemented in ${this.constructor.name}`) }
		async parse(file)   { throw new Error(`Method "parse()" not implemented in ${this.constructor.name}`) }

	//------------------------------------------------------------
	async resolve(file) {
		let contents = { params:[], files:[] }
		if (!this.isValidFile(file)) return contents;
		
		contents = await this.parse(file);
		return contents;
	}    

	//------------------------------------------------------------
	isValidFile( file ) {
		let ext = file.substr(file.lastIndexOf('.')+1);
		ext = ext?ext.toLowerCase():false;
		return ext == this.id;
	}
	//------------------------------------------------------------
}
//========================================================================
module.exports = AInputFileType