//========================================================================

	const Tools 	= require('./tools');
	const DataProvider = require('./data-providers/dataprovider')

	//------------------------------------------------------------

	let _instances = {};	// id : instance

//========================================================================
class DataProviders  {

		#_waf;
	
		constructor( waf) {
			this.#_waf 	= waf;
		}

		//------------------------------------------------------------

		getIds() 			{ return Object.keys(_instances) }
		getProvider( id ) 	{ return _instances[id] || false }
		// find( opts={databaseId:false, traits:false, traitCover:'perfect|every|some'} ) { 
		// 	opts = opts || {};
		// 	opts.traitCover = opts.traitCover || 'every';	// taitCover na później
		// 	let res = opts.databaseId ? Object.values(_instances).filter( i => opts.databaseId == i.database.id ) : [];
		// 	res = res.concat(opts.traits ? Object.values( res.length ? res : _instances ).filter( i => i.hasAllTraits(opts.traits)) : []);
		// 	return Tools.removeDuplicates( res );
		// }
		registerProvider( dp ) {
			_instances[dp.id] = dp;
			return dp;
		}
		create( waf, config ) { 
			let dp = new DataProvider(waf, config)
			_instances[config.id] = dp;
			return dp;
		}
	
}
//========================================================================
module.exports = DataProviders;