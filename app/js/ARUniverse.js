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
**********     ARUNIVERSE  OBJECT    **********
**********************************************/

function ARUniverse(vers, settings){
    var self = this;
    this.version = vers;
    this.delaySettings = settings;
    this.model = null;
    this.animations = {};
    this.setModel = function(proposed){
        var self = this;
        self.model = proposed;
        console.log('establishing ARUniverse Model: ', self.model.framework.name);
        return true;
    };
    this.getModel = function(proposed){
        var self = this;
        return self.model;
    };
    this.load = function(){ //builds markup of universe
        //start
        var src = self.model;
        if(src!='null'){
            
            src.define(0);
            
            var focus = src.definitions.focusSelector;
            var left = src.definitions.leftSelector;
            var right = src.definitions.rightSelector;
            var gaze = src.definitions.gaze;

            $('#sensory-exchange-layer').append(focus.markup);
            $('#sensory-exchange-layer').append(left.markup);
            $('#sensory-exchange-layer').append(right.markup);
            $('#sensory-exchange-layer').append(gaze.markup);
            
        }
        else{
            console.log('loading interrupted...no model set.');
            return false;
        }
        
        //complete
        console.log('complete | ', self.version);
        return true;
       // self.setModel(model);
    };
    this.invigorate = function(elementTarget){  // (2) give it "life", i.e. add it to the Universe
        var target = elementTarget;
        self.model.buildSensoryExchange(target);
    };
    this.addChildElement = function(child){ // (1) take a 'non-living' child element definition
        var childElement = child;
        self.invigorate(childElement);
         
    };
}