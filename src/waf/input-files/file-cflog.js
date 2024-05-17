//========================================================================

	const LineByLineReader  = require('line-by-line');
	
	const AInputFileType    = require('./a-inf');
	const Tools             = require('./../tools')
//------------------------------------------------------------
/*
	Plik log cloudflare .gz
	------------------
	- oczekiwane dane powinny być umieszczone w nowej linii
	- każda linia to obiekt json	


Action ClientRequestHost ClientRequestMethod ClientRequestPath ClientIP ClientASN ClientASNDescription ClientIPClass ClientCountry ClientRequestUserAgent

{"Action":"allow","ClientIP":"207.46.13.43","ClientRequestHost":"highlive.tv","ClientRequestMethod":"GET","ClientRequestPath":"/css/chunk-07c94f30.a7fcd553.css",
	"ClientRequestQuery":"","Datetime":"2023-01-19T01:27:59Z","EdgeResponseStatus":200,"RayID":"78bbca84df8f30ad","ClientASN":8075,"ClientIPClass":"searchEngine",
	"ClientRefererHost":"","ClientCountry":"us","ClientASNDescription":"MICROSOFT-CORP-MSN-AS-BLOCK",
	"ClientRequestUserAgent":"Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"}

{"Action":"allow","ClientIP":"66.249.69.12","ClientRequestHost":"gromda.tv","ClientRequestMethod":"GET","ClientRequestPath":"/css/index.f96da7c1.css","ClientRequestQuery":"",
	"Datetime":"2023-05-31T01:09:08Z","EdgeResponseStatus":200,"RayID":"7cfb54654fc01135","Description":"","MatchIndex":0,"RuleID":"0c1aeda99168457e81fa6aa98b1e8453",
	"Source":"firewallrules","ClientASN":15169,"ClientASNDescription":"GOOGLE","ClientCountry":"us","ClientIPClass":"searchEngine","OriginatorRayID":"00",
	"ClientRefererHost":"gromda.tv","ClientRequestProtocol":"HTTP/1.1",
	"ClientRequestUserAgent":"Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/113.0.5672.126 Safari/537.36"}

{"Action":"allow","ClientIP":"168.119.65.112","ClientRequestHost":"famemma.tv","ClientRequestMethod":"GET","ClientRequestPath":"/js/0605f8895a81b7579a85.chunk-35b80151.js",
	"ClientRequestQuery":"","Datetime":"2023-04-06T00:31:49Z","EdgeResponseStatus":200,"RayID":"7b35ee20b81a9dab","Source":"firewallrules","ClientASN":24940,
	"ClientCountry":"de","ClientIPClass":"unknown","ClientRefererHost":"famemma.tv","ClientASNDescription":"HETZNER-AS",
	"ClientRequestUserAgent":"Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)"}

{"Action":"allow","ClientIP":"66.249.93.37","ClientRequestHost":"clashofthestars.tv","ClientRequestMethod":"GET","ClientRequestPath":"/","ClientRequestQuery":"",
	"Datetime":"2023-06-05T10:47:40Z","EdgeResponseStatus":200,"RayID":"7d27d6bf5a9d251a","Description":"","MatchIndex":0,"OriginatorRayID":"00",
	"RuleID":"709c869e378c4c0296a6277ad89ca0b5","Source":"firewallrules","ClientASN":15169,"ClientASNDescription":"GOOGLE","ClientCountry":"us","ClientIPClass":"searchEngine",
	"ClientRefererHost":"","ClientRequestProtocol":"HTTP/1.1",
	"ClientRequestUserAgent":"Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://support.google.com/webmasters/answer/1061943)"}

{"Action":"allow","ClientIP":"66.102.9.15","ClientRequestHost":"clashofthestars.tv","ClientRequestMethod":"GET","ClientRequestPath":"/fonts/SairaCondensed-Regular.ttf",
	"ClientRequestQuery":"","Datetime":"2023-06-05T10:47:33Z","EdgeResponseStatus":200,"RayID":"7d27d6946f7b15e0","Description":"","MatchIndex":0,"OriginatorRayID":"00",
	"RuleID":"709c869e378c4c0296a6277ad89ca0b5","Source":"firewallrules","ClientASN":15169,"ClientASNDescription":"GOOGLE","ClientCountry":"gb","ClientIPClass":"searchEngine",
	"ClientRefererHost":"clashofthestars.tv","ClientRequestProtocol":"HTTP/1.1",
	"ClientRequestUserAgent":"Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://support.google.com/webmasters/answer/1061943)"}


*/
//========================================================================
class CFLogInputFile extends AInputFileType {

	
	//------------------------------------------------------------
	// constructor
	//--------------------
	
		get id() { return "gz" }
		constructor(wafApp) { super(wafApp) }

	//------------------------------------------------------------
	// returns { params, files }
	parse(file) {
		return new Promise((resolve, reject)=>{
			let rl = new LineByLineReader(file);
			let contents = { params:[], files:[] };
			///--------------------
			rl.on('line', (line) => {
				
				line = line || "";

				if (!line) return;                    				
				try {
					line = JSON.parse(line);
				} catch(e){
					console.log(`> ERROR > CFLogInputFile > parse error:`, line);
					return;
				}

				switch(line.Action) {
					case 'allow': return;
					case 'block': 
					case 'managedchallengebypassed':
					case 'managedchallenge':
					default : break;
				}
				contents.params.push( line.ClientIP );				
			});
	
			rl.on('end', () => { 
				contents.params = Tools.removeDuplicates(contents.params);
				contents.files  = Tools.removeDuplicates(contents.files);
				resolve(contents);
			});
			rl.on('error', (e) => {
				app.logger.log(`> ${this.constructor.name} > parse ERROR`, e)
				reject(e);
			});    
		});    
	}
	//------------------------------------------------------------   
}
//========================================================================
module.exports = CFLogInputFile