//========================================================================

	const _defOpts = {
        resetResult:true
	}

//========================================================================
class ALogic {

    constructor(wafApp) {
        if (this.constructor.name == 'ALogic') throw new Error(`"ALogic" is an abstract class and cannot be instantiated!`)
        this._wafApp = wafApp;    
        this.setListeners();
    }
	//--------------------	
    waf()               { return this._wafApp }
	db(id='master') 	{ return this._wafApp.getDb(id) }
    setListeners()		{ }
	get enabled() 		{ return true }
	//------------------------------------------------------------
	// to override
	//--------------------
    get id()            	{ return this.constructor.id }
    get name()          	{ throw new Error(`"name()" getter not implemented in ${this.constructor.name}`) }
    get traits()			{ throw new Error(`"traits()" getter not implemented in ${this.constructor.name}`) }
	get defaultOptions()	{ return _defOpts }
	
	payloadFilter(payload) 	{ return false }
	getOptions( opts ) 		{ return Object.assign( {}, this.defaultOptions, opts?opts:{} ) }

	async _run( payload, opts ) 	{ throw new Error(`"execute()" method not implemented in ${this.constructor.name}`) }	
	//------------------------------------------------------------
	async execute( payload, opts ) 	{ 
		opts = this.getOptions(opts);		
        if (payload) await this.setPayload( payload, opts.resetResult );
		this._results = await this._run( this._payload, opts );
		return this._results;
	}	
	//--------------------
	canExecute( traits ) {  		
		let props = Object.keys(this.traits);		
		let r= this.traits===true || props.every( p => (	
					this.traits[p] === true ||		
					this.traits[p] === traits[p] ||	
					(	
						Array.isArray(this.traits[p]) && 
						this.traits[p].includes(traits[p])
					)   
				))			

		console.log('  >',this.id,'> canExecute:',r);
		return r;
	}
	//--------------------
    async getResults() 	{ return this._results }
    async setPayload( payload, resetResults=true ) { 
		if (!Array.isArray(payload)) 
			throw new Error(`${this.constructor.name} setPayload : invalid type "${tyoeof(payload)}"`);

		if (resetResults) await this.reset();		
		if (this.payloadFilter)
			payload = payload.filter( this.payloadFilter );

		this._payload = payload;
		return this._payload;
	}    
	//--------------------
	async reset()   	{ 
		this._payload = [];
		this._results = [];
	}
	//------------------------------------------------------------
}
//========================================================================
module.exports = ALogic