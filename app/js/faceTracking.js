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
    }
        
    document.getElementById('generate-experience-button').addEventListener('click', function(){
        channel.emit('createScene', {orientation: 1});
        sessionManager.builder.orientation = 1;
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
            });
        });
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
        //document.getElementById('register-experience-button').style.display = 'block';
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