//========================================================================

    const FolderLoader      = require('../utils/folder-loader');

//========================================================================

    let _datamodels    = false

//========================================================================

class Datamodels {
     constructor(wafApp) {
        this._wafApp = wafApp;
        this.loadDatamodels();
    }
    waf()       { return this._wafApp }
    getIds()    { return Object.keys(_datamodels) }

    //------------------------------------------------------------
    
    loadDatamodels() {
        if (_datamodels) return;
        _datamodels = {}
        let fl = new FolderLoader(`${process.cwd()}/src/waf/datamodels`);
        fl.stripExt().exclude('a-dm.js').loadTo( _datamodels );
        
        for (let dm of Object.keys(_datamodels)) {
            let aclass      = _datamodels[dm];
            let dmObj       = new aclass(this.waf());
            delete _datamodels[dm];
            _datamodels[dmObj.constructor.name]    = dmObj;
            console.log(`> Datamodel "${dmObj.constructor.name}" loaded!`)
    }
    }
    //------------------------------------------------------------
    getDatamodel(id)      { return _datamodels[id] }
    //------------------------------------------------------------
  
}

//==========================================================
module.exports = Datamodels;