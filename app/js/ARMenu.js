"use strict";
/*eslint no-undef: "error"*/
/*eslint-env node*/
/*global document*/
/*eslint no-console: ["error", { allow: ["log"] }] */
/*eslint no-unused-vars: "error"*/

// author(s):  Patrice-Morgan Ongoly
// version: 0.1.4
// last modified: Sundday, June 3, 2018 12:12 CPD
// description: 
/*
*   whats new?
*   selection animation added
*
*/

function ARMenu(numOfObjects, objectList){
    var self = this;
    this.size = numOfObjects;
    this.anchor = {
        id: null,
        object: null,
        pointer: 0
    };
    this.focus = {
        item: 0
    };
    this.components = {
        positionalMatrix: []
    };
    this.createElementFromHTML = function(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        return div.firstChild; 
    };
    this.addGeometryComponentToARUniverse = function (geometry){
        var child = self.createElementFromHTML(geometry);
        document.querySelector('#ar-geometry-container').appendChild(child);
        return true;
    };
    this.genealogy = {
        reveal: function () {
            console.log('TODO: reveal menu genealogy...');
            console.log(self.genealogy.tree);
            return true;
        },
        retrieve: function(query){
            if(query==null){
                console.log('missing retrieval query term; search not conducted.');
                return false;
            }
            else{
                console.log('TODO: filter query term, conduct search, then retrieve associated menu child objects');
                return true;
            }
        },
        tree: null,
        geneArr: []
    };
    this.buildXRGeometry = function(){
        var genealogy = self.genealogy.tree;
        var animationList = {
            tree: '',
            labelTree: '',
            add: function(listItem, parent){
                this.tree += `<a-animation id='${obj.id}-animation-left-${listItem}' attribute='position' from='${obj.spacing.x*(-1*listItem)+obj.position.x} 2 -1' to='${obj.spacing.x*(1-listItem)+obj.position.x} 2 -1' dur='1000' begin='selectPrevious-${obj.id}-${listItem}'></a-animation>`;

                this.tree += `<a-animation id='${obj.id}-animation-right-${self.anchor.pointer-listItem}' attribute='position' from='${obj.position.x-obj.spacing.x*listItem} 2 -1' to='${obj.position.x-obj.spacing.x*(listItem+1)} 2 -1' dur='1000' begin='selectNext-${obj.id}-${listItem}'></a-animation>`;
            },
            addLabel: function(listItem, parent){
                var obj = parent;
                this.labelTree += `<a-animation id='${obj.id}-animation-left-label-${listItem}' attribute='position' from='${obj.position.x-obj.spacing.x*listItem} 0.75 0' to='${obj.position.x-obj.spacing.x*(listItem-1)} 0.75 0' dur='1000' begin='selectPrevious-${obj.id}-label-${listItem}'></a-animation>`

                this.labelTree += `<a-animation id='${obj.id}-animation-right-label-${listItem}' attribute='position' from='${obj.position.x-obj.spacing.x*listItem} 0.75 0' to='${obj.position.x-obj.spacing.x*(listItem+1)} 0.75 0' dur='1000' begin='selectNext-${obj.id}-label-${listItem}'></a-animation>`;
            },
            print: function(){
                console.log('tree: \n\n', this.tree);
                console.log('\n\n label: \n\n', this.labelTree);
            }
        };
        
        
        for (var key in genealogy) {    // build the main menu options 
            
            // build menu placeholder

            var obj = genealogy[key];
            
            
            
            var ARGeometry, placeholder;

            for(var i = 0; i<self.anchor.pointer; i++){
                animationList.add(i, obj);
                animationList.addLabel(i, obj);
            }

            if(obj.model==null){
                placeholder = `<a-entity id='${obj.id}' class='menu-item' geometry='${obj.geometry}' position='${obj.position.x} 2 -1' rotation='${obj.rotation}' material='${obj.material}'>`+animationList.tree+`<a-animation id='highlight-selection-${obj.id}' attribute='scale' from='${obj.scale}' to='${obj.scaleDouble}' dur='1000' begin='highlight-${obj.id}'></a-animation><a-animation id='unhighlight-selection-${obj.id}' attribute='scale' from='${obj.scaleDouble}' to='${obj.scale}' dur='1000' begin='unhighlight-${obj.id}'></a-animation></a-entity>`;
            }
            else{
                if(obj.model.mtl=='null'){
                    placeholder = `<a-entity id='${obj.id}' obj-model='obj: #${obj.model.obj};' position='${obj.position.x} 2 -1' rotation='${obj.rotation}' scale='${obj.scale}' material='${obj.material}'>`+animationList.tree+`<a-animation id='highlight-selection-${obj.id}' attribute='scale' from='${obj.scale}' to='${obj.scaleDouble}' dur='1000' begin='highlight-${obj.id}'></a-animation><a-animation id='unhighlight-selection-${obj.id}' attribute='scale' from='${obj.scaleDouble}' to='${obj.scale}' dur='1000' begin='unhighlight-${obj.id}'></a-animation></a-entity>`;
                }
                else{
                    placeholder = `<a-entity id='${obj.id}' obj-model='obj: #${obj.model.obj}; mtl: #${obj.model.mtl};' position='${obj.position.x} 2 -1' rotation='${obj.rotation}' scale='${obj.scale}' material='${obj.material}'>`+animationList.tree+`<a-animation id='highlight-selection-${obj.id}' attribute='scale' from='${obj.scale}' to='${obj.scaleDouble}' dur='1000' begin='highlight-${obj.id}'></a-animation><a-animation id='unhighlight-selection-${obj.id}' attribute='scale' from='${obj.scaleDouble}' to='${obj.scale}' dur='1000' begin='unhighlight-${obj.id}'></a-animation></a-entity>`;  //-${obj.pointer}
                }
            }
            
            self.addGeometryComponentToARUniverse(placeholder);

            // build label

            var label = `<a-entity id='${obj.id}-label' class='menu-item' geometry='primitive: plane; height: 1; width: 2;' position='${obj.position.x} 0.75 0' rotation='-40 0 0' material='color: white; side: double;' text='font: monoid; value: ${obj.text.value}; color: black; width: 6; align: center;'>`+animationList.labelTree+`</a-entity>`;

            self.addGeometryComponentToARUniverse(label);
            
        }
        
        self.buildHighlights();
    };
    this.buildHighlights = function(){
        for(var i=0; i<self.genealogy.geneArr.length; i++){
            var obj = self.genealogy.geneArr[i];
            
            var highlightTitle = `
                <a-entity id='highlight-title-container-${obj.id}' visible='false' geometry='primitive: plane; height: 1.75; width: 5;' position='0 5.5 -1' material='color: white; side: double; opacity: 0;' text='font: monoid; value: ${obj.highlights.title}; color: #e8e8e8; width: 8; align: center;'>
                    
                    <a-animation id='reveal-HT-${obj.id}' attribute='visible' from='false' to='true' dur='100' begin='reveal-title-${obj.id}'></a-animation>
                    
                    <a-animation id='hide-HT-${obj.id}' attribute='visible' from='true' to='false' dur='1000' begin='hide-title-${obj.id}'></a-animation>
                </a-entity>`;
            
            var highlightSummary = `<a-entity id='highlight-summary-container-${obj.id}' visible='false' geometry='primitive: plane; width: 2; height: 2;' position='-4 4 0' rotation='0 45 0' material='color: white; side: double; opacity: 0;' text='font: monoid; value: ${obj.highlights.summary}; color: #e8e8e8; width: 4; align: center;'>
                    
                    <a-animation id='reveal-HS-${obj.id}' attribute='visible' from='false' to='true' dur='100' begin='reveal-summary-${obj.id}'>
                    </a-animation>
                    
                    <a-animation id='hide-HS-${obj.id}' attribute='visible' from='true' to='false' dur='1000' begin='hide-summary-${obj.id}'>
                    </a-animation>

                </a-entity>`;

            var highlightDetails = `
                <a-entity id='highlight-details-container-${obj.id}' visible='false' geometry='primitive: plane; height: 3; width: 3;' position='2.5 4 0' rotation='0 -35 0' material='color: white; side: double; opacity: 0;' text='font: monoid; value: ${obj.highlights.details}; color: #e8e8e8; width: 4; align: center;'>
                    
                    <a-animation id='reveal-HD-${obj.id}' attribute='visible' from='false' to='true' dur='100' begin='reveal-details-${obj.id}'>
                    </a-animation>
                    
                    <a-animation id='hide-HD-${obj.id}' attribute='visible' from='true' to='false' dur='1000' begin='hide-details-${obj.id}'></a-animation>
                </a-entity>`;
      
            self.addGeometryComponentToARUniverse(highlightTitle);
            self.addGeometryComponentToARUniverse(highlightSummary);
            self.addGeometryComponentToARUniverse(highlightDetails);
        }
         
        
    };
    this.addChildMenu = function(name, highlightsObj, modelReference, scaleValue, scaleDoubleValue, rotationValue, textureValue){
        var menuName = name;
        var modelRefs = null;
        var scale = null;
        var rotation = null;
        var texture = null;
        var scaleDouble = null;
        var highlights = {
        };
        
        if(highlightsObj==null){
            highlights = {
                title: 'untitled',
                summary: 'no summary provided.',
                details: 'no details available.'
            };
        }
        else{
            if(highlightsObj.title=='null'){
                highlights.title = 'untitled';
            }
            else{
                highlights.title = highlightsObj.title;
            }
            
            if(highlightsObj.summary=='null'){
                highlights.summary = 'no summary provided.';
            }
            else{
                highlights.summary= highlightsObj.summary;
            }
            
            if(highlightsObj.details=='null'){
                highlights.details = 'no details available.';
            }
            else{
                highlights.details = highlightsObj.details;
            }
        }
        
        if(modelReference!=null){
            modelRefs = {};
            modelRefs.obj = modelReference.obj;
            modelRefs.mtl = modelReference.mtl;
        }

        if(scaleValue!=null){
            scale = scaleValue;
        }
        else{
            scale = '0.25 0.25 0.25';
        }
        
        if(scaleDoubleValue!=null){
            scaleDouble = scaleDoubleValue;
        }
        else{
            scaleDouble = '0.5 0.5 0.5';
        }
        
        if(rotationValue!=null){
            rotation = rotationValue;
        }
        else{
            rotation = '0 0 0';
        }

        if(textureValue!=null){
            texture = textureValue;
        }
        else{
            texture = 'color: white; side: double;';
        }

        if(menuName=='null'){
            console.log('missing menu option name; addtion not conducted.');
            return false;
        }
        else {
            if(self.genealogy.hasOwnProperty(name)){
                console.log('menu item already exists; addition not conducted.');
                console.log('TODO: add handler for potential options including rewrite, removal, or copy');
            }
            else{
                if(self.anchor.pointer<self.size){
                    console.log('adding...')
                }
                else{
                    self.size++;
                    console.log('increasing menu size to ', self.size);
                }


                if(self.genealogy.tree==null){
                    self.genealogy.tree = {};
                    console.log('adding initial child object...');
                    self.genealogy.tree[name] = {
                        id: name,
                        type: 'menu child object',
                        geometry: 'primitive: sphere; radius: 2;',
                        position: {
                            x: 0,
                            y: 2,
                            z: -1
                        },
                        rotation: rotation,
                        material: texture,
                        spacing: {
                            x: 6,
                            y: 0,
                            z: 0
                        },
                        text: {value: name},
                        pointer: self.anchor.pointer,
                        model: modelRefs,
                        scale: scale,
                        scaleDouble: scaleDouble,
                        children: null,
                        highlights: highlights
                    };
                    self.genealogy.geneArr.push(self.genealogy.tree[name]);
                    self.components.positionalMatrix.push({id: name, position: {x: 0, y: 2, z: -1}});
                    self.anchor.object = self.genealogy.tree[name];
                }
                else{
                    var localAnchor = self.anchor.object;

                    self.genealogy.tree[name] = {
                        id: name,
                        type: 'menu child object',
                        geometry: 'primitive: sphere; radius: 2;',
                        position: {
                            x: (localAnchor.position.x+localAnchor.spacing.x)*self.anchor.pointer,
                            y: localAnchor.position.y,
                            z: localAnchor.position.z
                        },
                        rotation: rotation,
                        material: texture,
                        spacing: {
                            x: localAnchor.spacing.x,
                            y: localAnchor.spacing.y,
                            z: localAnchor.spacing.z
                        },
                        text: {value: name},
                        pointer: self.anchor.pointer,
                        model: modelRefs,
                        scale: scale,
                        scaleDouble: scaleDouble,
                        children: null,
                        highlights: highlights
                    };
                    self.genealogy.geneArr.push(self.genealogy.tree[name]);
                    self.components.positionalMatrix.push({id: name, position: {x: (localAnchor.position.x+localAnchor.spacing.x)*self.anchor.pointer, y: 2, z: -1}});
                }
                self.anchor.pointer++;
            }
            return true;
        }
    };
    this.selectPreviousHandler = function(focus, item){        
        if(focus.id!=null){

            var focusElement = document.querySelector(`#${focus.id}`);
            var focusLabelElement = document.querySelector(`#${focus.id}-label`);

            focusElement.emit(`selectPrevious-${focus.id}-${item}`);
            focusLabelElement.emit(`selectPrevious-${focus.id}-label-${item}`);

            focus.pointer--;
        }
    };
    this.selectNextHandler = function(focus, item){
        if(focus.id!=null){

            var focusElement = document.querySelector(`#${focus.id}`);
            var focusLabelElement = document.querySelector(`#${focus.id}-label`);

            focusElement.emit(`selectNext-${focus.id}-${item}`);
            focusLabelElement.emit(`selectNext-${focus.id}-label-${item}`);

            focus.pointer++;
        }
    };
    this.selectPreviousMenuItem = function(){
        var genealogy = self.genealogy.tree;
        if(self.focus.item>0&&self.focus.item<self.anchor.pointer){
            for(var key in genealogy){
                self.selectPreviousHandler(genealogy[key], self.focus.item);
            }
            self.focus.item--;
            console.log('focus: ',self.focus.item);
        }
        else{
            console.log('reached first most item');
        }
    };
    this.selectNextMenuItem = function(){
        var genealogy = self.genealogy.tree;
        if(self.focus.item>-1&&self.focus.item<self.anchor.pointer-1){
            for(var key in genealogy){
                self.selectNextHandler(genealogy[key], self.focus.item);
            }
            self.focus.item++;
            console.log('focus: ',self.focus.item);
        }
        else{
            console.log('reached ultimate item');
        }
    };
    this.selectCurrentHandler = function(obj, item){
        var current = obj;
        if(current.id!=null){
                console.log('anchor pointer: ', self.anchor.pointer);
                console.log('selected pointer: ', current.pointer);
                console.log('selected id: ', current.id);
                console.log('selected item: ', item);
                var focusElement = document.querySelector(`#${current.id}`);
                focusElement.emit(`highlight-${current.id}`);
                console.log(`highlight ${current.id} to scale ${current.scaleDouble}`);

                var titleElement = document.querySelector(`#highlight-title-container-${current.id}`);
                var summaryElement = document.querySelector(`#highlight-summary-container-${current.id}`);
                var detailsElement = document.querySelector(`#highlight-details-container-${current.id}`);

                titleElement.emit(`reveal-title-${current.id}`);
                summaryElement.emit(`reveal-summary-${current.id}`);
                detailsElement.emit(`reveal-details-${current.id}`);
        }
    };
    this.deselectCurrentHandler = function(obj, item){
        var current = obj;
        if(current.id!=null){
                console.log('deselected item: ', current.id);
                var focusElement = document.querySelector(`#${current.id}`)        
                focusElement.emit(`unhighlight-${current.id}`);//-${item}
                console.log(`unhighlight ${current.id} return to scale ${current.scale}`);

                var titleElement = document.querySelector(`#highlight-title-container-${current.id}`);
                var summaryElement = document.querySelector(`#highlight-summary-container-${current.id}`);
                var detailsElement = document.querySelector(`#highlight-details-container-${current.id}`);

                titleElement.emit(`hide-title-${current.id}`);
                summaryElement.emit(`hide-summary-${current.id}`);
                detailsElement.emit(`hide-details-${current.id}`);
        }
    };
    this.selectCurrentMenuItem = function(focus){
        var selection = self.focus.item;
        console.log('focus: ',self.focus.item)
        var genealogy = self.genealogy.tree;
        var item = self.genealogy.geneArr[selection];
        
        self.selectCurrentHandler(item, selection);
        
    };
    this.deselectCurrentMenuItem = function(focus){
        var selection = self.focus.item;
        console.log('focus: ',self.focus.item)
        var genealogy = self.genealogy.tree;
        var item = self.genealogy.geneArr[selection];
        
        self.deselectCurrentHandler(item, selection);
    };
}