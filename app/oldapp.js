// author(s):  Patrice-Morgan Ongoly
// version: 0.2.2
// last modified: Monday, July 2, 2018 12:32 EST
// description: 

// required modules
var bodyParser = require('body-parser');
var express = require('express');
var formidable = require('formidable');
var util = require('util');
var fs = require('fs');
// main application instance

var app = express();

// main application settings

var config = {
    PORT: process.env.PORT || 8008,
    DIRECTORY: [
        './',
        './css',
        './js',
        './media/texture',
        './media/gifs',
        './media/pattern',
        './media/img',
        './media/sounds',
        './media/model',
        './uploads',
        './drafts/docs',
        './media/upload',
        './media/room',
        './media/img/bg',
        './media/room/media/model'
    ]
};

var dir = config.DIRECTORY;

app.engine('html', require('ejs').renderFile);

/*

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

*/

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.static('/'));

app.get('/', function(req, res){
    res.render('index.html',{root: dir[0]});
});

app.get('/rfid', function(req, res){
    res.render('empty-rfid.html',{root: dir[0]});
});

app.get('/pamo', function(req, res){
    res.render('pamo.html',{root: dir[0]});
});

app.get('/postAR', function(req, res){
    res.render('postAR.html',{root: dir[0]});
});

app.get('/touch', function(req, res){
    res.render('touch.html',{root: dir[0]});
});

app.get('/mind', function(req, res){
    res.render('mindwave.html', {root: dir[0]});
});

app.get('/cv', function(req, res){
    res.render('cv.html',{root: dir[0]});
});

app.get('/hands', function(req, res){
    res.render('hands.html',{root: dir[0]});
});

app.get('/test', function(req, res){
    res.render('test.html',{root: dir[0]});
});

app.get('/wiki', function(req, res){
    res.render('wiki.html',{root: dir[0]});
});

app.get('/cARd', function(req, res){
    res.render('cARd.html',{root: dir[0]});
});

app.get('/menu', function(req, res){
    res.render('menu.html',{root: dir[0]});
});

app.get('/gallery', function(req, res){
    res.render('gallery.html',{root: dir[0]});
});

app.get('/ar', function(req, res){
    res.render('ar.html',{root: dir[0]});
});

app.get('/vr', function(req, res){
    res.render('vr.html',{root: dir[0]});
});

app.get('/rooms', function(req, res){
    res.render('rooms.html',{root: dir[0]});
});

app.get('/newrooms', function(req, res){
    res.render('newrooms.html',{root: dir[0]});
});

app.post('/upload', function(req, res){

    // create an incoming form object
    var form = new formidable.IncomingForm();

      // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;


    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/uploads/' + file.name;
    });

    form.on('file', function (name, file){
        console.log('uploaded ' + file.name);
       // console.log('TODO: initiate server side reaction');
    });

      // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });

      // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        res.end('success');
    });

      // parse the incoming request containing the form data
    form.parse(req);
});

app.get('/template', function(req, res){
    res.render('template.html',{root: dir[0]});
});

app.get('/css/main.css', function(req, res){
    res.sendFile('main.css', {root: dir[1]});
});

app.get('/css/rfid.css', function(req, res){
    res.sendFile('rfid.css', {root: dir[1]});
});

app.get('/css/menu.css', function(req, res){
    res.sendFile('menu.css', {root: dir[1]});
});

app.get('/css/wiki.css', function(req, res){
    res.sendFile('wiki.css', {root: dir[1]});
});

app.get('/css/rooms.css', function(req, res){
    res.sendFile('rooms.css', {root: dir[1]});
});

app.get('/css/profile.css', function(req, res){
    res.sendFile('profile.css', {root: dir[1]});
});

app.get('/css/form.css', function(req, res){
    res.sendFile('form.css', {root: dir[1]});
});

app.get('/js/:script_id', function(req, res){
    var script_id = req.params.script_id;
    res.sendFile(script_id, {root: dir[2]});
});

app.get('/media/texture/:texture_id', function(req, res){
    var texture_id = req.params.texture_id;
    res.sendFile(texture_id, {root: dir[3]});
});

app.get('/media/gifs/:gif_id', function(req, res){
    var gif_id = req.params.gif_id;
    res.sendFile(gif_id, {root: dir[4]});
});

app.get('/media/pattern/:pattern_id', function(req, res){
    var pattern_id = req.params.pattern_id;
    res.sendFile(pattern_id+'.patt', {root: dir[5]});
});

app.get('/media/img/:img_id', function(req, res){
    var img_id = req.params.img_id;
    res.sendFile(img_id, {root: dir[6]});
});

app.get('/media/sounds/:sound_id', function(req, res){
    var sound_id = req.params.sound_id;
    res.sendFile(sound_id, {root: dir[7]});
});

app.get('/media/model/:model_id', function(req, res){
    var model_id = req.params.model_id;
    res.sendFile(model_id, {root: dir[8]});
});

app.get('/uploads/:upload_id', function(req, res){
    var upload_id = req.params.upload_id;
    res.sendFile(upload_id, {root: dir[9]});
});

app.get('/drafts/docs/:doc_id', function(req, res){
    var doc_id = req.params.doc_id;
    res.sendFile(doc_id, {root: dir[10]});
});

app.get('/media/room/:room_id', function(req, res){
    var room_id = req.params.room_id;
    res.sendFile(room_id+'.html', {root: dir[12]});
});

app.get('/media/room/media/model/:room_model_id', function(req, res){
    var room_model_id = req.params.room_model_id;
    res.sendFile(room_model_id, {root: dir[14]});
});

app.get('/media/img/bg/:img_id', function(req, res){
    var img_id = req.params.img_id;
    res.sendFile(img_id, {root: dir[13]});
});

app.get('/css/roomsapp/:style_id', function(req, res){
    var style_id = req.params.style_id;
    res.sendFile('roomsapp/'+style_id, {root: dir[1]});
});

app.get('/css/postARapp/:style_id', function(req, res){
    var style_id = req.params.style_id;
    res.sendFile('postARapp/'+style_id, {root: dir[1]});
});

app.post('/generate', function(req, res){
    var src = req.body.src;
    var patt = req.body.pattern;

  //  console.log(src);
    console.log('------------------------');
    console.log(patt);
    
    // save pattern in local patt file
    fs.writeFile(dir[5]+'/auto.patt', patt, function (err) {
        if (err) {
            return console.log('there is an error saving the pattern');
        }
 
        console.log('the pattern file was saved');
    });
    
    // build ar-template page markup
    var markup = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1.0' />
        <title>AR Template | v 0.9.1</title>
        <link rel='stylesheet' type='text/css' href='../../css/roomsapp/profile.css' />
        <script src='../../js/jquery-3.2.1.min.js'></script>
        <script src='../../js/aframe.min.js'></script>
        <script src="https://rawgit.com/mayognaise/aframe-gif-shader/master/dist/aframe-gif-shader.min.js"></script>
        <script src='../../js/ar.min.js'></script>
        <script>
            var sessionManager;

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
            }

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

                sessionManager.audio.focus = 0;
            }

            $(document).ready(function(){
                initializeSession();

                // FIRST STAGE
                $('#launch-application-page').click(function(){

                    console.log('application launch...');

                    var elem = document.body;
                    //requestFullScreen(elem);

                    $(this).animate({
                        height: 0
                    }, 2500, function(){
                        $(this).hide();
                    });
                });

            });
        </script>
    </head>
    <body>
        <div id='launch-application-page' class='entry-layer overlay'>
            <div id='instructions'>
                tap anywhere
                <div id='logo'></div>
                to launch app
            </div>
        </div>
        <div class='control-layer overlay'>
        </div>
        <!-- FOR PRODUCTION PURPOSES ONLY-->
        <a-scene embedded arjs id='main-app-container' class='viewer-layer'>
            <a-assets>
                <img id='floor-texture' src='../../media/texture/grid_pattern.png' preload='true' />
            </a-assets>

            <!--<a-marker preset='hiro'>-->
            <a-marker preset='custom' type='pattern' url='../../media/pattern/auto'>
                <a-entity id='floor'
                          geometry='primitive: plane; width: 1; height: 1;'
                          material='src: #floor-texture; repeat: 1 1;'
                          text='value: origin; width: 4; color: white; align: center;'
                          position='0 0 0'
                          rotation='-90 0 0'>
                </a-entity>
            </a-marker>

            <a-camera-static />
        </a-scene>
    </body>
    </html>`
    
    // save markup into actual file
    fs.writeFile(dir[12]+'/auto.html', markup, function (err) {
        if (err) {
            return console.log('there is an error building the markup');
        }
 
        console.log('the markup file was saved');
    });
    res.end('success');
});

var main_history = [];
var template_history = [];
var vr_history = [];
var completedProfiles = {};

var last = null;
var pingCount = 0;

/* syntax for user defined addresses
*  viewed as hov.fun/your-experience-url
*
*  'your-experience-url' : {
        timestamp: Date(), //currentTime
        id: socket.id, 
        user: socket
    }
*
*
*/

function wrapConnection(conn){
    var result = {
        socket: conn,
        id: conn.id,
        page: null, //0=home, 1=template
        userData: null
    };
    return result;
}

var io = require('socket.io').listen(app.listen(config.PORT, function(){
    console.log(`[0] listening on port ${config.PORT}`);
}));

var scenes = [];
/*

orientation: 0 = landmark; 1 = face; 2 = hand



*/
io.sockets.on('connection', function(socket){
    var identity = wrapConnection(socket);
    console.log('client connected...');
    
    socket.on('identify', function(data){
        identity.page = data.page;
        var section = identity.page;
        
        if(section==0){
            main_history.push(identity);
            console.log(`main page visitor # ${main_history.length}`);
        }
        else if(section==1){
            template_history.push(identity);
            console.log(`template platform visitor # ${template_history.length}`);
        }
        else if(section==2){
            vr_history.push(identity);
            console.log(`vr main page visitor # ${vr_history.length}`);
        }
    });
    
    socket.on('startWebcamCapture', function(data){
        var settings = data;
        var target = data.target;// 0 = default = backend only; 1 = front-end only
        var delay = data.renderRate;
        if (settings.test==0){
            facialRecognitionTest(socket, target, delay);
        }
        else if(settings.test==1){
            gestureTrackingTest(socket, target, delay);
        }
        else{
            console.log('test value not recognized.')
        }
    });
    
    socket.on('startMindwave', function(data){
        var Mindwave = require('mindwave');
        var mw = new Mindwave();

        mw.on('eeg', function(eeg){
            console.log('eeg', eeg);
        });

       /* mw.on('signal', function(signal){
            console.log('signal', signal);
        });

        mw.on('attention', function(attention){
            console.log('attention', attention);
        });

        mw.on('meditation', function(meditation){
            console.log('meditation', meditation);
        });

        mw.on('blink', function(blink){
            console.log('blink', blink);
        });*/

        // These are the raw EEG data
        // They come in at about 512Hz
        // mw.on('wave', function(wave){
        // 	console.log('wave', wave);
        // });
///dev/cu.MindWaveMobile-DevA
        mw.connect('/dev/tty.MindWaveMobile-DevA');
        socket.emit('mindwaveStarted', {success: true});
    });

    socket.on('createScene', function(data){
        var ori = data.orientation;
        
        socket.emit('clearInitialVideoFeed', {status: 1});
        
        switch(ori){
            case 0: // landmark oriented
                landmarkTrackingTest(socket);
                break;
            case 1: // face oriented
                //facialRecognitionTest(socket, 0, 100);
                facialRecognitionTest(socket, 1, 250);
                break;
            case 2: // hand oriented
                //gestureTrackingTest(socket, 0, 100);
                gestureTrackingTest(socket, 1, 250);
                //gestureTrackingTest(socket, 1, 1000);
                break;
            default:
                console.log('no associated orientation found');
                break;
        }
        
        socket.emit('transitionToBuildView', {buildType: ori});
    });
    
    // TODO DEFINE THUMBS UP gesture to provide  means for exiting the building mode
    
    socket.on('addObjectToLandmarkOrientedScene', function(data){
        console.log('TODO: add object to landmark scenery');
    });
    
    socket.on('addObjectToFaceOrientedScene', function(data){
        console.log('TODO: add object to face scenery');
        
        // TODO change global variable switch that triggers buffer output from that of the face box (eventually mesh) mesh to that of a mask, sunglasses, or heads up display
        // TODO to swipe through the options after the initial change gesture tracking should be involved, e.g. making a motion to wipe your face brings up a new mask
    });
    
    socket.on('addObjectToHandOrientedScene', function(data){
        console.log('TODO: add object to hand scenery');
        if(objectsInSceneHandler.adding){
            objectsInSceneHandler.adding = false;
            objectsInSceneHandler.saveLastVertex = true;
        }
        else{
            objectsInSceneHandler.adding = true;
        }
        // TODO change global variable switch that triggers buffer output from that of the hand mesh to that of the ball
    });
    
    socket.on('generateExperience', function(data){
        console.log(objectsInSceneHandler.points);
        var builder = data.builder;
        var type = builder.orientation;
        console.log('--------------------------');
        console.log('builder:');
        console.log(builder);
        console.log('--------------------------');
        console.log('type:')
        console.log(type);
        console.log('--------------------------');
        
        switch(type){
            case 0:
                console.log('stopping landmark scene builder...');
                
                clearInterval(objectsInSceneHandler.gestureInterval);
                
                console.log('hand gesture tracking stopped.');
                break;
            case 1:
                console.log('stopping face oriented scene builder...');
                
                clearInterval(objectsInSceneHandler.starter);
                
                console.log('face tracking stopped.');
                break;
            case 2:
                console.log('stopping hand oriented scene builder...');
                
                clearInterval(objectsInSceneHandler.gestureInterval);
                
                console.log('hand gesture tracking stopped.');
                break;
            default:
                console.log('no experience generator associated with this type.');
                break;
        }
                
        socket.emit('cleanUpExperienceBuilderScene', {amountCreated: objectsInSceneHandler.points.length});
        
        var experience = buildUserARExperience();   // builder
        objectsInSceneHandler.build.markup = `<!DOCTYPE html>
            <html>
            <head>
                <meta charset='utf-8' />
                <meta name='viewport' content='width=device-width,initial-scale=1.0' />
                <title>AR Template | v 0.9.1</title>
                <link rel='stylesheet' type='text/css' href='../../css/roomsapp/profile.css' />
                <script src='../../js/jquery-3.2.1.min.js'></script>
                <script src='../../js/aframe.min.js'></script>
                <script src="https://rawgit.com/mayognaise/aframe-gif-shader/master/dist/aframe-gif-shader.min.js"></script>
                <script src='../../js/ar.min.js'></script>
                <script>
                    var sessionManager;

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
                    }

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

                        sessionManager.audio.focus = 0;
                    }

                    $(document).ready(function(){
                        initializeSession();

                        // FIRST STAGE
                        $('#launch-application-page').click(function(){

                            console.log('application launch...');

                            var elem = document.body;
                            //requestFullScreen(elem);

                            $(this).animate({
                                height: 0
                            }, 2500, function(){
                                $(this).hide();
                            });
                        });

                    });
                </script>
            </head>
            <body>
                <div id='launch-application-page' class='entry-layer overlay'>
                    <div id='instructions'>
                        tap anywhere
                        <div id='logo'></div>
                        to launch app
                    </div>
                </div>
                <div id='main-app-container' class='viewer-layer'>
                <a-scene embedded>
                    <a-assets>
                        <img id='floor-texture' src='../../media/texture/grid_pattern.png' preload='true' />
                    </a-assets>`+experience+`</a-scene></div></body></html>`;
        
        setTimeout(function(){
            if(type==2){
                objectsInSceneHandler.webcam.release();
                //objectsInSceneHandler.webcam = null;    
            }
            
            socket.emit('loadUserARExperience', {status: 1, source: experience});
            
            setTimeout(function(){
                socket.emit('restartVideoFeed', {status: 1});
            }, 500);
        }, 500);
        
    });
    
    socket.on('recordCurrentObjectType', function(data){
        var type = data.type;
        var source = data.src;
        var scale = data.scale;
        objectsInSceneHandler.objectList.push({type: type, src: source, scale: scale});
    });
    
    socket.on('registerExperience', function(data){
        var fileName = '/'+data.name+'.html';
        
        var markup = objectsInSceneHandler.build.markup;
        
        fs.writeFile(dir[12]+fileName, markup, function (err) {
            if (err) {
                return console.log('there is an error building the markup');
            }

            console.log('the user experience was built and saved. \n file registered in system.');
        });
        
        socket.emit('completeRegistration', {success: true});
    });
    
    socket.on('disconnect', function(){
        console.log(`socket ${socket.id} disconnected.`);
    });
});

function compileObjectMarkup(item, markup){ //, experienceBuilder
    var objectMarkup = markup;
    var i = item;
    var colorArr = [
        'yellow',
        'green',
        'blue',
        'red',
        'purples',
        'orange'
    ];
    
    var objectOrigin = objectsInSceneHandler.points[i];

    var filter = {
        x: objectOrigin.x/100,
        y: objectOrigin.y/100,
        z: 0
    };
    
    var defaultModelMarkup = `<a-entity obj-model="obj: url(media/model/eiffel-tower.obj); mtl: url(media/model/eiffel-tower.mtl)" scale="0.05 0.05 0.05" position="${filter.x} ${filter.y} ${filter.z}"></a-entity>`;
    
    var objectName = objectsInSceneHandler.objectList[i].type;
    
    var objectGeometryLib = {
        'sphere': `<a-sphere color="${colorArr[i]}" position="${filter.x} ${filter.y} ${filter.z}" radius="1"></a-sphere>`,
        'tetra': `<a-tetrahedron color="${colorArr[i]}" position="${filter.x} ${filter.y} ${filter.z}" radius="1"></a-tetrahedron>`,
        'cube': `<a-box color="${colorArr[i]}" position="${filter.x} ${filter.y} ${filter.z}"  depth="1" height="1" width="1"></a-box>`,
        'model': null
    };
    
    if(objectName=='model'){
        var modelSource = objectsInSceneHandler.objectList[i].src;
        var modelScale = objectsInSceneHandler.objectList[i].scale;
        
        defaultModelMarkup = `<a-entity obj-model="obj: url(${modelSource});" scale="${modelScale}" color="${colorArr[i]}" position="${filter.x} ${filter.y} ${filter.z}"></a-entity>`;
        
        console.log(`adding model located at ${modelSource} with scale ${modelScale}`);
    }
    
    objectGeometryLib.model = defaultModelMarkup;
    
    objectMarkup += objectGeometryLib[objectName];
    return objectMarkup;
}

function buildUserARExperience(){   //experienceBuilder
    //var builder = experienceBuilder;
    //console.log('TODO: build user ar experience');
    var objectMarkup = '';
    
    for(var i=0; i<objectsInSceneHandler.points.length; i++){
        objectMarkup = compileObjectMarkup(i, objectMarkup);    //, builder
    }
    
    
    var markup = objectMarkup+`
            <!--<a-entity id='floor'
                      geometry='primitive: plane; width: 100; height: 100;'
                      material='src: #floor-texture; repeat: 100 100;'
                      position='0 0 0'
                      rotation='-90 0 0'>
            </a-entity>-->
            
            <a-entity position="3 1.5 5">
                <a-entity camera="active: true" look-controls wasd-controls></a-entity>
            </a-entity>

            <a-sky material='transparent: true; opacity: 0; color: white;'></a-sky>`
    
    // save markup into actual file
    /*fs.writeFile(dir[12]+'/temp.html', markup, function (err) {
        if (err) {
            return console.log('there is an error building the markup');
        }
 
        console.log('the markup file was saved');
    });*/
    //write the file after the experience name is approved
    
    return markup;
}

var objectsInSceneHandler = {
    points: [],
    adding: false,
    saveLastVertex: false,
    gestureInterval: null,
    starter: null,
    webcam: null,
    objectList: [],
    build: {
        markup: ''
    }
};

function landmarkTrackingTest(source){
    var channel = source;
    console.log('launch landmark orientation handling function');
    console.log(channel.id);
    gestureTrackingTest(channel, 0, 100);
}

function gestureTrackingTest(source, target, renderRate){
    
    var delayInterval = renderRate;
    var objectTarget = target;
    var socket = source;
    
    console.log('TODO: add gesture tracking test');
    
    const cv = require('opencv4nodejs');
    
    const skinColorUpper = hue => new cv.Vec(hue, 0.8 * 255, 0.6 * 255);
    const skinColorLower = hue => new cv.Vec(hue, 0.1 * 255, 0.05 * 255);
    
    const devicePort = 0;
    
    objectsInSceneHandler.webcam = new cv.VideoCapture(devicePort);
    const wCap = objectsInSceneHandler.webcam;
    
    
    const makeHandMask = function(img){
      // filter by skin color
        const imgHLS = img.cvtColor(cv.COLOR_BGR2HLS);
        const rangeMask = imgHLS.inRange(skinColorLower(0), skinColorUpper(15));

      // remove noise
        const blurred = rangeMask.blur(new cv.Size(10, 10));
        const thresholded = blurred.threshold(200, 255, cv.THRESH_BINARY);

        return thresholded;
    };
    
    const getHandContour = function(handMask){
        const contours = handMask.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
      // largest contour
        return contours.sort((c0, c1) => c1.area - c0.area)[0];
    };
    
    const getRoughHull = function(contour, maxDist) {
  // get hull indices and hull points
        const hullIndices = contour.convexHullIndices();
        const contourPoints = contour.getPoints();
        const hullPointsWithIdx = hullIndices.map(idx => ({
            pt: contourPoints[idx],
            contourIdx: idx
        }));
  
        const hullPoints = hullPointsWithIdx.map(ptWithIdx => ptWithIdx.pt);

  // group all points in local neighborhood
  
        const ptsBelongToSameCluster = (pt1, pt2) => ptDist(pt1, pt2) < maxDist;
        const { labels } = cv.partition(hullPoints, ptsBelongToSameCluster);
        const pointsByLabel = new Map();
        labels.forEach(l => pointsByLabel.set(l, []));
  
        hullPointsWithIdx.forEach((ptWithIdx, i) => {
            const label = labels[i];
            pointsByLabel.get(label).push(ptWithIdx);
        });

  // map points in local neighborhood to most central point

        const getMostCentralPoint = function(pointGroup) {
        // find center
            const center = getCenterPt(pointGroup.map(ptWithIdx => ptWithIdx.pt));
        // sort ascending by distance to center
            return pointGroup.sort((ptWithIdx1, ptWithIdx2) => ptDist(ptWithIdx1.pt, center) - ptDist(ptWithIdx2.pt, center))[0];
        };
        const pointGroups = Array.from(pointsByLabel.values());
      // return contour indices of most central points
        return pointGroups.map(getMostCentralPoint).map(ptWithIdx => ptWithIdx.contourIdx);
    };
    
    const getHullDefectVertices = function(handContour, hullIndices) {
        const defects = handContour.convexityDefects(hullIndices);
        const handContourPoints = handContour.getPoints();

      // get neighbor defect points of each hull point
        const hullPointDefectNeighbors = new Map(hullIndices.map(idx => [idx, []]));
        defects.forEach((defect) => {
            const startPointIdx = defect.at(0);
            const endPointIdx = defect.at(1);
            const defectPointIdx = defect.at(2);
            hullPointDefectNeighbors.get(startPointIdx).push(defectPointIdx);
            hullPointDefectNeighbors.get(endPointIdx).push(defectPointIdx);
        });

        return Array.from(hullPointDefectNeighbors.keys())
        // only consider hull points that have 2 neighbor defects
        .filter(hullIndex => hullPointDefectNeighbors.get(hullIndex).length > 1)
        // return vertex points
        .map((hullIndex) => {
            const defectNeighborsIdx = hullPointDefectNeighbors.get(hullIndex);
            return ({
                pt: handContourPoints[hullIndex],
                d1: handContourPoints[defectNeighborsIdx[0]],
                d2: handContourPoints[defectNeighborsIdx[1]]
            });
        });
    };
    
    const filterVerticesByAngle = function(vertices, maxAngleDeg){
        vertices.filter(function(v) {
            const sq = x => x * x;
            const a = v.d1.sub(v.d2).norm();
            const b = v.pt.sub(v.d1).norm();
            const c = v.pt.sub(v.d2).norm();
            const angleDeg = Math.acos(((sq(b) + sq(c)) - sq(a)) / (2 * b * c)) * (180 / Math.PI);
            return angleDeg < maxAngleDeg;
        });
        return vertices;
    }
    
            // returns distance of two points
    const ptDist = function(pt1, pt2){
        return pt1.sub(pt2).norm();  
    } 
    // returns center of all points
    const getCenterPt = pts => 
    pts.reduce((sum, pt) => sum.add(pt), new cv.Point(0, 0)).div(pts.length);
    const blue = new cv.Vec(255, 0, 0);
    const green = new cv.Vec(0, 255, 0);
    const red = new cv.Vec(0, 0, 255);
    
    const pointColor = new cv.Vec(255, 255, 255);
    
    objectsInSceneHandler.gestureInterval = setInterval(function(){
        wCap.readAsync(function(err, frame){
            if(frame.empty){
                wCap.reset();
            }
            frame = wCap.read();
                        // const { grabFrames } = require('./utils'); <-- investigate this function

            // main
            const resizedImg = frame.resizeToMax(640);

            const handMask = makeHandMask(resizedImg);
            const handContour = getHandContour(handMask);
            if (!handContour) {
                return;
            }

            const maxPointDist = 25;
            const hullIndices = getRoughHull(handContour, maxPointDist);

              // get defect points of hull to contour and return vertices
              // of each hull point to its defect points
            const vertices = getHullDefectVertices(handContour, hullIndices);

              // fingertip points are those which have a sharp angle to its defect points

            const maxAngleDeg = 60;
            
            const verticesWithValidAngle = filterVerticesByAngle(vertices, maxAngleDeg);
            
            //var drawThatCircle = false;
            //var vertext;

    
            const result = resizedImg.copy();
            const ballScene = resizedImg.copy();
              // draw bounding box and center line

            resizedImg.drawContours([handContour], pointColor, { thickness: 2 }); //previous version: blue
            
                        
          //  if(verticesWithValidAngle[0].d1!='undefined'){
            try{
                const xValue = verticesWithValidAngle[0].d1.x;
                const vertext = verticesWithValidAngle[0].d1;
                //console.log(xValue);   
                ballScene.drawCircle(vertext, 20, pointColor, -5);       // previous version: 50, blueblue
                
                if(objectsInSceneHandler.saveLastVertex){
                    objectsInSceneHandler.points.push(vertext);
                    objectsInSceneHandler.saveLastVertex = false;
                    
                    socket.emit('getCurrentObjectType', {index: objectsInSceneHandler.points.length});
                    
                    console.log('object position recorded.')
                    console.log(`there are currently ${objectsInSceneHandler.points.length} custom objects in this scene.`);
                }
            }catch(err){
                console.log(err);
            }
                
          //  }
              // draw points and vertices
            verticesWithValidAngle.forEach(function(v){
        
                // previous version: the section below was not commented out
                
            /*    resizedImg.drawLine( v.pt, v.d1, { color: green, thickness: 2 });
                resizedImg.drawLine(v.pt, v.d2, { color: green, thickness: 2 });*/
                resizedImg.drawEllipse(
                    new cv.RotatedRect(v.pt, new cv.Size(10, 10), 0), // previous version: cv.Size(20, 20, 0)
            
                    { color: red, thickness: 2 }
                );
                
                result.drawEllipse(
                    new cv.RotatedRect(v.pt, new cv.Size(10, 10), 0), // previous version: cv.Size(20, 20, 0)
                    { color: red, thickness: 2 }
                );
            });
            
            for(var i=0; i<objectsInSceneHandler.points.length; i++){
                resizedImg.drawCircle(objectsInSceneHandler.points[i], 25, green, -5);
                ballScene.drawCircle(objectsInSceneHandler.points[i], 25, red, -5);
            }
              // display detection result  
            const numFingersUp = verticesWithValidAngle.length-2;
    
            result.drawRectangle(
                new cv.Point(10, 10),
                new cv.Point(70, 70),
                { color: green, thickness: 2 }            
            );

            const fontScale = 2;
    
            result.putText(
                String(numFingersUp),
                new cv.Point(20, 60),
                cv.FONT_ITALIC,
                fontScale,
                { color: green, thickness: 2 }
            );

            
            const { rows, cols } = result;
            
            if(objectTarget==0){
                const sideBySide = new cv.Mat(rows, cols * 2, cv.CV_8UC3);
                ballScene.copyTo(sideBySide.getRegion(new cv.Rect(0, 0, cols, rows)));//result
                resizedImg.copyTo(sideBySide.getRegion(new cv.Rect(cols, 0, cols, rows)));


                //cv.imshow('handMask', handMask);
                cv.imshow('result', sideBySide); //sideBySide= a combination of result and resizedImg  result = circled finger tips only; resizedImg = vertex covered hand (green and blue lines, red circles)

                cv.waitKey(9); 
            }
            else if(objectTarget==1){
                if(objectsInSceneHandler.adding){
                    const matRGBA = ballScene.channels === 1
                      ? ballScene.cvtColor(cv.COLOR_GRAY2RGBA)
                      : ballScene.cvtColor(cv.COLOR_BGR2RGBA);

                    var bufArray = matRGBA.getData();

                    socket.emit('paintCanvas', {buf: bufArray, rows: ballScene.rows, cols: ballScene.cols, type: 'hand'});  
                }
                else{
                    /* Hand mesh*/
                    const matRGBA = resizedImg.channels === 1
                      ? resizedImg.cvtColor(cv.COLOR_GRAY2RGBA)
                      : resizedImg.cvtColor(cv.COLOR_BGR2RGBA);

                    var bufArray = matRGBA.getData();

                   // console.log(bufArray);

                    socket.emit('paintCanvas', {buf: bufArray, rows: resizedImg.rows, cols: resizedImg.cols, type: 'hand'});/**/    
                }                
            }
        });    
    }, delayInterval);    
}

function facialRecognitionTest(source, target, renderRate){
    
    var delayInterval = renderRate;
    var socket = source;
    var outputTarget = target;
    
    const cv = require('opencv4nodejs');

    const devicePort = 0;
    const wCap = new cv.VideoCapture(devicePort);

    socket.emit('captureResponse', {
        status: 0,
        health: 'good'
    });

    const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
    //var interval = setInterval(function(){
        //frame = wCap.read();
    objectsInSceneHandler.starter = setInterval(function(){
        wCap.readAsync(function(err, frame){
            if(frame.empty){
                wCap.reset();
            }
            frame = wCap.read();
            //cv.imshow('frame', res);
            //cv.imwrite('./media/capture/cap1.png', frame);
            const resizeFrame = frame.resizeToMax(640);
            const grayImg = resizeFrame.bgrToGray();

            classifier.detectMultiScaleAsync(grayImg, function(err, res){
                if (err) { return console.error(err); }

                const { objects, numDetections } = res;
              //  console.log(objects);
            //  console.log(numDetections);

                if (!objects.length) {
                    console.log('no face detected');
                    
                    return;
                }

                  // draw detection
                const facesImg = resizeFrame.copy();
                const numDetectionsTh = 10;
                objects.forEach(function(rect, i){
                    const thickness = numDetections[i] < numDetectionsTh ? 1 : 2;
                    const drawRect = facesImg.drawRectangle(rect, cv.Vec(255, 0, 0), 2, cv.LINE_8);
                    //drawBlueRect(facesImg, rect, { thickness });
                });
                
                if(outputTarget==0){
                   cv.imshow('frame', facesImg);
                }
                else if(outputTarget==1){
                    // convert your image to rgba color space
                    const matRGBA = facesImg.channels === 1
                      ? facesImg.cvtColor(cv.COLOR_GRAY2RGBA)
                      : facesImg.cvtColor(cv.COLOR_BGR2RGBA);

                    var bufArray = matRGBA.getData();

                   // console.log(bufArray);

                    socket.emit('paintCanvas', {buf: bufArray, rows: facesImg.rows, cols: facesImg.cols, type: 'face'});   
                }
                else{
                    console.log('no specified output target for processing results');
                }
            });

            cv.waitKey(10);

        });
    }, delayInterval);
}