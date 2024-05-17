//================================================

    const path      = require('path');
    const fs        = require('fs')

//================================================

	const _status = {
		OUT_OF_DATE		:'OUT_OF_DATE',
		OK				:'OK',
		ACTION_REQUIRED	:'ACTION_REQUIRED',
	}

//================================================
class ADb {

    static get Status() { return _status}

    constructor(wafApp) {
        if (this.constructor.name == 'ADb') throw new Error(`"ADb" is an abstract class and cannot be instantiated!`)
        this._wafApp = wafApp;
        this.createDataProviders();
        console.log(`> Database "${this.constructor.name}" created!`);        
    }
    //------------------------------------------------------------

    waf()                   { return this._wafApp;}
	getStatus()             { return true }
    createDataProviders()   { throw new Error(`"createDataProviders()" not implemented in ${this.constructor.name}`) }
    createDataProvider( id, config ) {
        config = Object.assign( { id, database:this, traits:[], filter:{} }, config );
        const DP = this.waf().DataProviders;
        DP.create( this.waf(), config );
    }
    get id()            { throw new Error(`"id" getter not implemented in ${this.constructor.name}`) }
    set data(v)         { throw new Error(`"data" setter not implemented in ${this.constructor.name}`) }
    get data()          { throw new Error(`"data" getter not implemented in ${this.constructor.name}`) }
    get template()      { throw new Error(`"template" getter not implemented in ${this.constructor.name}`) }
    get fileName()      { throw new Error(`"fileName" getter not implemented in ${this.constructor.name}`) }
    get fileDir()       { throw new Error(`"fileDir" getter not implemented in ${this.constructor.name}`) }
    get filePath()      { return path.join(this.fileDir, this.fileName) }
    //------------------------------------------------------------
    async load(forced=false) { 
        if ((!forced) && (this.data)) return;
        if (!fs.existsSync(this.filePath)) {
            this.data = Object.assign({},this.template);
            return this.save();
        }
        try {        
            this.data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
            console.log(`> db '${this.fileName}' loaded.`)
        } catch (ex) {
            console.log(ex);
            throw ex;
        }           
    }

    async maintain()    { throw new Error(`"maintain()" not implemented in ${this.constructor.name}`) }
    async save(forced=false) { 
        if (!this.data) return;
		if (!fs.existsSync(this.fileDir))
			fs.mkdirSync(this.fileDir, {recursive: true})
        fs.writeFileSync(this.filePath, JSON.stringify(this.data));
    }

}

module.exports = ADb;