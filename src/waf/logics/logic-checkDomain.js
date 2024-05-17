//========================================================================

    const ALogic        = require('./a-logic');
	const Const 		= require('./../waf-constants');


	const _traits = {
        action: false,   // false - nie odpali się gdy określone jest action
        mode: [Const.WAFMode.LEARN]
    }

//========================================================================
class DomainsLogic extends ALogic {

    constructor(wafApp) {
        super(wafApp);
    }
    get id()                { return 'logicDomains' }
    get enabled()           { return false }
    get traits()           	{ return _traits }
    // setListeners()          { }

    DomainsLogicFilter( asnInfo ) { return asnInfo.type != "hosting" }
	//------------------------------------------------------------

    async _run( payload=false, resetResults=true ) {
        if (payload) await this.setPayload( payload, resetResults );
        
        let asns = this._payload.filter( this.DomainsLogicFilter );        
        asns = asns.filter( this.waf().getDb().notBlockedAsn );

		const ASNInfo = this.waf().getDM('ASNInfo');

		let domainsToCheck = [];
		for (let asn of asns) {
			const asnDomain = ASNInfo.asnGetDomain( asn );

			let rootEntry = {
				type:asn.type,
				size:asn.num_ips,
				name:asn.name,
				country:asn.country,
				domain: asnDomain,
				asn: asn.asn
			}
			domainsToCheck.push( rootEntry );

			let prefixes = [];
			if (asn.prefixes) prefixes = prefixes.concat(asn.prefixes.filter( p => p.domain != asnDomain ));
			if (asn.prefixes6) prefixes = prefixes.concat(asn.prefixes6.filter( p => p.domain != asnDomain ));

			prefixes.map(p=>{
				if (domainsToCheck.find(e => (e.domain == p.domain)&&(e.asn==rootEntry.asn))) return;
				let entry = {
					type:rootEntry.type,
					asn:rootEntry.asn,
					domain:p.domain,					
					country:p.country,
					size:parseInt(p.size),
					name:p.name,
					id:p.id,
				}
				domainsToCheck.push( entry );
			});
		}	

		const DomainDB = this.waf().getDb('domains');
		domainsToCheck = domainsToCheck.filter( DomainDB.hasNotDomain );
		await DomainDB.checkDomains( domainsToCheck, true );

        // await this.waf().getDb().blockAsn( asns );
        this._result = domainsToCheck;
        return domainsToCheck;
    }

}
//========================================================================
module.exports = DomainsLogic