//--------------------------------------------------

	const fs = require('fs');

	const dir 	= `${__dirname}/data/`;
	const files = ['master.json', 'domains.json'];

	if (fs.existsSync(dir))
		fs.rmdirSync( dir, {recursive:true, forced:true} );

	// files.forEach( f => {
	// 	if (fs.existsSync( `${dir}${f}` ))
	// 		fs.unlinkSync(`${dir}${f}`);
	// })


//========================================================================
