//========================================================================

	/// unused at the moment
	const AsnType = {
		ISP: 'isp',
		EDUCATION:'education',
		BUSINESS:'business',
		HOSTING:'hosting'
	}
	/// unused at the moment
	const DefRuleActionForAsnType = {
		isp:'unblock',
		education:'unblock',
		business:'unblock',
		hosting:'block'
	}

	const AsnState = {
		ALLOWED:'allowed',
		UNBLOCKED:'unblocked',
		DISALLOWED:'disallowed',
		BLOCKED:'blocked'
	}

	const AsnStatePriorities = {
		allowed:5,
		unblocked:4,
		disallowed:3,
		blocked:2
	}

	const RuleAction = {
		BLOCK:'block',
		UNBLOCK:'unblock',
		ALLOW:'allow',
		DISALLOW:'disallow',
	}

	/// unused at the moment
	const RuleActionLevel = {
		ASN:'asn',
		NETBLOCK:'net',
		IP:'ip'
	}

	const WAFMode = {
		COMMAND : 'cmd',
		LEARN : 'learn',
		CHECK : 'check',
	}

	const WAFEntryType = {
		IP 		: 'ip',
		CIDR  	: 'cidr',
		ASN 	: 'asn',
		FILE 	: 'file'
	}


	const AsnStatesList = Object.values(AsnState);
	const RuleActionList = Object.values(RuleAction);
	const WAFEntryTypeList = Object.values(WAFEntryType);

//========================================================================
module.exports = {
	AsnType,
	AsnState,
	AsnStatePriorities,
	AsnStatesList,
	RuleAction,
	WAFMode,
	WAFEntryType,

	DefRuleActionForAsnType,

	AsnStatesList,
	RuleActionList,
	WAFEntryTypeList,
}



// let input 		= Input.getInstance( data );
// let rawEntries 	= await input.getRawEntries(); // { asn, ip, cidr, file }
// let entries 	= await input.resolve(); // { asn, ip }

// ASNInfo.

// CMD_WAF_RULE
// 	action
// 	params

// const traits = Tools.getTraitsObject( { mode:Const.WAFMode.COMMAND, action } )

