"use strict";
/*eslint no-undef: "error"*/
/*eslint-env node*/
/*global document, window, navigator*/
/*eslint no-console: ["error", { allow: ["log"] }] */
/*eslint no-unused-vars: "error"*/

/* github edition */

function UserChannel(socket){
    self = this;
    this.socket = {
        obj: socket,// /*0*/ add time stamp instead
        print: function(){
            console.log(self.socket.obj)
        }
    }
}

function gotDevices(deviceInfos) {
    var videoSelect = document.getElementById('videoSource');
    for (var i = 0; i !== deviceInfos.length; ++i) {
        var deviceInfo = deviceInfos[i];
        var option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        
        console.log('['+i+'] '+deviceInfo.kind);
        
        if (deviceInfo.kind === 'videoinput') {
            option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
            videoSelect.appendChild(option);
        }
        else {
           // console.log('Found one other kind of source/device: ', deviceInfo);
        }
    }
}

function getStream() {
    var videoSelect = document.getElementById('videoSource');
    //console.log(videoSelect.value);
    
    if (window.stream) {
       // console.log('stream flowing my guy!!!');
        window.stream.getTracks().forEach(function(track) {
            track.stop();
        });
    }

    var constraints = {
        video: {
            deviceId: {exact: videoSelect.value}
        }
    };

    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);
}

function gotStream(stream) {
    window.stream = stream; // make stream available to console
    video.srcObject = stream;
    video.play();
}

function handleError(error) {
    console.log('Error: ', error);
}

function shareBuild(){
    console.log('share build');
    //  $('#debug-console-body').append('\ncompleting...\n\nshare build.');
    
    $('#final-overlay').show().animate({
        height: '100%'
    }, 1000);
    
    setTimeout(function(){
        $('#final-overlay').children().show().animate({
            opacity: 1.0
        }, 1000);
    }, 500);
}

function convertCanvasToImage(canvas) {// store the result of this function in a variable that will represent the file entered in line 57 above
	var image = new Image();
	image.src = canvas.toDataURL("image/png");
	return image;
}

var sessionManager = {
    focus: 0,
    menu: {
        currentlyOpen: -1, //=none; 0 = add/edit object; 1 = ; 2 = code;
    },
    builder: {
        orientation: null,
        addingModel: false,
        addModelFromSource: null,
        scale: null
    }
};

function openSettingsOverlay(selection){
    var target = selection;
    var menus = [
        {
            name: '#add-item-menu',
            bgcolor: 'red'
        },
        {
            name: '#manage-settings-menu',
            bgcolor: 'greenyellow'
        },
        {
            name: '#edit-code-menu',
            bgcolor: 'blue'
        }
    ];
    
    $(menus[target].name).show(500);
    
    $('#settings-overlay').css({
        backgroundColor: menus[target].bgcolor
    });
    
    $('#settings-overlay').show().animate({
        height: '100%'
    }, 1000, function(){
        sessionManager.menu.currentlyOpen = target;
    }); 
}

function closeSettingsOverlay(show, id, color, num){
    var showAnother = show;
    var menuID = id;
    var bgcolor = color;
    var overlay = num;
    
    $('.menu-container').hide(500);
    $('#settings-overlay').animate({
        height: 0
    }, 1000, function(){
        sessionManager.menu.currentlyOpen = -1;
        $(this).hide();
        
        if(showAnother){
            $(menuID).show();
            $('#settings-overlay').css({
                backgroundColor: bgcolor
            });
            openSettingsOverlay(overlay);   
        }
    });
}

function init(socket){ // starts the webcam or phone camera capture
    //var channel = new UserChannel(socket);
    //channel.socket.obj.emit('hello');
    var channel = socket;
    
    var video = document.getElementById('video');
    var videoSelect = document.querySelector('select#videoSource');
    // Get access to the camera!
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Not adding `{ audio: true }` since we only want video now
       navigator.mediaDevices.enumerateDevices().then(gotDevices).then(getStream).catch(handleError);

        videoSelect.onchange = getStream;
        /*
        
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            //video.src = window.URL.createObjectURL(stream);
            video.srcObject = stream;
            video.play();
        });
        
        */
    }
    
    // button event handlers
    
    document.getElementById('landmark-oriented-experience-button').addEventListener('click', function(){
        channel.emit('createScene', {orientation: 0});
        sessionManager.builder.orientation = 0;
    });
    
    document.getElementById('face-oriented-experience-button').addEventListener('click', function(){
        channel.emit('createScene', {orientation: 1});
        sessionManager.builder.orientation = 1;
    });
    
    document.getElementById('hand-oriented-experience-button').addEventListener('click', function(){
        channel.emit('createScene', {orientation: 2});
        sessionManager.builder.orientation = 2;
    });
    
    document.getElementById('gesture-watch-button').addEventListener('click', function(){
        if(sessionManager.builder.addingModel==false){
            var orientation = sessionManager.builder.orientation;
            switch(orientation){
                case 0: //  landmark oriented
                    socket.emit('addObjectToLandmarkOrientedScene');
                    break;
                case 1: //  face oriented
                    socket.emit('addObjectToFaceOrientedScene');
                    break;
                case 2: //  hand oriented
                    socket.emit('addObjectToHandOrientedScene');
                    break;
                default:
                    break;
            }
        }
        else{
            console.log('a model source must be specified before adding it to the scene.');
        }
    });
    
    document.getElementById('generate-experience-button').addEventListener('click', function(){
        $('#specify-model-source-container').animate({
            opacity: 0
        }, 1000, function(){
            $(this).hide();
        });

        channel.emit('generateExperience', {builder: sessionManager.builder});
    });
    
    document.getElementById('register-experience-button').addEventListener('click', function(){
        $('#final-overlay').show().animate({
            height: '100%'
        }, 500);
    });
    
    document.getElementById('submit-user-url').addEventListener('click', function(){
        var entry = $('#user-url-entry').val();
        if(entry==''||entry=='your-room-name'){
            console.log('no entry provided...');
        }
        else{
            registerCustomUserExperience(entry, channel);
        }
    });
    
    document.getElementById('upload-url-button').addEventListener('click', function(){
        var url_input = $('#url-source-input').val();
        var scale_input = $('#model-scale-input').val();
        
        if(url_input=='url-to-file-source'||url_input==''){
            console.log('please enter a url source');
        }
        else{
            console.log('sourcing model from url:');
            console.log(url_input);
            
            if(scale_input==''||scale_input=='xx yy zz'){
                console.log(`default scale chosen: ${scale_input}`);
                scale_input = '0.1 0.1 0.1';
            }
            else{
                console.log(`scale set to ${scale_input}`);
            }
             
            loadModelFromSource(url_input, 0, scale_input);
        }
    });
    
    document.getElementById('upload-browse-button').addEventListener('click', function(){
        var selection = $('.selected-model-icon').attr('id');
        loadModelFromSource(selection, 1, '0.1 0.1 0.1');
    });
    
    $('.model-icon').click(function(){
        var currentModel = sessionManager.builder.addModelFromSource;
        if(currentModel==null){
            $(this).addClass('selected-model-icon');    
        }
        else{
            var prev = $('.selected-model-icon').attr('id');
            $(`#${prev}`).removeClass('selected-model-icon');
            $(this).addClass('selected-model-icon');
        }
    });
}

function registerCustomUserExperience(name, socket){
    var expName = name;
    var channel = socket;
    channel.emit('registerExperience', {userId: 1, name: expName});
}

function askForModelSource(source){
    sessionManager.builder.addingModel = true;
    
    $('#specify-model-source-container').css({
        display: 'block'
    }).animate({
        opacity: 1.0
    }, 500, function(){
         console.log('revealing model source query');
        
        $('#url-source-option').click(function(){
            $('#source-option-container').animate({
                opacity: 0
            }, 250, function(){
                $(this).hide();
                    $('#url-source-option-page').show().animate({
                    opacity: 1.0
                }, 250, function(){
                    console.log('url source option page shown.');
                });
            });
        });
        
        $('#browse-source-option').click(function(){
            $('#source-option-container').animate({
                opacity: 0
            }, 250, function(){
                $(this).hide();
                $('#browse-source-option-page').show().animate({
                    opacity: 1.0
                }, 250, function(){
                    console.log('browse source option page shown.');
                });
            });
        });
    });
}

function loadModelFromSource(source, type, scale){
    switch(type){
        case 0: //  url was provided as source
            sessionManager.builder.addModelFromSource = source;
            break;
        case 1: //  model icon was clicked on for source
            var lib = {
                'eiffel-tower': '../../media/model/eiffel-tower.obj',   
                'soccer-ball': '../../media/model/eiffel-tower.obj',
                'car': '../../media/model/eiffel-tower.obj',
            }
            sessionManager.builder.addModelFromSource = lib[source];
            break;
        default:
            break;
    }
    
    sessionManager.builder.scale = scale;
    
    $('#specify-model-source-container').animate({
        opacity: 0
    }, 500, function(){
        $(this).hide();
        sessionManager.builder.addingModel = false;
    })
}

$(document).ready(function(){
    var socket = io.connect(location.host);
    init(socket);
    socket.on('clearInitialVideoFeed', function(data){
        var video = document.getElementById('video');
        let stream = video.srcObject;
        let tracks = stream.getTracks();

        tracks.forEach(function(track) {
            track.stop();
        });

        video.srcObject = null;
        //video.stop();
        video.style.display = 'none';
    });
    
    socket.on('restartVideoFeed', function(data){
        getStream();
        //video.stop();
        video.style.display = 'block';
    });
    
    socket.on('transitionToBuildView', function(data){
        $('#object-type-list-container').css({
            display: 'block'
        }).animate({
            opacity: 1.0
        }, 500, function(){
            $('#object-type-list-container').on('change', function(){
                var value = document.querySelector('select#object-type-list-container').value;
                console.log(value);
                if(value=='model'){
                    askForModelSource();
                }
                else{
                    var target = $('#specify-model-source-container');
                    if(target.css('opacity')!=0){
                        target.animate({
                            opacity: 0
                        }, 1000, function(){
                            $(this).hide();
                        });
                    }
                }
            })
        });
        
        $('.experience-type-button').animate({
            opacity: 0
        }, 500, function(){
            $(this).hide();
            $('#gesture-watch-button').css({
                display: 'block'
            }).animate({
                opacity: 1.0
            }, 500);
        })
    });
    
    socket.on('paintCanvas', function(data){
        var arr = new Uint8ClampedArray(data.buf); //buffer

        const imgData = new ImageData(
          arr,
          data.cols,
          data.rows
        );
        // set canvas dimensions
        const canvas = document.getElementById('canvas');
        canvas.height = data.rows;
        canvas.width = data.cols;
        // set image data
        const ctx = canvas.getContext('2d');
        ctx.putImageData(imgData, 0, 0);/**/
    });
    
    socket.on('cleanUpExperienceBuilderScene', function(data){
        var numOfObjects = data.amountCreated;
        console.log(`${numOfObjects} were created for this scene`);
        
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        canvas.style.display = 'none';
        document.getElementById('generate-experience-button').style.display = 'none';
        document.getElementById('register-experience-button').style.display = 'block';
    });
    
    socket.on('loadUserARExperience', function(data){
        var markup = data.source;
        
        $('#final-experience-preview-container').append(markup);
        
        //$('#final-experience-preview-container').attr('src', '../media/room/temp');
        
        $('#final-experience-preview-container').css({
            zIndex: 105,
            display: 'block'
        }).animate({
            opacity: 1.0
        });
    });
    
    socket.on('getCurrentObjectType', function(data){
        var objectType = $('#object-type-list-container option:selected').text();
        console.log(`just added a ${objectType} to the scene.`);
        socket.emit('recordCurrentObjectType', {
            type: objectType,
            src: sessionManager.builder.addModelFromSource,
            scale: sessionManager.builder.scale
        });
    });
    
    socket.on('completeRegistration', function(data){
        var complete = data.success;
        if(complete){
            window.location.replace('./');
        }else{
            console.log('there was an error while trying to register the user experience.');
        }
    });
                    
});