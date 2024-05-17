//========================================================================
// Resource	Standard tier limit	Premium tier limit
// Maximum profiles per subscription	500	500
// Maximum endpoint per profile	10	25
// Maximum custom domain per profile	100	500
// Maximum origin groups per profile	100	200
// Maximum origins per profile	100	200
// Maximum origin timeout	16 - 240 secs	16 - 240 secs
// Maximum routes per profile	100	200
// Maximum rule set per profile	100	200
// Maximum rules per route	100	100
// Path patterns to match for a routing rule	25	50
// URLs in a single cache purge call	100	100
// Web Application Firewall (WAF) policy per subscription	100	100
// WAF custom rules per policy	100	100
// WAF match conditions per custom rule	10	10
// WAF custom regex rules per policy	5	5
// WAF IP address ranges per match conditions	600	600
// WAF string match values per match condition	10	10
// WAF string match value length	256	256
// WAF POST body parameter name length	256	256
// WAF HTTP header name length	256	256
// WAF cookie name length	256	256
// WAF exclusion per policy	100	100
// WAF HTTP request body size inspected	128 KB	128 KB
// WAF custom response body length	32 KB	32 KB
//========================================================================

	class GenericRule {

		get ruleType()

	}



	const ruleType = [ 'MatchRule', "RateLimiter" ];






	const _ruleType = {
		MATCH_RULE 			: 'MatchRule',
		RATE_LIMIT_RULE 	: 'RateLimitRule',
	}

	const _matchVariable = {
		REQUEST_URI 		: 'RequestUri',
		REMOTE_ADDRESS 		: 'RemoteAddr',
		REQUEST_METHOD 		: 'RequestMethod',
		QUERY_STRING		: 'QueryString',
		POST_ARGS 			: 'PostArgs',
		REQUEST_HEADER		: 'RequestHeader',
		REQUEST_BODY		: 'RequestBody',
		COOKIES 			: 'Cookies',
	}

	const _requestMethods = {
		GET			:"GET",
		POST		:"POST",
		PUT			:"PUT",
		HEAD		:"HEAD",
		DELETE		:"DELETE",
		LOCK		:"LOCK",
		UNLOCK		:"UNLOCK",
		PROFILE		:"PROFILE",
		OPTIONS		:"OPTIONS",
		PROPFIND	:"PROPFIND",
		PROPPATCH	:"PROPPATCH",
		MKCOL		:"MKCOL",
		COPY		:"COPY",
		MOVE		:"MOVE",
		PATCH		:"PATCH",
		CONNECT		:"CONNECT",
	}

	const _matchOperator = {

		String: [ 'Any', 'Equal', 'Contains', 'BeginsWith', 'EndsWith', 'RegExp' ],
		GeoMatch: [ '' ],
		
		

		IP_MATCH 			: 'IPMatch',
		GEO_MATCH 			: 'GeoMatch',
		CONTAINS 			: 'Contains',
		EQUAL 				: 'Equal', 
		// Any - is often used to define default action if no rules are matched. Any is a match all operator.
		// Equal
		// Contains
		// LessThan: size constraint
		// GreaterThan: size constraint
		// LessThanOrEqual: size constraint
		// GreaterThanOrEqual: size constraint
		// BeginsWith
		// EndsWith
		// Regex
	}

	const _ruleEntryLimit = {
		RATE_LIMIT_RULE 	: 10,
		MATCH_RULE 			: 600,
	}

	const _matchTransforms = {
		LOWERCASE 	: 'Lowercase',
		UPPERCASE 	: 'Uppercase',		
		TRIM		: 'Trim',
		REMOVE_NULLS: 'RemoveNulls',
		URL_DECODE 	: 'UrlDecode',
		URL_ENCODE 	: 'UrlEncode',
	}
	
	const _ruleAction = {
		ALLOW 		: 'Allow',
		BLOCK 		: 'Block',
		REDIRECT 	: 'Redirect',
		LOG 		: 'Log',
	}

//========================================================================
class AAzureRule  {

	constructor(waf) {
		this._waf = waf;
		this._rules = [];
	}
	
	waf() { return this._waf }
	
	get RuleType() 			{ return _ruleType }
	get MatchVariable() 	{ return _matchVariable }
	get MatchOperator() 	{ return _matchOperator }
	get MatchTransforms() 	{ return _matchTransforms }
	get RuleMaxSize() 		{ return _ruleEntryLimit }
	get RuleAction() 		{ return _ruleAction }
	
	get ruleType() 			{ throw new Error(`${this.constructor.name}: missing "ruleType" getter!`)}
	get matchVariable() 	{ throw new Error(`${this.constructor.name}: missing "matchVariable" getter!`)}
	get matchOperator() 	{ throw new Error(`${this.constructor.name}: missing "matchOperator" getter!`)}
	get matchTransforms() 	{ throw new Error(`${this.constructor.name}: missing "matchTransforms" getter!`)}
	get maxSize() 			{ throw new Error(`${this.constructor.name}: missing "maxSize" getter!`)}


	template() {
		return {
			"name": "allowPayUServers",
			"enabledState": "Enabled",
			"priority": 20,
			"ruleType": "MatchRule",
			"rateLimitDurationInMinutes": 1,
			"rateLimitThreshold": 100,
			"matchConditions": [
				{
					"matchVariable": "RemoteAddr",
					"operator": "IPMatch",
					"negateCondition": false,
					"matchValue": [
						"185.68.12.10",
						"185.68.12.11",
						"185.68.12.12",
						"185.68.12.26",
						"185.68.12.27",
						"185.68.12.28",
						"185.68.14.10",
						"185.68.14.11",
						"185.68.14.12",
						"185.68.14.26",
						"185.68.14.27",
						"185.68.14.28"
					],
					"transforms": []
				}
			],
			"action": "Allow"
		}
	}	

	createRule( ruleOpts ) {

	}



}
//========================================================================
module.exports = AAzureRule