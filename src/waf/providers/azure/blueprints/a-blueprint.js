//========================================================================



class ABlueprint {
//========================================================================
	
	#_waf;
	constructor(waf) {  this.#_waf = waf; }
	//------------------------------------------------------------

	get id() 			{ throw new Error(`Member "id" not implemented in ${this.constructor.name}`) }
	get rulesGroups() 	{ throw new Error(`Member "rulesGroups" not implemented in ${this.constructor.name}`) }
	
	createBaseTemplate() { throw new Error(`Member "createBaseTemplate" not implemented in ${this.constructor.name}`) }
	
	waf() { return this.#_waf };
	
}
//========================================================================
module.exports = ABlueprint;