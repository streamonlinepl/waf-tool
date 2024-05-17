"use strict";
//--------------------------------------------------

    const WafApp    = require('./src/waf/waf-app');
    const Tools     = require('./src/waf/tools');


//--------------------------------------------------

    console.log('WAF APP')
    console.log('------------------------------------------------------------');

    let wafApp = new WafApp();

    wafApp.start().then(() => {
        console.log('> Done.')
		console.log('------------------------------------------------------------');
    })
    .catch((err) => {
        console.log(err);
    });

//--------------------------------------------------