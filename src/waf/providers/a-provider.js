//========================================================================


//========================================================================
class AWAFProvider {
    constructor(wafApp) {
        if (this.constructor.name == 'AWAFProvider') 
            throw new Error(`"AWAFProvider" is an abstract class and cannot be instantiated!`)
        this._wafApp = wafApp;    
    }
    waf()           { return this._wafApp }
    get id()        { throw new Error(`"id()" getter not implemented in ${this.constructor.name}`) }

    getServiceIds() { throw new Error(`method not implemented in ${this.constructor.name}`) }

    getWAFBuilder() { }
    getWAFDeployer()    { }




}
//========================================================================
module.exports = AWAFProvider