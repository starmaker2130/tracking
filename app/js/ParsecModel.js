"use strict";
/*eslint no-undef: "error"*/
/*eslint-env node*/
/*global document*/
/*eslint no-console: ["error", { allow: ["log"] }] */
/*eslint no-unused-vars: "error"*/

// author(s):  Patrice-Morgan Ongoly
// version: 0.1.3
// last modified: Saturday, June 2, 2018 00:33 CPD
// description: 

/**********************************************
***    PHONECOASTARSENSORYEXCHANGE  MODEL   ***
**********************************************/
// model types
// 1 = The Divider Method
// the screen is split into three divisions that act as tactile-event listeners, i.e. buttons while preserving as much of the transparency of view as possible
// TODO : next versions include specifications for different hand input configuration (1 hand, 2 hand, no bounds, no hands);
function PhoneCoastARSensoryExchangeModel(vers, modelNum){
    var self =this;
    this.version = vers;
    this.definitions = {};
    this.manager = null;
    this.framework = {
        name: 'PARSEC',
        title: 'MyPARSEC: mixed reality interactions involving touch(primary), light(primary, resultive), and sound(1.5)',
        abstract: 'a theoretical model for phone to coastAR augmented reality interactions'
    };
    this.define = function(modelReference){
        var modelRef = modelReference;
        if(typeof modelRef === 'number'){
            switch(modelRef){
                case 0:
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
                    
                    console.log('set definitions for default parsec model configuration.')
                    break;
                case 1:
                    console.log('TODO: added third default parsec configuration');
                    break;
                default:
                    console.log('TODO: add default parsec configuration');
                    break;
            }
        }
        else if(typeof modelRef === 'object'){
            self.definitions = modelRef;
        }
        
        //start
        console.log('version: ', self.version);

        //complete

    };
    this.buildSensoryExchange = function(childElement, manager){
        var defs = self.definitions;
        var sM;
        if(self.manager == null){
            self.manager = new sessionManager();
            sM = self.manager;
        }
        
        defs.leftSelector.selectPreviousAROption = function(){
            childElement.selectPreviousMenuItem();
        };
        
        defs.focusSelector.selectCurrentAROption = function(){
            if(!sM.application.arLayer.highlightVisible){
                childElement.selectCurrentMenuItem(sM.application.focus);
                sM.application.arLayer.highlightVisible = true;
            }
            else{
                childElement.deselectCurrentMenuItem(sM.application.focus);
                sM.application.arLayer.highlightVisible = false;
            }
        };
        
        defs.rightSelector.selectNextAROption = function(){
            childElement.selectNextMenuItem();
        };

        document.getElementById(defs.focusSelector.id).addEventListener('click', function(){
            defs.focusSelector.selectCurrentAROption();
            /*
            if(!sM.application.arLayer.focusVisible){
                defs.focusSelector.revealFocusSelector();
                sM.application.arLayer.focusVisible = true;
            }
            else{
                defs.focusSelector.hideFocusSelector();
                sM.application.arLayer.focusVisible = false;
            }
            */
        });

            
            
        document.getElementById(defs.leftSelector.id).addEventListener('click', function(){
            if(sM.application.arLayer.menuLevel==0){
                if(sM.application.focus>0){
                    defs.leftSelector.selectPreviousAROption();
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

        document.getElementById(defs.rightSelector.id).addEventListener('click', function(){
            if(sM.application.arLayer.menuLevel==0){
                if(sM.application.focus<3){
                    defs.rightSelector.selectNextAROption();
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

        document.getElementById(defs.gaze.id).addEventListener('click', function(){
            //console.log('TODO: missing gaze event handler system; see next release.');
            defs.focusSelector.selectCurrentAROption();
        });    
    };
    this.load = function(){
        //start

        //complete
        console.log('version: ', self.version);
    };
}


