//========================================================================

    const FolderLoader      = require('../utils/folder-loader');

//========================================================================

    let _commands    = false

//========================================================================

class Commands {
     constructor(wafApp) {
        this._wafApp = wafApp;
        this.loadCommands();
    }
    waf()       { return this._wafApp }
    getIds()    { return Object.keys(_commands) }

    //------------------------------------------------------------
    
    loadCommands() {
        if (_commands) return;
        _commands = {}
        let fl = new FolderLoader(`${process.cwd()}/src/waf/commands`);
        fl.stripExt().exclude('a-cmd.js').loadTo( _commands );
        
        for (let cmd of Object.keys(_commands)) {
            let Class               = _commands[cmd];
            let cmdObj              = new Class(this.waf());
            delete _commands[cmd];
            _commands[cmdObj.id]    = cmdObj;
            console.log(`> Command "${cmdObj.id}" loaded!`)
        }
    }
    //------------------------------------------------------------
    getCommand(id)      { return _commands[id] }
    async executeCommand( cmdId ) {
        if (!_commands) this.loadCommands();
        if (!_commands[cmdId]) throw new Error(`> CMD "${cmdId}" not found!`);

        return this.getCommand(cmdId).execute();        
    }

}

//==========================================================
module.exports = Commands;