
//  var logger = require('./logger');

//------------------------------------

class FolderLoader {

	constructor(f) {
			
		let folder = f;
		this.setFolder = function(f) {
			folder = f;
			return this;
		}

		this.stripExt = function(strip=true) {
			this._stripExt = strip
			return this;
		}

		this.canThrow = function(canThrow=true) {
			this._canThrow = canThrow;
			return this;
		}

		this._toExclude = [];
		this.exclude = function(filenames) {
			if (typeof(filenames)=="string") filenames=[filenames];
			if (!Array.isArray(filenames)) throw new Error('FolderLoader.exclude() requires array or string parameter!');
			this._toExclude = filenames;
			return this;
		}

		this.loadTo = function(obj) {
			let fs = require("fs");
			let that = this;
			if (fs.existsSync( folder )) 
				try {					
					fs.readdirSync(folder).forEach(
						function(file) {
							let stat = fs.statSync(folder + "/" +file);
							if (stat.isDirectory()) return;

							if (that._toExclude.includes(file)) return;							
							if (that._stripExt)
								obj[ file.substr(0,file.lastIndexOf('.')) ] = require(folder + "/" + file); 
					 	 	else obj[file] = require(folder+ "/" + file);
						}
					);							
				} catch (err) {
					console.log("[FolderLoader Error] no files loaded from: ", folder, err)
				}
		}
	}

}

//------------------------------------
module.exports = FolderLoader;