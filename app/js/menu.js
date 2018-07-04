"use strict";
/*eslint no-undef: "error"*/
/*eslint-env browser*/
/*global document*/
/*eslint no-console: ["error", { allow: ["log"] }] */
/*eslint no-unused-vars: "error"*/

 /*TODO: past categories included 'audioList (array of objects)' and 'visualList(ditto)'; should be replaced with a dynamic function call that reads said information from an RFID, e.g. the proposed <rfid> tag, a scripted software framework, a new xml definition (i.e. e.ml), and more to come lmao
 
 */

/**********************************************
***    PHONECOASTARSENSORYEXCHANGE  MODEL   ***
**********************************************/

function PhoneCoastARSensoryExchangeModel(vers){
    this.version = vers;
    this.definitions = {};
    this.framework = {
        name: 'PARSEC',
        title: 'MyPARSEC: mixed reality interactions involving touch(primary), light(primary, resultive), and sound(1.5)',
        abstract: 'a theoretical model for phone to coastAR augmented reality interactions'
    };
}

PhoneCoastARSensoryExchangeModel.prototype.load = function(){
    var self = this;
    //start
        
    //complete
    console.log('version: ', self.version);
}

PhoneCoastARSensoryExchangeModel.prototype.define = function(){
    var self = this;
    self.definitions.leftSelector = {
        id: 'left-selector',
        classes: [
            'selector'
        ],
        markup: "<div id='left-selector' class='selector'></div>",
        selectPreviousAROption: function (){
            console.log('TODO: missing selectPreviousAROption; check next release.');
        },
    }
    
    self.definitions.rightSelector = {
        id: 'right-selector',
        classes: [
            'selector'
        ],
        markup: "<div id='right-selector' class='selector'></div>",
        selectNextAROption: function (){
            console.log('TODO: missing selectNextAROption; check next release.');
        },
    }
    
    self.definitions.focusSelector = {
        id: 'focus-selector',
        classes: [
            'selector'
        ],
        markup: "<div id='focus-selector' class='selector'></div>",
        selectCurrentAROption: function (){
            console.log('TODO: missing selectCurrentAROption; check next release.');
        },
        revealFocusSelector: function (){
            console.log('TODO: missing revealFocusSelector; check next release.');
        },
        hideFocusSelector: function (){
            console.log('TODO: missing hideFocusSelector; check next release.');
        },
        zoomIntoScene: function (){
            console.log('TODO: missing zoomIntoScene; check next release.');
        },
        zoomOutOfScene: function (){
            console.log('TODO: missing zoomOutOfScene; check next release.');
        },
        scaleARObjectInFocus: function (){
            console.log('TODO: missing scaleARObjectInScene; check next release.');
        },
        polarizeGazeAndFieldOfFiew: function (){
            console.log('TODO: missing polarizeGazeAndFieldOfFiew; check next release.');
        },
    }
    
    self.definitions.gaze = {
        id: 'gaze',
        classes: [
            'gaze-selector'
        ],
        markup: "<div id='gaze' class='gaze-selector'></div>",
        selectNextAROption: function (){
            console.log('TODO: missing selectNextAROption; check next release.');
        }
    }
    
    //start
    console.log('version: ', self.version);
    
    //complete

}

/**********************************************
**********     ARUNIVERSE  OBJECT    **********
**********************************************/

function ARUNIVERSE(vers, settings){
    this.version = vers;
    this.delaySettings = settings;
    this.model = {};
    this.animations = {
        default: {
            floorAppear: function(){
                document.querySelector('#floor').emit('appear');
            },
            revealWorldContainer: function(){
                setTimeout(function(){
                    document.querySelector('#cover-0').setAttribute('material','visible', 'true');
                    document.querySelector('#cover-0').emit('entry');
                }, 1500);

                setTimeout(function(){
                    document.querySelector('#cover-1').setAttribute('material','visible', 'true');
                    document.querySelector('#cover-1').emit('entry');
                }, 2000);

                setTimeout(function(){
                    document.querySelector('#cover-2').setAttribute('material','visible', 'true');
                    document.querySelector('#cover-2').emit('entry');
                }, 2500);

                setTimeout(function(){
                    document.querySelector('#cover-3').setAttribute('material','visible', 'true');
                    document.querySelector('#cover-3').emit('entry');
                }, 3000);
},
            openWorldContainer: function(){
                document.querySelector('#statue').setAttribute('material','visible', 'true');

                setTimeout(function(){
                    document.querySelector('#cover-0').emit('settle');
                    document.querySelector('#cover-1').emit('settle');
                    document.querySelector('#cover-2').emit('settle');
                    document.querySelector('#cover-3').emit('settle');
                    console.log('settle down');

                    setTimeout(function(){
                        var labels = document.querySelectorAll('.menu-label');

                        for(var i = 0; i<labels.length; i++){
                            labels[i].setAttribute('visible','true');
                        }

                        console.log('menu labels shown');
                        //call a function that sets the sessionManager.application.focus = 0;
                    },1000);

                }, 2500)
}   
        },
        custom: {
            
        }
    };
}

ARUNIVERSE.prototype.load = function(){
    var self = this;
    //start
    console.log('version: ', this.version);
    
    //complete

    self.animations.default.floorAppear();

    setTimeout(function(){
        self.animations.default.revealWorldContainer();
    }, self.delaySettings[0]);

    setTimeout(function(){
        self.animations.default.openWorldContainer();
    }, self.delaySettings[1]);

    setTimeout(function(){
        document.querySelector('#statue').emit('float');
    }, self.delaySettings[2]);
}

ARUNIVERSE.prototype.setModel = function(proposed){
    var self = this;
    self.model = proposed;
    console.log('establishing ARUniverse Model: ', self.model.framework.name);
    return true;
}

ARUNIVERSE.prototype.getModel = function(proposed){
    var self = this;
    return self.model;
}

/**********************************************
********     SESSIONMANAGER  OBJECT    ********
**********************************************/

function sessionManager(){
    var self = this;
    this.version;
    this.application = {
        focus: 0, // 0 = appetizers; 1 = main-dishes; 2 = desserts; 3 = drinks
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
            menuLevel: 0//0= main; 1=submenu; 2=category; 3=option
        }
    };

    this.load = function(){
        //start
        self.version = '0.0.-1';
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
        }
}

sessionManager.prototype.load = function(){
    console.log('version: ',this.version);
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


/**************************/
/*******    BASE    *******/
/**************************/
/** variables **/
var cHouse, sM;

/** functions **/
function openHouse(target){   //THE BASE FUNCTION -- LEVEL 0
    console.log('application launch...');

    var elem = document.body;
    requestFullScreen(elem);

    target.animate({
        height: 0
    }, 2500, function(){
        target.hide();

        launchAREnvironmentLoader();
    });

}

function initializeSession(){
    console.log('initializing session...');
    
    cHouse = new ARUNIVERSE('0.0.-1', [2500, 4000, 8000]);
    sM = new sessionManager();
    
    sM.load();
    
}

function buildSensoryExchangeLayer(){
    console.log('TODO: build sensory exchange layer');
    /*
    **  add left side selector (previous option)
    **  add right side selector (next section)
    **  add central selector (choose current option)
    **  
    **  
    **  
    **  
    */
    var model = new PhoneCoastARSensoryExchangeModel('0.0.1');
    model.define();
    
    console.log(model);
    cHouse.setModel(model);
    
    var focus = model.definitions.focusSelector;
    var left = model.definitions.leftSelector;
    var right = model.definitions.rightSelector;
    var gaze = model.definitions.gaze;
    
    $('#sensory-exchange-layer').append(focus.markup);
    $('#sensory-exchange-layer').append(left.markup);
    $('#sensory-exchange-layer').append(right.markup);
    $('#sensory-exchange-layer').append(gaze.markup);
    
    document.getElementById(focus.id).addEventListener('click', function(){
        if(!sM.application.arLayer.focusVisible){
            focus.revealFocusSelector();
            sM.application.arLayer.focusVisible = true;
        }
        else{
            focus.hideFocusSelector();
            sM.application.arLayer.focusVisible = false;
        }
    });
    
    /**/
    document.getElementById(left.id).addEventListener('click', function(){
        if(sM.application.arLayer.menuLevel==0){
            if(sM.application.focus>0){
                left.selectPreviousAROption();
                sM.application.focus--;
                console.log('now on main menu ', sM.application.focus);
            }
            else{
                console.log('reached the first menu option in the queue...');
                console.log('still on main menu ', sM.application.focus);
            }
        }
        else{
            console.log('TODO: missing menu level (1, 2, 3) event handlers; see next release.');
        }
    });
    
    document.getElementById(right.id).addEventListener('click', function(){
        if(sM.application.arLayer.menuLevel==0){
            if(sM.application.focus<3){
                right.selectNextAROption();
                sM.application.focus++;
                console.log('now on main menu ', sM.application.focus);
            }
            else{
                console.log('reached the last menu option in the queue...')
                console.log('still on main menu ', sM.application.focus);
            }
        }
        else{
            console.log('TODO: missing menu level (1, 2, 3) event handlers; see next release.');
        }
    });
    
    document.getElementById(gaze.id).addEventListener('click', function(){
        console.log('TODO: missing gaze event handler system; see next release.');
    });
}

/**************************/ 
/*******  LEVEL  1  *******/
/**************************/ 
/* UI|T|1|0 */ 
function requestFullScreen(element) {
    /*  UI FUNCTION
    **  |---TRANSITION: makes the application fullscreen on fullscreen equipped browsers
    **
    **  LEVEL 1 FUNCTION
    **  |---PARENTS: openHouse
    */
    console.log('requesting full screen mode...')
    
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen; // Supports most browsers and their versions.

    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

/* UI|ARig|1|0 */ 
function launchAREnvironmentLoader(){
    /*  AR ENVIRONMENT FUNCTION
    **  |---ARINVOKE:   launches the AREnvironment
    **  |---ARGEOMETRY: plays any animations, loading screens, transitions by elements in the dom that represent AR **                  elements relevant to "user-interface" of the AR WORLD CONTAINER (AR UNIVERSE) 
    **  LEVEL 1 FUNCTION
    **  |---PARENTS: openHouse
    */
    console.log('launching AREnvironment loader');
    cHouse.load();
}

$(document).ready(function(){
    initializeSession();

    // FIRST STAGE - ENTRY LAYER
    $('#launch-application-page').click(function(){
        var eL = $(this);
        openHouse(eL);
        buildSensoryExchangeLayer();
    });
    
        /*  the '#launch-application-page' document divider element [CLASSES: 'overlay', 'entry-layer']
        **  what the user sees first when landing on an AR experience page
        **  it describes the aciton they must take if any to launch the experience
        **  details about the experience can be present such as instructions for what to do once it is launched
        **  or ready! thisscene can also act as a loading screen in next versions
        **  originally opaque and black only, now it can be a variety of colors and transparencies
        **  
        */
    
    
    // SECOND STAGE -- USER-INTERACTIVITY LAYER/SENSORY-EXCHANGE LAYER
    
    /*  how you sell it to the user (the sense and sensory crossroads [ (0) on a phone for example: light(primary), touch(primary), sound(false primary, 1.5)]) )
    **
    **  possibilities now include arrangements that are :
    **
    **  (1) sound(primary), light(primary) --> this is VR =; a big reason it is disarming is because it has removed one of our primary modes of communication: touch; for this reason VR will benefit highly from the development of artificial intelligence and expressive media for it will rely on the system reading and responding to a human expression to capture the largely non-verbal majority of our communiucative habits ; this may require the strange outside eye
    **
    **  (2) another possibility is touch(primary, controllers) with VR (see arrangement above)
    **
    **  TODO : add a funciton that loads this layer dynamically from a variable that contains the definition of this layers document elements (e.g. like in the entry layer above);
    */

    // THIRD STAGE -- 
        
        /*  known as the ar geometry control layer in previous versions
        **
        **  link a function to the page selection flow that loads the corresponding model
        **
        **  main = user model
        **
        **  music = album list
        **
        **  visual = visual list
        **
        **  search = thought bubble, recommendations are visuals --> related images, models, project covers
        **
        */
});