//========================================================================

	const ARulesGroup 	= require('./a-rulesgroup')

//========================================================================
class WhiteRules extends ARulesGroup {

	constructor(waf) {  super(waf) }
	//------------------------------------------------------------
	
	get id() 			{ return 'white-rules' }
	get priorityFrom() 	{ return 100 }
	get priorityIncr()	{ return 10 }
		
	//------------------------------------------------------------
	createRules() {
		return [		
			{
				name:"AllowPaymentGateways",
				enabledState:"Enabled",
				ruleType:"MatchRule",
				action:"Allow",
				rateLimitDurationInMinutes: 1,
				rateLimitThreshold: 60,
				matchConditions:[
					{
						operator: "IPMatch",
						matchVariable: "SocketAddr",
						negateCondition: false,
						transforms: [],
										
						_values:[
							//payu,volt
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
							"185.68.14.28",
							"34.250.66.65",
							"54.171.248.86",
							//apple
							"17.0.0.0/8",
							//hotpay
							"35.159.7.168",
							"18.197.55.26",
							"3.126.108.86",
							"3.64.128.101",
							"18.184.99.42",
							"3.72.152.155",											
							//stripe payskin
							"212.180.228.135",
							"212.180.229.6",
							"34.116.134.77",
							"54.187.174.169",
							"54.187.205.235",
							"54.187.216.72",
							"54.241.31.102",
							"54.241.31.99",
							"54.241.34.107",
							//paypal
							"151.101.1.21/32",
							"151.101.1.35/32",
							"151.101.129.21/32",
							"151.101.129.35/32",
							"151.101.130.133/32",
							"151.101.193.21/32",
							"151.101.193.35/32",
							"151.101.194.133/32",
							"151.101.2.133/32",
							"151.101.65.21/32",
							"151.101.65.35/32",
							"151.101.66.133/32",
							"159.242.240.0/21",
							"173.0.80.0/20",
							"184.105.254.0/24",
							"185.177.52.0/22",
							"198.199.247.0/24",
							"198.54.216.0/23",
							"204.109.13.0/24",
							"205.189.102.0/24",
							"205.189.103.0/24",
							"208.76.140.0/22",
							"64.4.240.0/21",
							"64.4.248.0/22",
							"66.211.168.0/22",
							"91.243.72.0/23",
						],
					}
				]
			},
			{
				name: "allowPaths",
				enabledState: "Enabled",
				action: "Allow",
				ruleType: "MatchRule",
				rateLimitDurationInMinutes: 1,
				rateLimitThreshold: 100,
				matchConditions: [
					{
						matchVariable: "RequestUri",
						operator: "Contains",
						negateCondition: false,
						transforms: [ "Lowercase" ],
						
						_values: [
							"transactions/kangapay/notify",
						],
					}
				],
			},
			{
				name: "allowKunaUptime",
				enabledState: "Enabled",
				action: "Allow",
				ruleType: "MatchRule",
				rateLimitDurationInMinutes: 1,
				rateLimitThreshold: 100,
				matchConditions: [				
					{
						matchVariable: "RequestHeader",
						selector: "User-Agent",
						operator: "BeginsWith",
						negateCondition: false,
						transforms: [ ],
						
						_values: [
							"Uptime-Kuma/"
						],
					},
					{
						matchVariable: "RequestHeader",
						selector: "X-KunaUptime-Token",
						operator: "Equals",
						negateCondition: false,
						transforms: [ ],
						
						_values: [
							"ed9b83fd-29d5-4ec7-90f6-d9ddff958ed5"
						],
					},
					{
						matchVariable: "RequestUri",
						operator: "Equal",
						negateCondition: false,
						transforms: [ ],
						
						_values: [
							"https://api.famemma.tv:443/hp",
							"https://api.famemma.tv/hp"
						],
					}
				],
			},
			{
				name: "BlockRoot",
				enabledState: "Enabled",
				action: "Block",
				ruleType: "MatchRule",
				rateLimitDurationInMinutes: 1,
				rateLimitThreshold: 100,
				matchConditions: [
					{
						matchVariable: "RequestUri",
						operator: "Equal",
						negateCondition: false,
						transforms: [ "Lowercase" ],
						
						_values: [
							// "/",
							// "api.famemma.tv",
							// "https://api.famemma.tv",
							// "https://api.famemma.tv/",
							"/",
							"[parameters('platformApiHost')]",
							"[concat('https://',parameters('platformApiHost'))]",
							"[concat('https://',parameters('platformApiHost'),'/')]"									
						],
					}
				],
			},
			{
				name:"BlockIPs",
				enabledState:"Enabled",
				ruleType:"MatchRule",
				action:"Block",
				rateLimitDurationInMinutes: 1,
				rateLimitThreshold: 60,
				matchConditions:[
					{
						operator: "IPMatch",
						matchVariable: "SocketAddr",
						negateCondition: false,
						transforms: [],
										
						_values:[ "78.31.150.155",
						"87.205.233.54",
						"143.178.240.171",
						"82.24.234.167",
						"83.22.119.120",
						"194.110.85.0/24",
						"195.46.36.227",
						"212.237.128.0/20",
						"31.11.128.84",
						"109.125.246.215",
						"31.11.129.89",
						"93.105.96.239",
						"37.248.160.182",
						"5.173.11.172",
						"2a01:116f:61b:2600:a0b:3bc9:7b01:e88b",
						"2a00:23c8:751a:4701:c4d0:ba5d:9800:d1f8",
						"2a02:a315:443d:3400:4de4:2cc2:35a2:4624",
						"2a00:f41:1cf6:c03:4d3a:f3ce:fbfb:cbb5",
						"2003:e7:e73a:2e79:5b5:801e:59bc:80c0",
						"2a02:a315:423c:6900:919a:b603:bb72:c126",
						"194.181.242.199",
						"46.22.161.226"]
					}
				]
			}
		]
	}
	//------------------------------------------------------------
	
}
//========================================================================
module.exports = WhiteRules;

