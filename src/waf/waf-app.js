//--------------------------------------------------

	const { EventEmitter }  = require('events');

	const Platform      = require('./platform');
	const Commands      = require('./commands');
	const Databases     = require('./databases');
	const Datamodels    = require('./datamodels');
	const DataProvider  = require('./data-providers');
	const Logics        = require('./logics');
	const InputFiles    = require('./input-files');
	const Providers  	= require('./providers');
	const Deployer      = require('./deployer');
	const Tools     	= require('./tools');

	let __instance 		= false;

//--------------------------------------------------

	// not used yet
	const _events = {
		DB_LOAD     : "e_dbload",
		DB_LOADED   : "e_dblaoded",
		DB_SAVE     : "e_dbsave",
		DB_SAVED    : "e_dbsaved",
		DB_MAINTAIN : "e_dbmaintain",
		APP_START   : "app_start",
		APP_CLOSE   : "app_close",
	}

//==================================================
/*
		const databases = [
			countries,		// a/b
			ratelimiters,	// b
			logic-net, 		// (master) asn & nets a/b
			direct			// 
		]
*/
//==================================================
// COMMANDS:
//--------------------
/*
	IPs, ASNs, Netblocks:
	--------------------
	learn 			- analizuje zadane parametry pozwalając na input w postaci IP, ASNów czy ścieżek do pliku JSON
					- odpala wszystkie logiki, które automatycznie blokują całe ASNy i ich sieci (blockLogic)
					- w przypadku spornych danych dokonywana jest analiza domen poszczegółnych podsiecei ASNów
					- wynikiem działania jest baza: master, domains
	
			
	check			- (params)

	block-asn		- 
	unblock-asn		- 
	
	build 			- (params)
	deploy			- (params) część zasad stała -> allowed, ratelimited, countries(?)

	status 			- zwraca status bazy, liczbę rekordów
					- zwraca ilościowe zmiany powstałe od czasu ostatniego deploya

	block-direct 	- (params: IP, ASNy, pliki) blokuje zadae wpisy bez rozwiązywanie asnów i sieci 
					- weryfikuje czy nie ma ich w istniejącej bazie blokowanych
					- what you see is what is blocked
					- dodatkowy prop w db dla: blokowanych bezpośrednio ip i net

	[dodać] 		- inputfile: cloudflare log
	learn-folder 	- (params) działa tak jak learn, ale wyłącznie dla plików 
					- w param wskazywane są foldery, które zostaną przeszukane rekursywnie
	

	IPs:
	----
	ip-block 		- (params) blokuje zadane adresy IP na stałe
	ip-unblock 		- (params) odbkokowje zadane adresy IP 
	ip-block-temp	- (params) blokuje zadane adresy IP na 24h
	ip-unblock-temp - ....
	ip-list 		- (params) sprawdza czy zadane adresy są zablokowane
					- (brak params) listuje wszystkie zablokowane adresy


	COUNTRIES:
	----------
	country-block 	- blokuje zadane kraje (case insensitive), waliduje 
	country-unblock	- odblokowuje zadane kraje (case insensitive), waliduje
	country-list 	- (brak params) zwraca listę wszystkich zablokowanych krajów (kod : nazwa kraju)
					- (params) zwraca informacje, czy przekazane kraje są blokowane ('blocked', 'allowed'), pomija niepoprawne kody krajów

	RATE LIMITTERS:
	---------------
	ratelimitter-list 	- (brak params) zwraca wszystkie reguły rate limittera
						- na razie reguły limitera będą znajdować się w templatce, później -> db


*/
//========================================================================
class WafApp extends EventEmitter {

	static getInstance() {
		return __instance || (__instance=new WafApp()), __instance;
	}

	get Event()     { return _events }
	constructor() {        
		super();				
		this._platform      = Platform.platform;
		this._platformId    = Platform.platformId;
		this._dataProviders = new DataProvider(this);
		this._databases     = new Databases( this );
		this._datamodels    = new Datamodels( this );
		this._commands      = new Commands( this );
		this._inputFiles    = new InputFiles( this );
		this._logics        = new Logics( this );
		this._deployer      = new Deployer( this );
		this._providers  = new Providers( this );
	}

	get platform()  	{ return this._platform }
	get DataProviders()	{ return this._dataProviders }
	get platformId()	{ return this._platformId }
	get DBS()       	{ return this._databases }
	get Commands()  	{ return this._commands }
	get Logics()    	{ return this._logics }
	get Datamodels()	{ return this._datamodels }
	get Deployer()		{ return this._deployer }
	get InputFiles()	{ return this._inputFiles }
	get Providers()		{ return this._providers }

	
	//------------------------------------------------------------
	async start() {		
		await this.DBS.load();
		this.getDb().checkStats()
		let cmd = process.argv[3] ? process.argv[3].toLowerCase() : false;
						
		await this.executeCommand( cmd );		
		await this.DBS.save();
		await this.getStatus();	
		// this.getDb().checkStats(true);
	}
	//------------------------------------------------------------
	async deploy() {

	}
	//------------------------------------------------------------
	async executeCommand( cmd ) {		
		console.log('------------------------------------------------------------');
		console.log('> Command:', cmd.toUpperCase());
		let results = await this.Commands.executeCommand( cmd );
		this.showResults( results );
	}
	//--------------------
	async getStatus() {
		let statuses = this.DBS.getStatus();
		Object.keys(statuses).map( db => {
			statuses[db] = statuses[db].status
		})
		console.log('------------------------------------------------------------');
		console.log('> Databases:', JSON.stringify(statuses, null, 4));		
	}

	//------------------------------------------------------------
	// getClientDataFolder
	//------------------------------------------------------------
	// get AsnInfo[] by asn, ip, from file(asn, ip)
	async getAsnInfo( asn, opts={skipExisting:true} ) {
		return this.getDM('ASNInfo').getByAsn( asn, opts );
	}
	async getAsnInfoByIp( ip, opts={skipExisting:true} ) {
		if (!Array.isArray(ip)) ip = [ip];
		return this.getDM('ASNInfo').getByIp( ip, opts );
	}
	// async getAsnInfoByFile( file ) {
	// 	return this.getDM('ASNInfo').getByFile( file );
	// }
	//------------------------------------------------------------
	// db & datamodels
	getDb( id='master' ) 	{ return this.DBS.getDatabase( id ) }
	getDM( id ) 			{ return this.Datamodels.getDatamodel( id ) }
	//------------------------------------------------------------
	// logics
	async executeLogic( logicId, payload ) { await this.Logics.execute( logicId, payload ); }
	//------------------------------------------------------------
	// results
	showResults( results ) {
		if (!results) return;
		let d = Object.keys(results).reduce((acc,e)=>{
			acc[e] = results[e] ? (Array.isArray(results[e])?results[e].length : results[e]) : 0
			return acc;
		},{})
		console.log('> Results', JSON.stringify(d, null, 4));
	}

}
//========================================================================
module.exports = WafApp;