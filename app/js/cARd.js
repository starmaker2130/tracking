// FIRST STAGE FUNCTIONS -- APPLICATION LAUNCH AND UI BUILD
var nightmodeval = 0.5;

function requestFullScreen(element) { //    makes the application fullscreen on fullscreen equipped browsers
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen; // Supports most browsers and their versions.

    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }

    setTimeout(function(){
        UISignalMenuReady();
    }, 500);
}

function UISignalMenuReady(){
    console.log('TODO: UISignalMenuReady handler');
}

// SECOND STAGE

var sessionManager;

function handleAudio(condition){
    switch(condition){
        case 1: //currently playing transition to pause
            console.log('pausing audio...');
            togglePlayPauseUI(false);
            sessionManager.audio.player.pause();
            sessionManager.audio.state = 2;

          //  stopAnimating();
            break;
        case 2: //currently paused, resume playing
            console.log('playing audio...');
            togglePlayPauseUI(true);
            sessionManager.audio.player.play();
            sessionManager.audio.state = 1;

            break;
        default:
            if(sessionManager.audio.player==null){
                sessionManager.audio.player = document.getElementById('audio-player');
                sessionManager.audio.player.addEventListener('ended',function(){
                    selectNewAudioTrack(1);
                });
            }
            handleAudio(2);
    }
}

function togglePlayPauseUI(on){
    if(on){
        $('#play-pause-button').val('||');
    }
    else{
        $('#play-pause-button').val('▶');
    }
}

function selectNewAudioTrack(shift){
    var audioList = sessionManager.application.userData.cardContent.audioList;
    console.log(sessionManager.audio.focus);
    if((shift>0&&((sessionManager.audio.focus+1)<audioList.length))||(sessionManager.audio.focus>0)&&shift<0){
        sessionManager.audio.focus+=shift;
        sessionManager.audio.player.pause();

        loadNewAudioARScene(sessionManager.audio.focus);
        var newSrc = audioList[sessionManager.audio.focus].src;

        $('#song-playing-label').text(audioList[sessionManager.audio.focus].title);

        console.log(newSrc);
        //selectModel(sessionManager.audio.focus);

        $('#audio-source').attr('src', newSrc);
        sessionManager.audio.player.load();
        sessionManager.audio.player.play();
    }
    else{
        console.log('out of range');
    }
}

var userData = {
    cardholder: {
        name: 'Samson Schopenhauer',
        id: 2130
    },
    cardContent: {
        author: 'Patrice-Morgan Ongoly',
        audioList: [
            {
                title: 'Thinking Bout You',
                type: 'song',
                src: '../media/sounds/ThinkingBoutYou.mp3',
                model: {
                    type: 0, // 0 = model file; 1 = code (text/html)
                    src: '../media/immersive/3d/global/models/plane.dae'
                }
            },
            {
                title: 'Love Galore',
                type: 'song',
                src: '../media/sounds/LoveGalore.mp3',
                model: {
                    type: 0, // 0 = model file; 1 = code (text/html)
                    src: '../media/immersive/3d/global/models/plane.dae'
                }
            },
            {
                title: 'Dont Stop Til You Get Enough',
                type: 'song',
                src: '../media/sounds/DontStopTilYouGetEnough.mp3',
                model: {
                    type: 0, // 0 = model file; 1 = code (text/html)
                    src: '../media/immersive/3d/global/models/plane.dae'
                }
            }
        ],
        visualList: [
            {
                title: 'Welcome',
                type: 'song',
                imgSrc: '../media/textures/video.gif',
                audioSrc: './media/test.mp3',
                model: {
                    type: 0, // 0 = model file; 1 = code (text/html)
                    src: '../media/immersive/3d/global/models/plane.dae'
                }
            }
        ]
    }
};

function initializeSession(data){
    sessionManager = {
        audio: {
            player: null,
            isPlaying: false,
            focus: null,
            state: 0 // 0 = inactive; 1 = playing; 2 = paused
        },
        application: {
            focus: 0, // 0 = home; 1 = audio; 2 = visual; 3 = search
            userData: null,
            players: {
                available: [
                    'audioAR',
                    'visualAR'
                ],
                loaded: null
            }
        },
        visual: {
            player: null,
            isPlaying: false,
            focus: null,
            state: 0 // 0 = inactive; 1 = playing; 2 = paused
        },
    };

   // loadAREnvironment(0);
    /**/
    if(data){
        sessionManager.application.userData = data;
        console.log('user data loaded...');
        console.log(sessionManager.application.userData);
    }

    sessionManager.audio.focus = 0;
}

function selectPage(id){
    //console.log(`open ${id}`);
    var selection = id;

    var target;
    switch(selection){
        case 0:
            /*if(sessionManager.application.focus==0){
                console.log('already home');
            }
            else{*/
                sessionManager.application.focus=0;
                target = $('#label-data-container');
                cleanupAREnvironment(target);

                setTimeout(function(){
                    loadAREnvironment(0);
                }, 500);
            //}
            break;
        case 1:
            /*if(sessionManager.application.focus==1){
                console.log('already on audio page');
            }
            else{*/
                sessionManager.application.focus=1;
                target = $('#audio-controls-container');
                cleanupAREnvironment(target);

                setTimeout(function(){
                    loadAREnvironment(1);
                }, 500);
            //}
            break;
        case 2:
            /*if(sessionManager.application.focus==2){
                console.log('already on visual page');
            }
            else{*/
                sessionManager.application.focus=2;
                target = $('#visual-controls-container');
                cleanupAREnvironment(target);


                setTimeout(function(){
                    loadAREnvironment(2);
                }, 500);
            //}
            break;
        case 3:
            /*if(sessionManager.application.focus==3){
                console.log('already on search page');
            }
            else{*/
                sessionManager.application.focus=3;
                target = $('#label-data-container');
                cleanupAREnvironment(target);

                setTimeout(function(){
                    loadAREnvironment(3);
                }, 500);
            //}
            break;
        default:
            console.log('no action possible');
            break;
    }
}

function cleanupAREnvironment(destination){

    var content = document.querySelectorAll('.visible-content');

    for (var i = 0; i< content.length; i++){
        content[i].setAttribute('material', 'visible', 'false');
        content[i].classList.remove('visible-content');
    }

    destination.addClass('page-in-focus').show().animate({
        opacity: 1.0
    }, 1000);
}

function loadAREnvironment(option){
    switch(option){
        case 0:
            var home = document.querySelectorAll('.home-content');

            for(var i=0; i<home.length; i++){
                home[i].setAttribute('material', 'visible', 'true');
                home[i].classList.add('visible-content')
                console.log('home content loaded');
            }
            break;
        case 1:
            loadARAudioPlayer();
            break;
        case 2:
            loadARVisualPlayer();
            break;
        case 3:
            var search = document.querySelectorAll('.search-content');

            for(var i=0; i<search.length; i++){
                search[i].setAttribute('material', 'visible', 'true');
                search[i].classList.add('visible-content')
            }
            break;
        default:
            console.log('no ar env found.');
            break;
    }
}

function loadARAudioPlayer(){
    var audio = document.querySelectorAll('.audio-content');

    for (var i = 0; i < audio.length; i++) {
        audio[i].setAttribute('material', 'visible', 'true');
        audio[i].classList.add('visible-content')
    }
}

function loadARVisualPlayer(){
    var visual = document.querySelectorAll('.visual-content');

    for (var i = 0; i < visual.length; i++) {
        visual[i].setAttribute('material', 'visible', 'true');
        visual[i].classList.add('visible-content')
    }
}

function selectNewVisual(shift){
    var visualList = sessionManager.application.userData.cardContent.visualList;
    console.log(sessionManager.visual.focus);

    if((shift>0&&((sessionManager.visual.focus+1)<visualList.length))||(sessionManager.visual.focus>0)&&shift<0){
        sessionManager.visual.focus+=shift;
        loadNewVisualARScene();
    }
    else{
        console.log('out of range');
    }
}

function loadNewAudioARScene(focus){
    var id = focus;
    switch(id){
        case 1:
            firstSongCascade(1);
            break;
        case 2:
            secondSongCascade(1);
            break;
        case 3:
            thirdSongCascade(1);
            break;
        default:
            console.log('no associated animation found');
            break;
    }
}

function firstSongCascade(time){
    var startTime = time; 
    setTimeout(function(){
         document.querySelector('#song-0').emit('cascade0');
     }, startTime);
    setTimeout(function(){
         document.querySelector('#song-0').emit('cascade1');
     }, startTime+300);
    setTimeout(function(){
         document.querySelector('#song-0').emit('cascade2');
     }, startTime+800);
    setTimeout(function(){
         document.querySelector('#song-0').emit('cascade3');
     }, startTime+1500);
    setTimeout(function(){
         document.querySelector('#song-0').emit('cascade4');
     }, startTime+1800);
    setTimeout(function(){
         document.querySelector('#song-0').emit('cascade5');
        document.querySelector('#song-1').emit('cascade5');
        document.querySelector('#song-2').emit('cascade5');
     }, startTime+2500);/**/
}

function secondSongCascade(time){
    var startTime = time; 
    setTimeout(function(){
         document.querySelector('#song-1').emit('cascade10');
     }, startTime);
    setTimeout(function(){
         document.querySelector('#song-1').emit('cascade11');
     }, startTime+300);
    setTimeout(function(){
         document.querySelector('#song-1').emit('cascade12');
     }, startTime+800);
    setTimeout(function(){
         document.querySelector('#song-1').emit('cascade13');
     }, startTime+1500);
    setTimeout(function(){
         document.querySelector('#song-1').emit('cascade14');
     }, startTime+1800);
    setTimeout(function(){
         document.querySelector('#song-0').emit('cascade15');
        document.querySelector('#song-1').emit('cascade15');
        document.querySelector('#song-2').emit('cascade15');
     }, startTime+2500);/**/
}

function thirdSongCascade(time){
    var startTime = time; 
    setTimeout(function(){
         document.querySelector('#song-2').emit('cascade20');
     }, startTime);
    setTimeout(function(){
         document.querySelector('#song-2').emit('cascade21');
     }, startTime+300);
    setTimeout(function(){
         document.querySelector('#song-2').emit('cascade22');
     }, startTime+800);
    setTimeout(function(){
         document.querySelector('#song-2').emit('cascade23');
     }, startTime+1500);
    setTimeout(function(){
         document.querySelector('#song-2').emit('cascade24');
     }, startTime+1800);
    setTimeout(function(){
         document.querySelector('#song-0').emit('cascade25');
        document.querySelector('#song-1').emit('cascade25');
        document.querySelector('#song-2').emit('cascade25');
     }, startTime+2500);/**/
}

function loadNewVisualARScene(){    

}

function firstAnimation(){
    setTimeout(function(){
        floorAppear();

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

        setTimeout(function(){
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
                    sessionManager.application.focus = 0;
                },1000);

            }, 2500)

        }, 4000);
    }, 1000);

    setTimeout(function(){
        document.querySelector('#statue').emit('float');
    }, 8000);
}

function floorAppear(){
    document.querySelector('#floor').emit('appear');
}

$(document).ready(function(){
    initializeSession(userData);

    // FIRST STAGE
    $('#launch-application-page').click(function(){

        console.log('application launch...');

        var elem = document.body;
        requestFullScreen(elem);

        handleAudio(sessionManager.audio.focus);

        $(this).animate({
            height: 0
        }, 2500, function(){
            $(this).hide();

            firstAnimation();
        });
    });

    // SECOND STAGE -- music control layer

    $('#play-pause-button').click(function(){
        handleAudio(sessionManager.audio.state);
    });

    $('.left-selector').click(function(){
        if(sessionManager.application.focus==1){
            selectNewAudioTrack(-1);
        }
        else if(sessionManager.application.focus==2){
            selectNewVisual(-1);
        }
        else{
            console.log('action not available');
        }
    });

    $('.right-selector').click(function(){
        if(sessionManager.application.focus==1){
            selectNewAudioTrack(1);
        }
        else if(sessionManager.application.focus==2){
            selectNewVisual(1);
        }
        else{
            console.log('action not available');
        }
    });

    $('.panel-option').click(function(){
        /*var id = $(this).attr('id');
        id = id.substring(0, id.indexOf('-'));*/
        if(sessionManager.application.focus<3){
            sessionManager.application.focus++;
        }
        else{
            sessionManager.application.focus=0;
        }
        selectPage(sessionManager.application.focus);
    })


    // THIRD STAGE -- ar geometry control layer

    // link a function to the page selection flow that loads the corresponding model

    //main = user model

    // music = album list

    // visual = visual list

    // search = thought bubble, recommendations are visuals --> related images, models, project covers
});
