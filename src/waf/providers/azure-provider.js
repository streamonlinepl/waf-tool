//========================================================================

    const AWAFProvider      = require('./a-provider');

    const WAFBuilder        = require('./azure/builder');
    
//========================================================================
class AzueProvider extends AWAFProvider {
    
    #_wafBuilder;  
    #_wafDeployer;
    
    constructor(wafApp) {
        super(wafApp)        
        this.#_wafBuilder   = new WAFBuilder(this);
        this.#_wafDeployer  = false //new WAFDeployer(this);        
    }
    //------------------------------------------------------------
    
    get id() { return 'Azure' }

    // buildWAFTemplate()  { return this.#_wafBuilder.buildTemplate(); }
    getWAFBuilder()     { return this.#_wafBuilder }
    getWAFDeployer()    { return this.#_wafDeployer}

}
//========================================================================
module.exports = AzueProvider