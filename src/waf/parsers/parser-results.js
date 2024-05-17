//========================================================================

	const App 	= require('../waf-app');
	const Const = require('../waf-constants');
	const Tools = require('../tools');

//========================================================================
class ParserResults {
	constructor(){
		this._app = App.getInstance();
		this._entries={}
		this._unknownFiles=[]
	}

	addEntry( type, entries ) {
		if (!entries) return this;
		if (!Array.isArray(entries)) entries=[entries];
		if (!this._entries[type]) this._entries[type]=[];
		this._entries[type] = this._entries[type].concat( entries );
		return this;
	}

	addUnknownFile( file ) {
		this._unknownFiles.push( file );
	}	

	getEntriesByType( type ) {
		return this._entries[type] || [];
	}
	getEntries() { return this._entries }

	//------------------------------------------------------------
	optimise() {
		const types = Const.WAFEntryTypeList;
		for (let t of types) {
			if (!this._entries[t]) continue;
			this._entries[t] = Tools.removeDuplicates( this._entries[t] );
		}
		return this;
	}
	//------------------------------------------------------------
	async populateToAsnInfo( opts, types=['ip', 'asn'] ) {
        const ASNInfo = this._app.getDM('ASNInfo');

		let asninfos = await ASNInfo.getByEntries( this.getEntries(), opts )
        asninfos  = ASNInfo.optimiseCollection( asninfos );

		return asninfos;
	}

}
//========================================================================
module.exports = ParserResults