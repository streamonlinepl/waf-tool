//========================================================================
	
	const path 				= require('path');

	const App 	= require('../waf-app');
	const Tools = require('../tools')
	const Const = require('../waf-constants');

	const ParserResults 	= require('./parser-results')
	const FileParserFactory = require('./file-parser-factory')


//========================================================================
class StringParser {

	/*
		opts
			- parseFiles - ...
			- cidrToIp - zamienia cidr na ip
			- preferableEntryType - jeśli parser ma możliwość wyciągnięcia z wpisu asn,ip,cidr to wyciągnie wyłącznie asn
	*/
	constructor( opts={ parseFiles:true, cidrToIp:true, preferableEntryType:Const.WAFEntryType.ASN }, parserResults) {
		this._app = App.getInstance();
		if (!parserResults) parserResults = new ParserResults();
		this._opts = opts;
		this._results = parserResults;
	}

	get opts() { return this._opts }
	get results() { return this._results }

	async parse(line, opts) {
		
		if (!line) return this._results;
		if (opts) this._opts = Object.assign(this._opts, opts);
		line = line || "";
		line = line.trim();
		line = line.replace(/[\'\"]/gm, '');
		line = line.replace(/[\t,;]/gm, ' ');
		
		
		let entries = line.split(' ').filter(e=>e);
		// const newFiles = entries.filter( e => (Tools.isFileName(e)||(Tools.isDirName(e))) && !this.results.getEntriesByType(Const.WAFEntryType.FILE).includes(e) );
		let newFiles = entries.filter( e => (Tools.isFileName(e)||(Tools.isDirName(e))) ).map( e => path.resolve(e) ).filter( e => !this.results.getEntriesByType(Const.WAFEntryType.FILE).includes(e) );		
		// console.log('newFiles',newFiles)

		this._results.addEntry( Const.WAFEntryType.FILE, newFiles );
		this._results.addEntry( Const.WAFEntryType.ASN, entries.filter( e => Tools.isASN(e)) );
		this._results.addEntry( Const.WAFEntryType.CIDR, entries.filter( e => Tools.isCIDR(e)) );
		this._results.addEntry( Const.WAFEntryType.IP, entries.filter( e => Tools.isIP(e)) );
		this._results.addEntry( Const.WAFEntryType.IP, entries.filter( e => Tools.isCIDR(e) ).map( c => Tools.startIpAddress(c) ).filter( e => e ) )

		for (let file of newFiles) {
			const Parser = FileParserFactory.getParser( file, this._opts, this._results );
			if (!Parser) {
				this._results.addUnknownFile( file );
				continue;
			}
			await Parser.parse( file );
		}

		return this._results;	// ParserResults

	}


}
//========================================================================
module.exports = StringParser