(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/*eslint no-undef: "error"*/
/*eslint-env node*/
/*global document*/
/*eslint no-console: ["error", { allow: ["log"] }] */
/*eslint no-unused-vars: "error"*/

// ARUNIVERSE CLASS
var ARUNIVERSE = (function ARUNIVERSE(){
   // this.version = vers;
   // this.delaySettings = settings;
    var version;
    var delaySettings = [
        2500,
        4000,
        8000
    ];
    
    function privateFunctionBase(){
        console.log('version: ',version);
        console.log('the private function base is live');
    }
    

   /* function privateFunctionOne(){
        
    }
    
    function privateFunctionTwo(){
        
    }
    
    function privateFunctionThree(){
        
    }*/
    
    return {
        load: function(){
            //start
            version = '0.0.-1';
            privateFunctionBase();
            
            //complete
            
            this.animations.default.floorAppear;
                    
            setTimeout(function(){
                this.animations.default.revealWorldContainer;
            }, delaySettings[0]);

            setTimeout(function(){
                this.animations.default.openWorldContainer;
            }, delaySettings[1]);
            
            setTimeout(function(){
                document.querySelector('#statue').emit('float');
            }, delaySettings[2]);
        },
        animations: {
            default: {
                floorAppear: function(){
                    document.querySelector('#floor').emit('appear');
                    return null;
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
            }
        }
  };
})();

module.exports = ARUNIVERSE;
},{}],2:[function(require,module,exports){
"use strict";
/*eslint no-undef: "error"*/
/*eslint-env browser*/
/*global document*/
/*eslint no-console: ["error", { allow: ["log"] }] */
/*eslint no-unused-vars: "error"*/

 /*TODO: past categories included 'audioList (array of objects)' and 'visualList(ditto)'; should be replaced with a dynamic function call that reads said information from an RFID, e.g. the proposed <rfid> tag, a scripted software framework, a new xml definition (i.e. e.ml), and more to come lmao
 
 */

/**************************/
/*******    BASE    *******/
/**************************/
/** variables **/
var cHouse, sessionManager;

/** functions **/
function openHouse(){   //THE BASE FUNCTION -- LEVEL 0
    //function(){
    console.log('application launch...');

    var elem = document.body;
    requestFullScreen(elem);

   // handleAudio(sessionManager.audio.focus);

    $(this).animate({
        height: 0
    }, 2500, function(){
        $(this).hide();

        launchAREnvironmentLoader();
    });
 //   }
}

function initializeSession(){
    console.log('initializing session...');
    
    cHouse = require('./ARUNIVERSE.js');
    sessionManager = require('./sessionManager.js');
    sessionManager.load();
    sessionManager.app;/*('userData', {
        cardholder: {
            name: 'House of Venus',
            id: 2130
        },
        cardContent: {
            author: 'Patrice-Morgan Ongoly',
        }
    });
    
    //if(data){
       /* sessionManager.application.userData = {
            cardholder: {
                name: 'House of Venus',
                id: 2130
            },
            cardContent: {
                author: 'Patrice-Morgan Ongoly',
            }
        };
        console.log('user data loaded...');
        console.log(sessionManager.application.userData);*/
    //}
    console.log(sessionManager);
}


/**************************/ 
/*******  LEVEL  1  *******/
/**************************/ 
/* UI|T|1|0 */ 
function requestFullScreen(element) {
    //  UI FUNCTION
    //  TRANSITION: makes the application fullscreen on fullscreen equipped browsers
    //  LEVEL 1 FUNCTION
    //  PARENTS: openHouse
    
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
    
    cHouse.load;
}

$(document).ready(function(){
    initializeSession();

    // FIRST STAGE - ENTRY LAYER
    $('#launch-application-page').click(function(){
        openHouse();
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
},{"./ARUNIVERSE.js":1,"./sessionManager.js":3}],3:[function(require,module,exports){
"use strict";
/*eslint no-undef: "error"*/
/*eslint-env node*/
/*eslint no-console: ["error", { allow: ["log"] }] */
/*eslint no-unused-vars: "error"*/

// cHouse.js
// ARUNIVERSE CLASS
var sessionManager = (function(){
    var version;
    var application = {
        focus: 0, // 0 = appetizers; 1 = main-dishes; 2 = desserts; 3 = drinks
        userData: null,
        players: {
            available: [
                /*** TODO: past categories have included 'audioAR' and 'visualAR'; should be replaced with a dynamic funciton acall that reads said information from an RFID (see above in userData.cardContent); connected to plugins below

                */
            ],
            loaded: null
        }
    };
    
    function privateFunctionBase(){
        console.log('version: ',version);
        console.log('the private function base is live');
    }
    

   /* function privateFunctionOne(){
        
    }
    
    function privateFunctionTwo(){
        
    }
    
    function privateFunctionThree(){
        
    }*/
    
    return {
        load: function(){
            //start
            version = '0.0.-1';
            privateFunctionBase()  
            
            //complete
        },
        app: function(setting, data){
            var change = setting;
            if(change!=null){
                console.log('change property: ', change);
                console.log('to: ', data)
                if(application.hasOwnProperty(change)){
                    application[change] = data;
                }
            }    
          //  return 
        },
        plugins: {
            default:[
                {   
                    name: 'audio',
                    player: null,
                    isPlaying: false,
                    focus: null,
                    state: 0 // 0 = inactive; 1 = playing; 2 = paused}
                },
                {
                    name: 'visual',
                    player: null,
                    isPlaying: false,
                    focus: null,
                    state: 0 // 0 = inactive; 1 = playing; 2 = paused
                },
            ],
            custom: []
        }
    }
})();

module.exports.sessionManager = sessionManager;
},{}]},{},[2]);
