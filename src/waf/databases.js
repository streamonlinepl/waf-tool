//========================================================================

    const FL        = require('./../utils/folder-loader')

//========================================================================

    let _databases = false;

//------------------------------------------------------------

class Databases {

    constructor(wafApp) {
        this._wafApp = wafApp;
        this.loadDatabaseClasses();
    }

    waf()   { return this._wafApp }

    loadDatabaseClasses() {
        if (_databases) return;
        _databases = {};
    
        let fl = new FL(`${process.cwd()}/src/waf/databases`);

        fl.stripExt().exclude('a-db.js').loadTo( _databases );
        for (let dbId of Object.keys(_databases)) {
            let aclass = _databases[dbId];
            _databases[dbId] = new aclass(this.waf());                
        }
    }

    async load() { Object.values(_databases).forEach(async(d)=>{ await d.load() }) }
    async save() { Object.values(_databases).forEach(async(d)=>{ await d.save() }) }

	getStatus() {
		let status = {};
		Object.values(_databases).forEach((d)=>{ status[d.constructor.name] = d.getStatus() })
		return status;
	}

    getDatabase( id ) {
        if (!_databases) this.loadDatabaseClasses();
        return _databases[ id ];
    }
    getIds() { return Object.keys(_databases) }

}
//========================================================================

module.exports = Databases