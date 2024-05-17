//========================================================================

    const FL        = require('./../utils/folder-loader')

//========================================================================

    let _logics 	= false;
    let _logicIds 	= [];
//========================================================================
class Logics {

    constructor(wafApp) {
        this._wafApp = wafApp;
        this.loadLogics();
    }
    waf()       { return this._wafApp }

    loadLogics() {
        if (_logics) return;
        _logics = {};
    
        let fl = new FL(`${process.cwd()}/src/waf/logics`);

        fl.stripExt().exclude('a-logic.js').loadTo( _logics );
        for (let lid of Object.keys(_logics)) {
            let Class  = _logics[lid];
            let logic = new Class(this.waf());
			if (logic.enabled === false) {
				delete _logics[lid];
				continue;
			}
            _logics[logic.id] = logic;
			console.log(`> Logic "${logic.id}" loaded!`)
			_logicIds.push(logic.id);
        }
    }

    async executeCollection( logics, payload ) {
        let res = {}
        console.log('> Logics - executing collection...', logics.map( l => l.id ))
        for (let l of logics) {
            res[l.id] = await l.execute(payload);
			console.log(`\t..."${l.id}" executed!`);
        }
        return res;
    }

    async execute( logicId, payload ) {
        return this.getLogic(logicId).execute(payload);
    }
    
    async executeAll( payload, ids=false ) {
        let res = {};
        if (!ids) ids=this.getIds();
        console.log('> Logics - executing all...')
        
        for (let lid of ids) {
            res[lid] = await this.getLogic(lid).execute(payload);
			console.log(`\t..."${lid}" executed!`);
        }
        return res;
    }

    getLogicsFor( traits ) {
        if (!_logics) this.loadLogics();
        console.log(`> getLogicsFor traits`, traits)
        let lr = [];
        return Object.values(_logicIds).forEach( lid => {
			let logic = this.getLogic( lid );
            if (logic && logic.canExecute(traits)) 
                lr.push(logic);            
        }), lr
    }

    getLogic( id ) {
        if (!_logics) this.loadLogics();
        return _logics[ id ];
    }
    getIds() { return _logicIds }

}
//========================================================================

module.exports = Logics