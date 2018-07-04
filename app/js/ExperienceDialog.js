function ExperienceDialog() {
    var self = this;
    this.dialog = [];
    this.manager = {
        objectModVisible: false
    };
    this.start = function(handshake){
        var keyphrase = handshake.toLowerCase();
        if(keyphrase=='hello world'){
            console.log('handshake accepted.');
            console.log('starting dialog...');

            $('#dialog-light').css({
                opacity: 0,
                backgroundColor: 'greenyellow'
            }).animate({
                opacity: 1.0
            }, 1000);

            self.dialog.push(keyphrase);
            return true;
        }
        else{
            console.log('...');
            return false;
        }
    };
    this.elements = {
        list: [], //id, type, children, parent,
        tree: {}
    };
    this.model = {
        expressions: [
            'in Universe',
            'add Menu(',
            'addChildMenu(',
            'review'
        ],
        framework: null,
        builder: function(selection, expression){
            var item = selection;
            var phrase = expression;

            setTimeout(function(){
                $('#dialog-input:focus').css({
                        opacity: 0,
                        outline: '3px solid greenyellow'
                    }).animate({
                        opacity: 1.0
                    }, 250);

                $('#dialog-light').css({
                    opacity: 0,
                    backgroundColor: 'greenyellow'
                }).animate({
                    opacity: 1.0
                }, 250); 
            }, 750);

            switch(item){
                case 0: //universe builder
                    $('#backlight').empty().text('ARUniverse').css({
                        opacity: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        border: '2px black solid',
                        color: 'white'
                    }).animate({
                        opacity: 1.0
                    }, 1500);
                    break;
                case 1: //  menu builder
                    var menuPointer = self.elements.list.length;
                    $('#sandbox').append(`<div id='menu-${menuPointer}-container' class='menu-item'><div class='menu-header'>menu-${menuPointer}</div></div>`);

                    phrase = phrase.substring(phrase.indexOf('(')+1, phrase.indexOf(')'));
                    var itemTotal = parseInt(phrase);
                    
                    self.elements.list.push({   //add menu to list of all elements within the universe added during this dialog session
                        id: `menu-${menuPointer}-container`,
                        name: null,
                        children: [],
                        count: 0,
                        parent: null
                    });
                    
                    for(var i=0; i<itemTotal; i++){
                        self.buildChildElements(menuPointer, i);
                    }
                    
                    self.elements.list.count = itemTotal;
                    console.log('child elements count: ', self.elements.list.count);
                    break;
                case 2: //  add child menu
                    var name = 'auto';
                    $(`#menu-${menuPointer}-container`).append(`<div id='menu-${menuPointer}-item-${name} class='menu-child-item'></div>`);
                    break;
            }
        }
    };
    this.buildChildElements = function(itemName, nameValue){
        var item = itemName;
        var name = nameValue;

        var childName = `menu-${item}-item-${name}`;
        
        $(`#menu-${item}-container`).append(`<div id='${childName}' class='menu-child-item'><div id='input-name-${item}-${name}' class='input-name'>item-${name}</div><div id='scale-value-${item}-${name}' class='scale-value'>scale</div></div>`);
        
        console.log(`#menu-${item}-container`);
        

        console.log(childName);
        
        
        var menuInMemory = self.elements.list[item];
        var current = menuInMemory.children.length;
        
        menuInMemory.children.push({
            id: childName,
            name: null,
            modelRefs: null,
            rotation: null,
            scale: null,
            pointer: current
        });
        
        self.elements.tree[childName] = current;
        
        $('#'+childName).click(function(){
            var vis = self.manager.objectModVisible;
            if(vis){
                $('#object-modifier').animate({
                    opacity: 0,
                    width: '0'
                }, 1500, function(){
                    $(this).hide();
                });
                vis = false;
            }
            else{
                $('#object-modifier').show().animate({
                    opacity: 1.0,
                    width: '300px'
                }, 1500);
                vis = true;
            }
            
            var elementLocus = self.elements.tree[childName];
            console.log(menuInMemory);
            
            $('#object-modifier-header').empty().text(childName);
            
            console.log('added child element: ',childName);
            console.log('located at locus ', elementLocus);
            console.log('-----------------------------');
            console.log(menuInMemory.children[elementLocus]);
            console.log('-----------------------------');
            
            //TODO: reveal object for from the side; includes inputs for all the attributes of the object and a save button; once save is pressed the name appears as does an icon or number on the screen
        });

    }
    this.filter = function(input, item){
        var expression = input;
        var keyphrase = self.model.expressions[item];
        if(expression.indexOf(keyphrase)>-1){
            console.log('key phrase present: ', keyphrase);

            if(keyphrase=='review'){
                console.log('current dialog');
                self.dialog.push(expression);
                console.log(self.dialog);
            }
            if(keyphrase=='in Universe'){
                if(self.dialog.indexOf(keyphrase)<0){
                    $('#dialog-input:focus').css({
                        opacity: 0,
                        outline: '3px solid blue'
                    }).animate({
                        opacity: 1.0
                    }, 250);

                    $('#dialog-light').css({
                        opacity: 0,
                        backgroundColor: 'blue'
                    }).animate({
                        opacity: 1.0
                    }, 250, function(){
                        self.dialog.push(expression);
                        self.model.builder(0);
                    });
                }
                else{
                    console.log('universe already created...');
                    console.log('this model does not support multiple universes.')
                }
            }
            if(keyphrase=='add Menu('){
                console.log('adding menu...');
                self.dialog.push(expression);
                self.model.builder(1, expression);
                $('#dialog-light').css({
                    opacity: 0,
                    backgroundColor: 'blue'
                }).animate({
                    opacity: 1.0
                }, 250);
            }
        }
        else{
            console.log('no key phrase present. dialogue ignored.');
        }
    };
    this.listen = function(dialogue){
        var speech = dialogue;
        if(self.dialog.length==0){
            self.start(speech);
        }
        else{
            for(var i=0; i<self.model.expressions.length; i++){
                self.filter(speech, i);
            }
        }
    }
}