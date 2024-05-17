//------------------------------------------------------------

const writeFileSync = (content, filename, opts={} ) => {
	const fs = require('fs');
	const path = require('path');

	let dir = path.dirname(filename);
	if (!fs.existsSync(dir)) fs.mkdirSync(dir);
	fs.writeFileSync(filename, typeof(content) != "string" ? JSON.stringify(content) : content,);
}

//------------------------------------------------------------
module.exports = {
	writeFileSync
}