//========================================================================

    const FolderLoader      = require('../utils/folder-loader');

//========================================================================

    let _wafProviders    = false

//========================================================================

class WAFProviders {
     constructor(wafApp) {
        this._wafApp = wafApp;
        this.loadWAFProviders();
    }
    waf()       { return this._wafApp }
    getIds()    { return Object.keys(_wafProviders) }

    //------------------------------------------------------------
    
    loadWAFProviders() {
        if (_wafProviders) return;
        _wafProviders = {}
        let fl = new FolderLoader(`${process.cwd()}/src/waf/providers`);
        fl.stripExt().exclude('a-provider.js').loadTo( _wafProviders );
        
        for (let cmd of Object.keys(_wafProviders)) {
            let Class               = _wafProviders[cmd];
            let cmdObj              = new Class(this.waf());
            delete _wafProviders[cmd];
            _wafProviders[cmdObj.id]    = cmdObj;
            console.log(`> Provider "${cmdObj.id}" loaded!`)
        }
    }
    //------------------------------------------------------------
    getProvider(id)      { return _wafProviders[id] }    
    //------------------------------------------------------------
}
//==========================================================
module.exports = WAFProviders;