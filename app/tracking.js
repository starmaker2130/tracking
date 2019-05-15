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
var WhichBrowser = require('which-browser');
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
var SELECTION_MADE = false;
var PRESSING_ON_LEFT_SELECTION = 0;
var PRESSING_ON_RIGHT_SELECTION = 0;

var dir = config.DIRECTORY;

app.engine('html', require('ejs').renderFile);

/*

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

*/

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.static('/'));

var deviceType = 'unknown';

app.get('/', function(req, res){
    var result = new WhichBrowser(req.headers);
    console.log(result.toString());
    if(result.isType('desktop')){
        console.log('This is a desktop computer.');
        deviceType = 'desktop';
    }
    else{
        console.log('This is a mobile device.');
        deviceType = 'mobile';
    }
    
    res.render('tracking.html',{root: dir[0]});
});


app.get('/hand', function(req, res){
    res.render('handTracking.html',{root: dir[0]});
});

app.get('/face', function(req, res){
    res.render('faceTracking.html',{root: dir[0]});
});

app.get('/css/:style_id', function(req, res){
    var style_id = req.params.style_id;
    res.sendFile(style_id, {root: dir[1]});
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

app.get('/media/img/:img_id', function(req, res){
    var img_id = req.params.img_id;
    res.sendFile(img_id, {root: dir[6]});
});


var io = require('socket.io').listen(app.listen(config.PORT, function(){
    console.log(`[0] listening on port ${config.PORT}`);
}));

var scenes = [];
/*

orientation: 0 = landmark; 1 = face; 2 = hand



*/

var guests = [
    
];

io.sockets.on('connection', function(socket){
    console.log('client connected.');
    var conn = socket;
    
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
   
    socket.on('createScene', function(data){
        let ori = data.orientation;
        
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
    const skinColorLower = hue => new cv.Vec(hue, 0.3 * 255, 0.15 * 255);
    
    /*
    const skinColorUpper = hue => new cv.Vec(hue, 0.8 * 255, 0.6 * 255);
    const skinColorLower = hue => new cv.Vec(hue, 0.1 * 255, 0.05 * 255);
    */
    
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
            //const ballScene = resizedImg.copy();
              // draw bounding box and center line

            resizedImg.drawContours([handContour], pointColor, { thickness: 2 }); //previous version: blue
            
                        
          if(verticesWithValidAngle[0]!=undefined){
            try{
                const xValue = verticesWithValidAngle[0].d1.x;
                const vertext = verticesWithValidAngle[0].d1;
                if(xValue<200&&xValue>150){
                    console.log('selecting the left item: ', SELECTION_MADE);
                    if(!SELECTION_MADE){
                        PRESSING_ON_LEFT_SELECTION++;
                    }
                    if(PRESSING_ON_LEFT_SELECTION>5&&SELECTION_MADE==false){
                        SELECTION_MADE = true;
                        console.log('SELECTION MADE FOR DELIVERY!!!!!!!!!! LEFT');
                        socket.emit('selectionMadeForDeliveryItem', {selection: '#menu-option-0'});
                    }
                }
                else if(xValue<550&&xValue>520){
                    console.log('selecting the right item: ', SELECTION_MADE);
                    if(!SELECTION_MADE){
                        PRESSING_ON_RIGHT_SELECTION++;
                    }
                    if(PRESSING_ON_RIGHT_SELECTION>5&&SELECTION_MADE==false){
                        SELECTION_MADE = true;
                        console.log('SELECTION MADE FOR DELIVERY!!!!!!!!!! RIGHT');
                        socket.emit('selectionMadeForDeliveryItem', {selection: '#menu-option-1'});
                    }
                }
                else{
                    console.log(xValue);  
                }
                //ballScene.drawCircle(vertext, 20, pointColor, -5);       // previous version: 50, blueblue
                
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
                
           }
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
                //ballScene.drawCircle(objectsInSceneHandler.points[i], 25, red, -5);
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
                //ballScene.copyTo(sideBySide.getRegion(new cv.Rect(0, 0, cols, rows)));//result
                resizedImg.copyTo(sideBySide.getRegion(new cv.Rect(cols, 0, cols, rows)));


                //cv.imshow('handMask', handMask);
                cv.imshow('result', sideBySide); //sideBySide= a combination of result and resizedImg  result = circled finger tips only; resizedImg = vertex covered hand (green and blue lines, red circles)

                cv.waitKey(9); 
            }
            else if(objectTarget==1){
                /*if(objectsInSceneHandler.adding){
                    const matRGBA = ballScene.channels === 1
                      ? ballScene.cvtColor(cv.COLOR_GRAY2RGBA)
                      : ballScene.cvtColor(cv.COLOR_BGR2RGBA);

                    var bufArray = matRGBA.getData();

                    socket.emit('paintCanvas', {buf: bufArray, rows: ballScene.rows, cols: ballScene.cols, type: 'hand'});  
                }
                else{*/
                    /* Hand mesh*/
                const matRGBA = resizedImg.channels === 1
                      ? resizedImg.cvtColor(cv.COLOR_GRAY2RGBA)
                      : resizedImg.cvtColor(cv.COLOR_BGR2RGBA);
                var bufArray = matRGBA.getData();
                // console.log(bufArray);
                socket.emit('paintCanvas', {buf: bufArray, rows: resizedImg.rows, cols: resizedImg.cols, type: 'hand'});/**/    
                //}                
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
                
                let rectData = null;
                  // draw detection
                const facesImg = resizeFrame.copy();
                const numDetectionsTh = 10;
                objects.forEach(function(rect, i){
                    const thickness = numDetections[i] < numDetectionsTh ? 1 : 2;
                    const drawRect = facesImg.drawRectangle(rect, cv.Vec(255, 0, 0), 2, cv.LINE_8);
                    rectData = rect;
                    //console.log(rect);
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

                    socket.emit('paintCanvas', {buf: bufArray, rows: facesImg.rows, cols: facesImg.cols, type: 'face', rectangle: rectData});   
                }
                else{
                    console.log('no specified output target for processing results');
                }
            });

            cv.waitKey(10);

        });
    }, delayInterval);
}