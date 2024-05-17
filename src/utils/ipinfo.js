//=========================================================

    const axios     = require('axios');
    const net       = require('net');
    const fs        = require('fs');
    const path      = require('path');
    const cidrtool  = require('cidr-tools')

//---------------------------------------------------------

    const _token        = 'f8c14b6c142bec';
    const _host         = `https://ipinfo.io`;
    let __instance    = false;

//=========================================================
class IPInfo {

    static getInstance(token) { return __instance ? __instance : new IPInfo(token); }

    constructor( token ) { 
        if (__instance) throw new Error('IPInfo use getInstance instead of creating intsance.')
        this._token = token || _token;
        __instance = this;
    }
    //================================================
    async getIPInfoData(entry='') {        
        try {
            let url = `${_host}/${entry}`;
			// console.log('> IpInfo: entry of:', entry)
            const { data } = await axios({         
                url,
                method: 'get',
                params: { token: this._token },
            });
            if (typeof(data)!="object")
                data = JSON.parse(data);
            return data;
        } catch(e) {
            console.log('IPINFO ERROR:',e)
            return false;
        }
    }
    //-----------------------------------------
    async batch( entries ) {
        if (!Array.isArray(entries)) entries=[entries];        
        try {
            let url = `${_host}/batch`;
            // console.log('> IpInfo: batch of:',entries.length)
            const { data } = await axios({         
                url,
                method: 'post',
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                params: { token: this._token },
                data: JSON.stringify(entries)
            });
            if (typeof(data)!="object")
                data = JSON.parse(data);

            console.log('data',data);

            return data;
        } catch(e) {
            console.log('IPINFO BATCH ERROR',e);
            return false
        }
    }


}
//=========================================================
module.exports = IPInfo