"use strict";
/*eslint no-undef: "error"*/
/*eslint-env node*/
/*global document, window, navigator*/
/*eslint no-console: ["error", { allow: ["log"] }] */
/*eslint no-unused-vars: "error"*/

/* github edition */

var innerImageURL = null;    
var fullMarkerURL = null;

function updateFullMarkerImage(){
    // get patternRatio; document.querySelector('#patternRatioSlider').value
    
    var patternRatio = 50/100;
    
    THREEx.ArPatternFile.buildFullMarker(innerImageURL, patternRatio, function onComplete(markerUrl){
        fullMarkerURL = markerUrl;
        var fullMarkerImage = document.createElement('img');
        fullMarkerImage.src = fullMarkerURL;
        // put fullMarkerImage into #imageContainer
        var container = document.querySelector('#imageContainer');
        while (container.firstChild) container.removeChild(container.firstChild);
        container.appendChild(fullMarkerImage);
    });
}

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
    var videoSelect = document.querySelector('select#videoSource');
    for (var i = 0; i !== deviceInfos.length; ++i) {
        var deviceInfo = deviceInfos[i];
        var option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        
        if (deviceInfo.kind === 'videoinput') {
            option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
            videoSelect.appendChild(option);
        }
        else {
            console.log('Found one other kind of source/device: ', deviceInfo);
        }
    }
}

function getStream() {
    var videoSelect = document.querySelector('select#videoSource');
    
    if (window.stream) {
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
    //video.play();
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

function returnToCamera(context){
    // clear canvas
    var ctx = context;
    ctx.clearRect(0, 0, 250, 250);
    
    $('#canvas-container').css({
        backgroundColor: 'white',
        zIndex: '-50'
    }).css({
        border: '0',
    }, 1500, function(){
        
    });
    
    $('.generation-step-button').animate({
        opacity: 0
    }, 1000, function(){
        $(this).hide();
        $('.marker-capture-button').show().animate({
            opacity: 1.0
        }, 500);
    });
}

function saveRawMarkerImage(context){
    var ctx = context;
    
    THREEx.ArPatternFile.encodeImageURL(innerImageURL, function onComplete(patternFileString){
        $.ajax({
            type: "POST",
            url: './generate', /* customize depending on deployment */
            data: {
                src: innerImageURL,
                pattern: patternFileString
            },
            success: function(data){
                console.log(`success: ${data}`);
                /*var video = document.getElementById('video');
                let stream = video.srcObject;
                let tracks = stream.getTracks();

                tracks.forEach(function(track) {
                    track.stop();
                });

                video.srcObject = null;
                //video.stop();
                video.style.display = 'none';*/
                
               /* var experience = $('#experience-container');
                
                experience.attr('src', './media/room/auto');
                experience.css({
                    zIndex: 75
                }).show().animate({
                    opacity: 1.0
                }, 1000);*/
            },
            dataType: 'text'
        });
    });

    $('.marker-decision-button').animate({
        opacity: 0
    }, 500, function(){
        $(this).hide();
        
        $('#canvas-container').show().animate({
            opacity: 0
        }, 500, function(){
            $(this).css({
                zIndex: '-50'
            });
        });
        
        $('#share-build-button').show().animate({
            opacity: 1.0
        }, 500, function(){
            $('#share-build-button').css({
                zIndex: 50
            });
        });
        
        $('.build-scene-button:not(#share-build-button)').show().css({
            display: 'inline-block'
        }).animate({
            opacity: 1.0
        }, 500, function(){
            $('#share-build-button').css({
                zIndex: 50
            });
        });
    })
}

function cropAndGenerateMarker(canvas, context, video){
    // output changes made to console
    //$('#debug-console-body').append('\nphoto taken. \ntransitioning to second step...');
    var cv = canvas;
    // setup marker crop scene
    var ctx = context;
    ctx.drawImage(video, 0, 0, 250, 250);
    
    //var markerImage = convertCanvasToImage(cv);
    //console.log(markerImage);
    
    canvas.toBlob(function(blob){
        var markerImage = blob;
        
        var reader = new FileReader();
        reader.onload = function(event){
            innerImageURL = event.target.result
            updateFullMarkerImage()
        };
        reader.readAsDataURL(markerImage);  
    });
    
    $('#imageContainer').show().css({
        zIndex: 60
    });

    $('#canvas-container').css({
        backgroundColor: 'black',
        zIndex: 50
    }).css({
        /*borderColor: '#3',*/
        borderStyle: 'dashed'
    }).animate({
        borderWidth: '100px;',
    }, 1500, function(){
        
    });
    
    // revealing marker decision options (save or cancel and retake photo/upload an image)
    $('.marker-capture-button').animate({
        opacity: 0
    }, 500, function(){
        $(this).hide();
        $('.generation-step-button').show().animate({
            opacity: 1.0
        }, 500);
    });
    
    // output changes made to console
   // setTimeout(function(){
     //   $('#debug-console-body').append('\n\nmarker decision options visible.');
    //}, 1500);
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

function init(socket){
    //var channel = new UserChannel(socket);
    //channel.socket.obj.emit('hello');
    
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

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    // Trigger photo take
    document.getElementById("take-marker-photo-button").addEventListener("click", function() {
        cropAndGenerateMarker(canvas, context, video);
        
        //context.drawImage(video, 0, 0, 300, 250);
        //TODO: add shutter sound
    });
    
    document.getElementById('return-to-camera-button').addEventListener('click', function(){
        returnToCamera(context);
    });
    
    document.getElementById('save-marker-button').addEventListener('click', function(){
        saveRawMarkerImage(context);
    });
    
    document.getElementById('share-build-button').addEventListener('click', function(){
        shareBuild();
    });
    
    document.getElementById('ar-item-menu').addEventListener('click', function(){
        if(sessionManager.menu.currentlyOpen>-1){
            closeSettingsOverlay(true, '#add-item-menu', 'red', 0);
        }
        else{
            openSettingsOverlay(0);
        }
    });
    
    document.getElementById('add-menu-child-element').addEventListener('click', function(){
        addChildObject();
    });
    
    var objectsInScene = [];
    
    function addChildObject(){
        var proceedToAdd = checkObjectConstructorValues();
        
        if(proceedToAdd){
            var count = objectsInScene.length;
        
            $('#camera-container').append(`<div id='child-object-${count}' class='child-object'></div>`);
            
            console.log(`adding object ${count} to scene`);
            console.log(proceedToAdd);

            objectsInScene.push({
                id: `child-object-${count}`,
                name: proceedToAdd.name,
                src: proceedToAdd.src,
                rot: proceedToAdd.rot,
                scale: proceedToAdd.scale
            });
            
            closeSettingsOverlay(false);
        }
    }
    
    function checkObjectConstructorValues(){
        
        var modelName = $('#model-name').val();
        var modelSource = $('#model-source').val();
        var modelRotationValue = $('#model-rotation-value').val();
        var modelScaleValue = $('#model-scale-value').val();
        
        if(modelName == 'object name' || modelSource == 'source, e.g. "../media/models/model.obj"' || modelRotationValue == 'rotation value, e.g. "0 90 0"' || modelScaleValue == 'scale value, e.g. "1 1 1"' || modelName == '' || modelSource == '' || modelRotationValue == '' || modelScaleValue == ''){
            console.log('incomplete form');
            return false;
        }
        else{
            return {
                name: modelName,
                src: modelSource,
                rot: modelRotationValue,
                scale: modelScaleValue
            };
        }
    }
    
    document.getElementById('cancel-menu-edit').addEventListener('click', function(){
        closeSettingsOverlay(false);
    });
    
    document.getElementById('setting-menu').addEventListener('click', function(){
        if(sessionManager.menu.currentlyOpen>-1){
            closeSettingsOverlay(true, '#setting-menu', 'greenyellow', 1);
        }
        else{
            openSettingsOverlay(1);
        }
    });
    
    document.getElementById('cancel-settings-update-button').addEventListener('click', function(){
        closeSettingsOverlay(false); 
    });
    
    document.getElementById('code-menu').addEventListener('click', function(){
        if(sessionManager.menu.currentlyOpen>-1){
            closeSettingsOverlay(true, '#edit-code-menu', 'blue', 2);
        }
        else{
            openSettingsOverlay(2);
        }
    });
    
    document.getElementById('cancel-code-edit-update-button').addEventListener('click', function(){
        closeSettingsOverlay(false); 
    });
    
    document.querySelector('#buttonDownloadEncoded').addEventListener('click', function(){
        
        if( innerImageURL === null ){
            alert('upload a file first')
            return;
        }
        
        console.assert(innerImageURL);
        
        THREEx.ArPatternFile.encodeImageURL(innerImageURL, function onComplete(patternFileString){
            THREEx.ArPatternFile.triggerDownload(patternFileString);
        });
    });

    document.querySelector('#buttonDownloadFullImage').addEventListener('click', function(){
        // debugger
        
        if( innerImageURL === null ){
            alert('upload a file first');
            return;
        }
        
        // tech from https://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
        var domElement = window.document.createElement('a');
        domElement.href = fullMarkerURL;
        domElement.download = 'marker.png';
        document.body.appendChild(domElement);
        domElement.click();
        document.body.removeChild(domElement);
    });
    
    document.getElementById('hov-home-button').addEventListener('click', function(){
        window.location.replace('./');
    });
}

$(document).ready(function(){
    var socket = 0; //  io.connect(location.host);
    init(socket);
});