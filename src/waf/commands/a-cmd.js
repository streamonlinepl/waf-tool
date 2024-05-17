//========================================================================


//========================================================================
class ACommand {
    constructor(wafApp) {
        if (this.constructor.name == 'ACommand') throw new Error(`"ACommand" is an abstract class and cannot be instantiated!`)
        this._wafApp        = wafApp;    
        this._params        = this.getArgvParams();
    }
    get id()            { throw new Error(`"id()" getter not implemented in ${this.constructor.name}`) }
    get cmdArgvIndex()  { return 3 }

    waf() { return this._wafApp }

    getArgvParams() {
        if (this._params) return this._params;
        this._params = [];
        process.argv.forEach((v,i)=>{
            if (i<=this.cmdArgvIndex) return;
            this._params.push(v)
        })
        return this._params;
    }

    async execute(params) {
        throw new Error(`"execute()" method not implemented in ${this.constructor.name}`)
    }

    async execute(params) {
        throw new Error(`"execute()" method not implemented in ${this.constructor.name}`)
    }


}
//========================================================================
module.exports = ACommand