//========================================================================

    const FolderLoader      = require('../utils/folder-loader');
    const Tools             = require('./tools');

//========================================================================

    let _inputFiles     = false;
	let _fileStack      = {};

//========================================================================

class InputFiles {
     constructor(wafApp) {
        this._wafApp = wafApp;
        this.loadInputFileClasses();
    }
    waf()       { return this._wafApp }
    getIds()    { return Object.keys(_inputFiles) }

    //------------------------------------------------------------    
    // init
    //--------------------
    loadInputFileClasses() {
        if (_inputFiles) return;
        _inputFiles = {}
        let fl = new FolderLoader(`${process.cwd()}/src/waf/input-files`);
        fl.stripExt().exclude(['a-inf.js', 'a-line.js']).loadTo( _inputFiles );
        
        for (let dm of Object.keys(_inputFiles)) {
            let aclass      = _inputFiles[dm];
            let dmObj       = new aclass(this.waf());
            delete _inputFiles[dm];
            _inputFiles[dmObj.id] = dmObj;
            console.log(`> InputFile "${dmObj.id.toUpperCase()}" loaded!`)
    }
    }
    //------------------------------------------------------------
    getInputFile( id )      { return _inputFiles[ id ] }
    //--------------------
    // return { params } : Contents
    async resolve(filesToLoad, accParams=[], accFiles=[]) {       
        
        if (!Array.isArray(filesToLoad)) filesToLoad = [filesToLoad];
        let temp = { params:[], files:[] }

        for (let file of filesToLoad) {

            if (accFiles.includes(file)) {
                console.log(`> File "${file}" was loaded already - skipping...`);
                continue;
            }

            const InputFile = this.getInputFile( this.resolveFileInputId(file) );
            if (!InputFile) {
                console.log(`> InputFile id "${id}" not found - skipping file ${file}`);
                continue;
            }

            let { params, files } = await InputFile.resolve(file);
            params = params || [];
            files = files || [];

            temp.params = temp.params.concat( params );
            temp.files = temp.files.concat( files );
        }
    
        accParams = Tools.removeDuplicates( accParams.concat( temp.params ) );
        accFiles = accFiles.concat( filesToLoad );

        if (temp.files.length)
            return this.resolve(temp.files, accParams, accFiles)

        console.log(`> Files scanned: ${accFiles.length}  Entities found: ${accParams.length}`);
        return accParams;
    }
    //--------------------
    resolveFileInputId(file) {
        let index = file.lastIndexOf('.');
        if (index<0) {
            console.log(`> Wrong file "${file}" - skipping...`);
            return false;
        } 
        let id = file.substr( index+1 )
        id = id ? id.toLowerCase() : false;        
        return id;
    }
    //------------------------------------------------------------
}

//==========================================================
module.exports = InputFiles;