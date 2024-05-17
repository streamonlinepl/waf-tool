//==============================================================

	const net 						= require('net');
	const cidr  					= require('cidr-tools');
	const ipCidr  					= require('ip-cidr');
	const { Address4, Address6 } 	= require('ip-address');

	const Const 					= require('./waf-constants')

//------------------------------------------------------------
// helpers
//--------------------

	const _ipAddressGetVer = (ver) => ver=4?Address4:(ver==6?Address6:false);

//==============================================================

	const isIPv4 		= ( entry )	=> { return net.isIPv4( entry ); }
	const isIPv6 		= ( entry )	=> { return net.isIPv6( entry ); }
	const isIP 			= ( entry )	=> { return net.isIP( entry ); }
	const isASN 		= ( entry )	=> { return (/as\d{4,8}$/i).test(entry) }
	const isFileName	= ( entry )	=> { return (/^[\w,\s-]+\.[A-Za-z]{2,4}$/i).test(entry) }
	const isDirName		= ( entry )	=> { return (/[\w,\s-]+\/$/i).test(entry) }
	
	// cidrs --------------------	
	const isCIDR 		= ( entry ) => ipCidr.isValidCIDR(entry)	
	const isCIDRv4 = ( entry ) => { 
		const ipv4 = entry.split('/')[0];
		const pfxLen = parseInt(entry.split('/')[1]);
		if (!isIPv4(ipv4) || isNaN(pfxLen) || pfxLen < 1 || pfxLen > 32) 
			return false;		
		return true;	
	}
	const isCIDRv6 = ( entry ) => { 
		const ipv6 = entry.split('/')[0];
		const pfxLen = parseInt(entry.split('/')[1]);		
		if (!isIPv6(ipv6) || isNaN(pfxLen) || pfxLen < 1 || pfxLen > 128) return false;		
		return true;		  
	}
	const mergeCidr = (nets) => cidr.merge(nets)


	const cidrContains = (nets, entries) => cidr.contains(nets, entries);

	//--------------------
	
	const removeDuplicates 	= (arr, prop ) => {
		if (!Array.isArray(arr)) return []
		return arr.filter((value, index, self) =>
			prop ? index === self.findIndex((t) => t[prop] === value[prop] )
				: index === self.findIndex((t) => t === value )
		)
	}

	const deleteItem = (array, element) => {
		var index = array.indexOf( element );
		if (index !== -1) 
			array.splice( index, 1 );
		return array;
	}
	const deleteItems = (array, elements) => {
		if (array === elements) return array.length=0,array;
		return (elements && elements.length && elements.forEach(e=>deleteItem(array,e))),array;
	}

	const splitArray = (inputArray, perChunk=600) => {
		return inputArray.reduce((resultArray, item, index) => { 
			const chunkIndex = Math.floor(index/perChunk)
			if(!resultArray[chunkIndex]) resultArray[chunkIndex] = [] //new chunk            
			resultArray[chunkIndex].push(item)
			return resultArray
		}, [])
	}

	const startIpAddress = (entry) => {
		if (isCIDR(entry)) 
			return (new ipCidr(entry)).start();
		return isIP(entry) ? entry : false	
	}

	// const getEntryType = (entry) => {

	// }


	/**
	 * 
	 * @param {string} line a line of string to process
	 * @param {Object} opts tells you how the line will processed
	 */
	const lineToEntries = (line, opts) => {	

		if (!line) return [];
		line = line || "";
		line = line.trim();
		line = line.replace(/[\'\"]/gm, '');
		line = line.replace(/[\t,;]/gm, ' ');

		// console.log('ll', line)
		
		let entries = line.split(' ').filter(e=>e);				
		// console.log('entries', entries)

		let ipsFromCIDR = entries.filter( e => isCIDR(e) ).map( c => startIpAddress(c) ).filter( e => e );		
		let files =  entries.filter( e => isFileName(e) ) ;
		let asns = entries.filter( e => isASN(e) ) ;
		let ips = entries.filter( e => isIP(e) ) ;
		// console.log('tota', ipsFromCIDR, files, asns, ips)

		entries = [].concat(ipsFromCIDR, files, asns, ips);
		// console.log('entiressres', entries);
		if (!opts) return entries
		if (!opts.skipASN) entries=asns;
		if (!opts.skipFile) entries = entries.concat(files);
		if (!opts.skipIP) entries=entries.concat(ips);
		if (!opts.skipCIDR) entries=entries.concat(ipsFromCIDR);
		entries = removeDuplicates(entries);
		// console.log(entries)
		return entries;
	}

	//------------------------------------------------------------
	
	const toAsnState = (state) => {
		state = state.toLowerCase();
		if(!Const.AsnStatesList.includes(state))
			throw new Error(`AsnState not found: ${state}`)
		return state;		
	}
	const toRuleAction = (action) => {
		action = action.toLowerCase();
		if(!Const.RuleActionList.includes(action))
			throw new Error(`RuleAction not found: ${action}`)
		return action;		
	}
	const actionToState = (a) => { return `${a}ed` }
	const stateToAction = (s) => { return s.substring(0, s.length-3) }
	const getTraitsObject = (obj) => {
		return Object.keys(obj).reduce( (acc, e) => {
			if (obj[e]) acc[e] = obj[e];
			return acc;
		}, {})
	}

//========================================================================
module.exports = {
	splitArray,
	deleteItem,
	deleteItems,
	removeDuplicates,

	isIP,
	isIPv4,
	isIPv6,
	isASN,
	isFileName,
	isDirName,
	isCIDR,
	isCIDRv4,
	isCIDRv6,
	cidrContains,

	mergeCidr,

	startIpAddress,

	lineToEntries,

	actionToState,
	stateToAction,
	getTraitsObject,

	toAsnState,
	toRuleAction,
}


//========================================================================
// console.log( 'Tools.isIPv4 66.23.224.155:', Tools.isIPv4( '66.23.224.155' ));
		// console.log( 'Tools.isIPv4 66.23.224.0/20:', Tools.isIPv4( '66.23.224.0/20' ));
		// console.log( 'Tools.isIPv6 2001:0db8:85a3:0000:0000:8a2e:0370:7334:', Tools.isIPv6( '2001:0db8:85a3:0000:0000:8a2e:0370:7334' ));
		// console.log( 'Tools.isIPv6 2001::/32:', Tools.isIPv6( '2001::/32' ));

		// console.log( 'Tools.isCIDR 2001::/32:', Tools.isCIDR( '2001::/32' ));
		// console.log( 'Tools.isCIDR 66.23.224.0/20:', Tools.isCIDR( '66.23.224.0/20' ));
		// console.log( 'Tools.isCIDR 66.23.224.1:', Tools.isCIDR( '66.23.224.1' ));
		// console.log( 'Tools.isCIDR 2001:0db8:85a3:0000:0000:8a2e:0370:7334:', Tools.isCIDR( '2001:0db8:85a3:0000:0000:8a2e:0370:7334' ));
		
		// console.log( 'Tools.isCIDRv4 66.23.224.2:', Tools.isCIDRv4( '66.23.224.2' ));
		// console.log( 'Tools.isCIDRv4 66.23.224.0/20:', Tools.isCIDRv4( '66.23.224.0/20' ));
		// console.log( 'Tools.isCIDRv6 2001:db8:1234::/48:', Tools.isCIDRv6( '2001:db8:1234::/48' ));
		// console.log( 'Tools.isCIDRv6 2001:0db8:85a3:0000:0000:8a2e:0370:7334:', Tools.isCIDRv6( '2001:0db8:85a3:0000:0000:8a2e:0370:7334' ));
		// console.log( 'startIpAddress( 212.180.128.0/17 ):', Tools.startIpAddress( '212.180.128.0/17' ));
		// console.log( 'startIpAddress( 212.180.128.12 ):', Tools.startIpAddress( '212.180.128.12' ));
		// console.log( 'startIpAddress( 2001:db8:1234::/48 ):',Tools.startIpAddress( '2001:db8:1234::/48' ));
		// console.log( 'startIpAddress( 2001:0db8:85a3:0000:0000:8a2e:0370:7334 ):', Tools.startAddres2001:0db8:85a3:0000:0000:8a2e:0370:7334s( '2001:0db8:85a3:0000:0000:8a2e:0370:7334' ));