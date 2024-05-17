//========================================================================


//========================================================================
class ADataModel {

     constructor(wafApp) {
        if (this.constructor.name == 'ADataModel') throw new Error(`"ADataModel" is an abstract class and cannot be instantiated!`)
        this._wafApp        = wafApp;    
    }
    waf() { return this._wafApp }

    optimiseCollection( objs ) {}
   
}
//========================================================================
module.exports = ADataModel;