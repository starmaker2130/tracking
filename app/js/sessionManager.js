"use strict";
/*eslint no-undef: "error"*/
/*eslint-env node*/
/*eslint no-console: ["error", { allow: ["log"] }] */
/*eslint no-unused-vars: "error"*/

/**********************************************
********     SESSIONMANAGER  OBJECT    ********
**********************************************/

function sessionManager(){
    var self = this;
    this.version;
    this.application = {
        focus: 0, // 0 = appetizers; 1 = main-dishes; 2 = desserts; 3 = drinks
        focusArray: [],
        userData: null,
        players: {
            available: [
                /*** TODO: past categories have included 'audioAR' and 'visualAR'; should be replaced with a dynamic funciton acall that reads said information from an RFID (see above in userData.cardContent); connected to plugins below

                */
            ],
            loaded: null
        },
        arLayer: {
            focusVisible: false,
            highlightVisible: false,
            menuLevel: 0//0= main; 1=submenu; 2=category; 3=option
        },
        socket: null
    };

    this.load = function(){
        //start
        self.version = '0.0.-1';
        console.log('version: ',this.version);
    };
    
    this.app = function(setting, data){
        var change = setting;
        if(change!=null){
            console.log('change property: ', change);
            console.log('to: ', data)
            if(self.application.hasOwnProperty(change)){
                self.application[change] = data;
            }
        }    
    };
    
    this.plugins = {
        default:[],
        custom: []
    };
    
    this.connectSocket = function(){
        self.application.socket = io.connect(location.host);
    }
}

sessionManager.prototype.plugins = function(){
    this.plugins.default.push({   
        name: 'audio',
        player: null,
        isPlaying: false,
        focus: null,
        state: 0 // 0 = inactive; 1 = playing; 2 = paused}
    });
    
    this.plugins.default.push({
        name: 'visual',
        player: null,
        isPlaying: false,
        focus: null,
        state: 0 // 0 = inactive; 1 = playing; 2 = paused
    });
}