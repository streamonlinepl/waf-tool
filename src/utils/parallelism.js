//========================================================================

	const _defaultConfig = {
		parallelism: 6,					// how many threads
		alwaysRunning:false,			// dont finish even if there is no input data - keep waiting for new data
		stopOnError:false,
		delayBeforeThreadReRun: 100,		// a delay between the finished and the starting thread job		
		intervalStatsUpdate: 1000,			// 		
		_version:0 						// config version - unused for now...
	}
	//------------------------------------------------------------
	const _state = {
		CREATING 	: 'creating',
		READY 		: 'ready',
		RUNNING 	: 'running',
		STOPPING	: 'stopping',
		STOPPED 	: 'stopped',
		WAITING 	: 'waiting',
		FINISHING	: 'finishing',
		FINISHED	: 'finished',
	}	

	const _actions = {
		START 		: 'START',
		PAUSE 		: 'PAUSE',
		FEED 		: 'FEED',
		TERMINATE	: 'TERMINATE',
	}

	const _onErrorBehaviour = {
		IGNORE 		: 'IGNORE',
		STOP 		: 'STOP',
		TERMINATE	: 'TERMINATE',
	}

	const _activeStates = [
		'running',
		'stopping',
		'waiting',
		'finishing',
	]	
	//------------------------------------------------------------
	const _stateTransitions = {
		'creating' 	: ['ready'],				
		'ready' 	: ['running'],
		'running' 	: ['stopping', 'waiting', 'finishing'],
		'waiting'	: ['stopping','running'],
		'stopping' 	: ['stopped'],
		'finishing'	: ['finished'],	
	}


	const _stateLogic = {
		'ready': async(states) => {
			if (this.#_stats.state != this.State.CREATING) return;
			this.#_stats.state = states.toState;
			this.emit(states.state, {fromState:states.fromState});
		},
		'running': {
			'ready':async(states) => {},
			'stopped':async(states) => {}			
		}
	}
	//------------------------------------------------------------
	const EventEmitter 		= require('events').EventEmitter;

class Parallelism extends EventEmitter {
//========================================================================
	
	#_threadSignals;
	#_config;
	#_stats;
	#_task;
	#_data;
	#_dataIterator;
	constructor(task, data=[], config=false) {
		super();
		console.log(`> Parallelism > constructor...`)
		this.#_task = task;
		this.#_data = data;
		this.#_stats = false;
		this.#_initiate( config );
	}
	//========================================================================
	// PRIVATE
	//------------------------------------------------------------	
	// INITIALIZATION
	//--------------------
			#_initiate(config) {
				console.log(`> Parallelism > initiate`);
				this.#_threadSignals = new EventEmitter();
				this.#_stats = { state:this.State.CREATING }
				this.setConfig(config);
				this.#_setEvents();
				this.#_threadSignals.emit( 'stateChange', {fromState})
				// this.#_setIntervalFor( this.#_statsUpdater, this.#_config.interval.statsUpdate )
			}
			//--------------------
			#_createStatsObject() {
				return {
					state: this.State.READY,
					dataDone: false,
					threadsMax: this.#_config.parallelism,
					threadIsRunning:{}, 					// { threadId:false|true,}
					threadsRunning:0,
					tasksDone:0,
					tasksDonePerc:0,
					tasksRemaining:0,
					timeStarted:0,
					timeDone:0,
				}
			}
			//------------------------------------------------------------
			#_setEvents() {
				//--------------------
				// threadRun
				this.#_threadSignals.on( 'threadRun', async(threadId) => { 
					this.#_stats.threadIsRunning[ threadId ] = true;
					try {
						await this.#_jobThread(threadId); 
						this.#_stats.tasksDone++;
						this.#_stats.threadIsRunning[ threadId ] = false;
						
						
						if (threadId<=this.#_config.parallelism) 
							setTimeout( ()=> { this.#_threadSignals.emit('threadRun',threadId) }, this.#_config.delayBeforeThreadReRun);
						else console.log(' > killing thread:', threadId);
						
					} catch(e) {
						console.log(e);
						console.log(' > thread crashed:', threadId);						
						this.#_stats.threadIsRunning[ threadId ] = false;
						this.#_threadSignals.emit( 'threadRun', threadId );
					}
				} )
				//--------------------
				// stateChange
				this.#_threadSignals.on( 'stateChange', async( states ) => { 
					await _stateLogic[ states.toState ].apply(this,[states]);
				} )
			}
			//------------------------------------------------------------
			async #_changeState( state ) 	{ 
				if(this.#_stats.state == state) 
					throw new Error(`ERROR: you cannot change the state to the current one (${this.#_stats.state})`)
					// return false;
				this.#_stateExists( state );
				let param = { fromState:this.#_stats.state, toState:state }				
				await _stateLogic[ state ].apply(this,[param]);
				
			}
			#_changeStateWait( state, waitForState ) {
				this.#_stateExists( waitForState );
				return new Promise(
					async (resolve, reject) => {
						this.#_threadSignals.once( waitForState, resolve);
						try {
							await this.#_changaState( state );														
						} catch (e) {
							this.#_threadSignals.removeListener( waitForState, resolve );
							reject(e)
						}

					}
				)
			}

		//------------------------------------------------------------
		// TIMER FUNCTIONS
		//--------------------						

			#_statsUpdater() {
				if (! (this.#_stats && this.#_stats.state && _activeStates.includes(this.#_stats.state))) return;
				
				this.#_stats.threadsRunning = 0;
				this.#_stats.threadsRunning = Object.values(this.#_stats.threadIsRunning).map( e => (e && this.#_stats.threadsRunning++, e));
				this.#_stats.tasksDonePerc  = 0;
				this.#_stats.tasksRemaining = this.#_data.length || 0;
				if (this.#_stats.tasksDone)
					this.#_stats.tasksDonePerc 	= parseFloat(this.#_stats.tasksDone/(this.#_stats.tasksDone+this.#_stats.tasksRemaining)).toFixed(2);

				this.emit('stats', Object.assign({},this.#_stats));
			}

		//------------------------------------------------------------
		// JOB RELATED
		//--------------------
			* #_dataGenerator() {		
				if (this.#_data.length)
					yield this.#_data.pop();					
				return false;
			}
			//--------------------
			async #_getJobData() {
				if (!this.#_dataIterator)
					this.#_dataIterator = this.#_dataGenerator();			
				return this.#_dataIterator.next();
			}
			//--------------------
			#_updateParallelism = () => {
				if (this.#_config.parallelism < 1) this.#_config.parallelism=1;
				for (let t=this.#_stats.threadsMax+1; t<=this.#_config.parallelism;t++)
					this.#_threadSignals.emit( 'threadRun', t );
				this.#_stats.threadsMax = this.#_config.parallelism;
			}
			//--------------------
			async #_jobThread( threadId ) {		
				let next = await this.#_getJobData();
				this.#_setDataDone( next.done );
				
				if (!next.done) 
					await this.#_task( next.value );
				
				
			}
		//------------------------------------------------------------
		// HELPERS
		//--------------------
			#_delay(time) { return new Promise( (resolve, reject) => { setTimeout( resolve, time ); } ) }
			//--------------------
			#_setIntervalFor ( func, interval ) {
				console.log(`> Parallelism > setIntervalFor: ${func.name}`)
				setTimeout( async () => {
					await func.apply(this);
					this.#_setIntervalFor( func, interval);
				}, interval)
			}
			//--------------------
			#_stateExists( state, validate=true ) {
				let e;
				if (e=Object.values(_state).includes( state ), !e && validate)
					throw new Error(`> ERROR: unknown state: ${state}`);
				return e;				
			}
			#_validateState( validStates ) {
				if (!this.#_stats || validStates.includes(this.#_stats.state)) return true;
				throw new Error(`Current State: ${this.#_stats.state} does not allow the action!`)
			}
			#_validateNextState( nextState ) {				
				if (this.#_stats && this.#_stats.state && (this.#_stats.state==nextState || _stateTransitions[ this.#_stats.state ].includes( nextState ))) return  true;
				throw new Error(`Current State: ${this.#_stats.state} does not allow transition to state: ${nextState}!`)
			}
		//------------------------------------------------------------
		// SETTERS / GETTERS
		//--------------------	
		
			
			
		

			#_setDataDone( done ) 	{ this.#_stats.dataDone = done }		
	
	//------------------------------------------------------------
	// PUBLIC
	///--------------------
	get State() { return _state }
	//--------------------
		//--------------------
		reset( config ) {
			console.log(`> Parallelism > reset`)
			this.#_validateState( [this.State.READY, this.State.STOPPED, this.State.FINISHED] )
			this.#_stats = this.#_createStatsObject();
			this.#_dataIterator = false;
			this.setConfig( config );
			this.#_data = [];
		}
		//--------------------
		async start( config, waitForState=false ) {
			this.setConfig( config );
			let waitFunc = () => {

			}
			if (waitForState)
			await this.#_changeState( this.State.RUNNING );
			
		}
		async startWait( config ) {
			this.setConfig( config );
			await this.#_changeStateWait( this.State.RUNNING, this.State.FINISHED );
		}
		//--------------------	
		async stop() {
			this.#_validateNextState( this.State.STOPPING );
			
		}
		//--------------------
		getConfig() { return Object.assign({},this.#_config) }
		setConfig(config) {
			console.log(`> Parallelism > setConfig`)
			// if (!config) return;
			// this.#_validateState( [this.State.READY] )
			this.#_config = Object.assign( _defaultConfig, this.#_config || {}, config||{} );			
			this.#_updateParallelism();
		}
		feed(data) {
			if (!Array.isArray(data))
				throw new Error('Parallelism > feed > ERROR: data is not an array!');
			console.log(`> Parallelism > feed >`)
			this.#_data = this.#_data.concat( data );
		}
		
		
	
}

//========================================================================
module.exports = Parallelism;




