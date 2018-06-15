
var bodyParser = require('body-parser');
var express = require('express');
var formidable = require('formidable');
var util = require('util');
var fs = require('fs');

var app = express();

var config = {
    PORT: process.env.PORT || 8008,
    DIRECTORY: [
        './',
        './css',
        './js',
        './media/img',
        './media/model',
        './media/pattern',
        './media/texture',
        './media/upload',
        './media/room'
    ]
};

var dir = config.DIRECTORY;

app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.static('/'));

app.get('/', function(req, res){
    res.render('index.html', {root: dir[0]});
});

app.get('/ar', function(req, res){
    res.render('ar-template.html', {root: dir[0]});
});

app.get('/js/jquery-3.2.1.min.js', function(req, res){
    res.sendFile('jquery-3.2.1.min.js', {root: dir[2]});
});

app.get('/js/aframe.min.js', function(req, res){
    res.sendFile('aframe.min.js', {root: dir[2]});
});

app.get('/js/ar.min.js', function(req, res){
    res.sendFile('ar.min.js', {root: dir[2]});
});

app.get('/js/Eye.js', function(req, res){
    res.sendFile('Eye.js', {root: dir[2]});
});

app.get('/js/main.js', function(req, res){
    res.sendFile('main.js', {root: dir[2]});
});

app.get('/js/threex-arpatternfile.js', function(req, res){
    res.sendFile('threex-arpatternfile.js', {root: dir[2]});
});

app.get('/css/profile.css', function(req, res){
    res.sendFile('profile.css', {root: dir[1]});
});

app.get('/css/main.css', function(req, res){
    res.sendFile('main.css', {root: dir[1]});
});

app.get('/css/form.css', function(req, res){
    res.sendFile('form.css', {root: dir[1]});
});

app.get('/css/generator.css', function(req, res){
    res.sendFile('generator.css', {root: dir[1]});
});

app.get('/media/img/hov.png', function(req, res){
    res.sendFile('hov.png', {root: dir[3]});
});

app.get('/media/img/inner-arjs.png', function(req, res){
    res.sendFile('inner-arjs.png', {root: dir[3]});
});

app.get('/media/img/white-eye-icon.png', function(req, res){
    res.sendFile('white-eye-icon.png', {root: dir[3]});
});

app.get('/media/pattern/:pattern_id', function(req, res){
    var pattern_id = req.params.pattern_id;
    res.sendFile(pattern_id+'.patt', {root: dir[5]});
});

app.get('/media/room/:room_id', function(req, res){
    var room_id = req.params.room_id;
    res.sendFile(room_id+'.html', {root: dir[8]});
});

app.get('/media/texture/grid_pattern.png', function(req, res){
    res.sendFile('grid_pattern.png', {root: dir[6]});
});

app.post('/media/upload', function(req, res){
    
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
        <title>AR Template | v 0.5.0</title>
        <link rel='stylesheet' type='text/css' href='../../css/profile.css' />
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
    fs.writeFile(dir[8]+'/auto.html', markup, function (err) {
        if (err) {
            return console.log('there is an error building the markup');
        }
 
        console.log('the markup file was saved');
    });
    res.end('success');
});

var io = require('socket.io').listen(app.listen(config.PORT, function(){
    console.log(`[0] listening on port ${config.PORT}`);
}));

io.sockets.on('connection', function(socket){
    console.log('client connected...');
    
    socket.on('disconnect', function(){
        console.log(`socket ${socket.id} disconnected.`);
    });

});