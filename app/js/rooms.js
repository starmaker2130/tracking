// author(s): Patrice-Morgan Ongoly
// version: 0.2.4 (0.2.9)
// last modified: Sunday, May 13, 2018 14:36 CPT
// description: 

var sessionManager = {
    templateType: -1, // 0 = empty, 1 = image gallery, 2 = menu, 3 = interior design
    step: 0,
    roomOrientation: null,
    roomSize: null,
    settingsSwitches: [],
    objectCount: 0,
    objectMetaData: [],
    requestingToUpload: null,
    socket: null,
    markerData: null
};

var $z = 1, $moving = false, $width = 0, $height = 0, $this = null;

$(document).ready(function(){
    sessionManager.socket = io.connect(location.host);
    
    init();
    
    document.addEventListener('mousemove',function(e) {
        if($moving === true){
            var x = e.clientX - $width;
            var y = e.clientY - $height;

            var position = 'left:' + x + 'px;top:' + y + 'px;'+';cursor:move;';
            $this.setAttribute('style', position);
            //console.log($this.getAttribute('id'));
        };
    });
});

function init(){
    sessionManager.socket.emit('identify', {
        page: 1
    });
    
    $('.template-option').click(function(){
        var id = $(this).attr('id');
        var templateSel = id.charAt(0);
        
        $('.template-option').css({
            boxShadow: 'none'
        });
        
        if(templateSel=='e'){
            sessionManager.templateType = 0;
            $('#empty-room-option').css({
                boxShadow: '3px 3px 3px white'
            });
            console.log('selected empty room template type');
        }
        else if(templateSel=='i'){
            sessionManager.templateType = 1;
            $('#image-gallery-option').css({
                boxShadow: '3px 3px 3px white'
            });
            console.log('selected image gallery template type');
        }
        else if(templateSel=='f'){
            sessionManager.templateType = 2;
            $('#food-menu-option').css({
                boxShadow: '3px 3px 3px white'
            });
            console.log('selected food menu template type');
        }
        else if(templateSel=='a'){
            /*sessionManager.templateType = 3;
            $('#architecture-option').css({
                boxShadow: '3px 3px 3px white'
            });*/
            console.log('this option is not yet available');
        }
    });
    
    $('#template-start-page').show().animate({
        opacity: 1.0
    }, 1500);
    
    $('#preset-template-button').click(function(){
        if(sessionManager.templateType>-1){
            $('#template-start-page').animate({
                opacity: 0
            }, 1500, function(){
                $(this).hide();
            });

            setTimeout(function(){
                $('#step-counter').text('step 1');
                $('#page-0').show().animate({
                    opacity: 1.0
                }, 1500);
            }, 750);
        }
        else{
            console.log('pick a template setting');
        }
    });

    $('#upload-marker-container').click(function(){
        $('#marker-files').click();
    });

    $('#upload-marker-button').click(function(){
        uploadContent();
    });

    $('#choose-new-marker-button').click(function(){
        hideUploadButtons();
    });

    $('#continue-arrow').click(function(){
        sessionManager.step++;
        $('#page-1').animate({
            opacity: 0
        }, 2000, function(){
            $(this).hide();

            $('#page-2').show().animate({
                opacity: 1.0
            }, 2000);

            setTimeout(function(){
                
                if(sessionManager.templateType==0){
                    $('#empty-room-option-basin').show();
                }
                else if(sessionManager.templateType==1){
                    $('#image-gallery-option-basin').show();
                }
                else if(sessionManager.templateType==2){
                    $('#food-menu-option-basin').show();
                }
                else if(sessionManager.templateType==3){
                    $('#architecture-option-basin').show();
                }
                
                $('#step-counter').text('step 3');

                $('#continue-arrow').animate({
                    opacity: 0
                }, 1500, function(){
                    $(this).hide();
                });
            }, 500);
        });
    });

    $('#upload-content-logo').click(function(){ //#added-content-container
        $('#content-type-dashboard').show().animate({
            opacity: 1.0
        }, 2000);
    });
    
    $('#upload-image-logo').click(function(){ //#added-content-container
        $('#content-files').attr('accept', 'video/*, image/*');
        $('#content-files').click();
    });
    
    $('#upload-menu-logo').click(function(){
        
    });

    $('#audio-content, #video-content, #model-content').click(function(event){
        var target = event.target.getAttribute('id');
        target = target.substring(0, target.indexOf('-'));
        console.log(target);

        sessionManager.requestingToUpload = target;

        if(target=='audio'){
            $('#content-files').attr('accept', 'audio/*');
        }
        else if(target=='video'){
            $('#content-files').attr('accept', 'video/*');
        }
        else if(target=='model'){
            $('#content-files').attr('accept', '.dae, .mtl, .obj, .stl, .png, .gif, .jpeg');
        }
        else{
            $('#content-files').attr('accept', 'audio/*, video/*, image/*');
        }

        $('#content-files').click();
    });

    $('#close-dashboard').click(function(){
        closeDashboard();
    });
    
    $('#add-content-title').click(function(){
        addContentToRoom(0);
    });
    
    $('#add-image-title').click(function(){
        addContentToRoom(1);
    });

    $('#submit-custom-url-form').click(function(){
        var val = $('#custom-url-input').val();
        var pH = $('#custom-url-input').attr('placeholder');

        if(val==pH){
            console.log('enter some shit');
        }
        else if(val==''){
            console.log('enter some shit');
        }else{
            console.log(`experience located at hov.fun/ ${val}`);   //TODO: there is a parsing error at this line but it doesn't affect the runtime operation of the code...see if this is a real issue or just Brackets acting up
            
            $('#page-3').animate({
                opacity: 0
            }, 1500, function(){
                $(this).hide();

                setTimeout(function(){
                    window.location.href = './';
                }, 1000);
            })
        }
    });
}

function drag(event) {
    console.log('moving');
    $moving = true;
    //$z = $z+1;

    $this = event.target;

    $width = $this.offsetWidth / 2;
    $height = $this.offsetHeight / 2;
};

function end() {
    console.log('mouse up');
    $moving = false;
};

function uploadContent(){
    //console.log('TODO: add upload functionality');
    
    var rawData = sessionManager.markerData;
    
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    
    for (var i = 0; i < rawData.length; i++) {
        var file = rawData[i];
      
        // add the files to formData object for the data payload
        formData.append('uploads[]', file, file.name);
        //contentCount++;
    }
    
    if(rawData.length>0){
        console.log('commencing file upload...'); // *at least one
        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data){
                console.log('content successfully uploaded!');
                    hideUploadButtons();

                    $('#page-0').animate({
                        opacity: 0
                    }, 2000, function(){
                        $('#step-counter').text('step 2');
                        $(this).hide();

                        sessionManager.step++;

                        $('#page-1').show().animate({
                            opacity: 1.0
                        }, 2000, function(){
                            console.log(`on step ${sessionManager.step}`);
                        });
                    });

                    $('.orientation-option').click(function(){
                        var id = $(this).attr('id');
                        id = id.substring(id.indexOf('-')+1, id.lastIndexOf('-'));
                        console.log(id);

                        if(id.charAt(0)=='s'){
                            $('#project-sideways-option').css({
                                backgroundColor: 'white',
                                color: 'black'
                            });

                            $('#project-upward-option').css({
                                backgroundColor: 'black',
                                color: 'white'
                            });
                        }
                        else if(id.charAt(0)=='u'){
                            $('#project-upward-option').css({
                                backgroundColor: 'white',
                                color: 'black'
                            });

                            $('#project-sideways-option').css({
                                backgroundColor: 'black',
                                color: 'white'
                            });
                        }
                        sessionManager.roomOrientation = id;
                        //sessionManager.settingsSwitches++;
                        if(sessionManager.settingsSwitches.indexOf('ori')<0){
                            sessionManager.settingsSwitches.push('ori');
                        }

                        continueToFinalStep();
                    });

                    $('.size-option').click(function(){
                        var id = $(this).attr('id');
                        id = id.substring(0, id.indexOf('-'));
                        console.log(id);

                        $('.size-option').css({
                            backgroundColor: 'black',
                            color: 'white'
                        });

                        if(id.charAt(0)=='s'){
                            $('#small-option').css({
                                backgroundColor: 'white',
                                color: 'black'
                            });
                        }
                        else if(id.charAt(0)=='m'){
                            $('#medium-option').css({
                                backgroundColor: 'white',
                                color: 'black'
                            });
                        }
                        else if(id.charAt(0)=='l'){
                            $('#large-option').css({
                                backgroundColor: 'white',
                                color: 'black'
                            });
                        }
                        sessionManager.roomSize = id;
                        //sessionManager.settingsSwitches++;
                        if(sessionManager.settingsSwitches.indexOf('size')<0){
                            sessionManager.settingsSwitches.push('size');
                        }
                        
                        continueToFinalStep();
                    });
            },
            xhr: function() {
                var xhr = new XMLHttpRequest();

                xhr.upload.addEventListener('progress', function(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        if (percentComplete === 100) {
                            console.log('file upload complete (100%).');
                        }
                    }
                }, false);

                return xhr;
            }
        });
    }
}

function continueToFinalStep(){
    if(checkSettingsCompletion()){
        $('#continue-arrow').show().animate({
            opacity: 1.0
        }, 750);
    }
    else{
        console.log('more info to complete');
    }
}

function checkSettingsCompletion(){
    if(sessionManager.settingsSwitches.length>1){
        return true;
    }
    return false;
}

function hideUploadButtons(){
    setTimeout(function(){
        $('.marker-button').css({
            zIndex: -50
        });
    }, 1500);

    $('#preview').animate({
        opacity: 0
    }, 2000, function(){
        $(this).empty();
    });    
}

function handleFiles(files) {
    var fileList = files;
    
    sessionManager.markerData = fileList;
    
    for (var i = 0, numFiles = fileList.length; i < numFiles; i++) {
        var file = files[i];
        // console.log(`${file.name} has been uploaded \n\n type: ${file.type} \n size: ${file.size}`);

        if (!file.type.startsWith('image/')){ continue }

        var img = document.createElement("img");
        img.classList.add("obj");
        img.file = file;

        $('#preview').append(img).css({
            zIndex: 50
        }).animate({
            opacity: 1.0
        }, 2000);

        $('.marker-button').css({
            zIndex: 100
        });

        var reader = new FileReader();
        reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
        reader.readAsDataURL(file);
    }
}

function handleContentFiles(files) {
    var contentList = files;
    
    if(sessionManager.templateType==0){
        for (var i = 0, numContent = contentList.length; i < numContent; i++) {
            var content = files[i];
            console.log(`${content.name} has been uploaded \n\n type: ${content.type} \n size: ${content.size}`);

            if (content.type.startsWith('image/')){
                var img = document.createElement("img");

                img.classList.add("content-object");

                img.file = content;

                img.setAttribute('id', `object-${sessionManager.objectCount}`);

                img.addEventListener('mousedown', drag);
                img.addEventListener('mouseup', end);

                $('#added-content-container').append(img).css({
                    zIndex: 50
                }).animate({
                    opacity: 1.0
                }, 2000);

                var reader = new FileReader();
                reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
                reader.readAsDataURL(content);
            }
            else{
                var item = document.createElement("div");
                item.classList.add("content-object");
                item.file = content;

                item.setAttribute('id', `object-${sessionManager.objectCount}`);
                item.addEventListener('mousedown', drag);
                item.addEventListener('mouseup', end);

                $('#added-content-container').append(item).css({
                    zIndex: 50
                }).animate({
                    opacity: 1.0
                }, 2000);
            }

            sessionManager.objectCount++;

            sessionManager.objectMetaData.push({
                fileName: content.name,
                type: content.type,
                fileSize: content.size,
                divName: `object-${sessionManager.objectCount}`
            });
        }
    }
    else if(sessionManager.templateType==1){
        for (var i = 0, numContent = contentList.length; i < numContent; i++) {
            var content = files[i];
            console.log(`${content.name} has been uploaded \n\n type: ${content.type} \n size: ${content.size}`);

            if (content.type.startsWith('image/')){
                var img = document.createElement("img");

                img.classList.add("image-object");

                img.file = content;

                img.setAttribute('id', `object-${sessionManager.objectCount}`);

                img.addEventListener('mousedown', drag);
                img.addEventListener('mouseup', end);

                $('#added-image-container').append(img).css({
                    zIndex: 50
                }).animate({
                    opacity: 1.0
                }, 2000);

                var reader = new FileReader();
                reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
                reader.readAsDataURL(content);
            }
            else{
                var item = document.createElement("div");
                item.classList.add("image-object");
                item.file = content;

                item.setAttribute('id', `object-${sessionManager.objectCount}`);
                item.addEventListener('mousedown', drag);
                item.addEventListener('mouseup', end);

                $('#added-image-container').append(item).css({
                    zIndex: 50
                }).animate({
                    opacity: 1.0
                }, 2000);
            }

            sessionManager.objectCount++;

            sessionManager.objectMetaData.push({
                fileName: content.name,
                type: content.type,
                fileSize: content.size,
                divName: `object-${sessionManager.objectCount}`
            });
        }
        
    }
    else if(sessionManager.templateType==2){
        console.log('TODO: add food object handler');
        sessionManager.objectCount++;
        sessionManager.objectMetaData.push({
            fileName: 'type2-placeholder',
            type: 'type2-placeholder',
            fileSize: 0,
            divName: `object-${sessionManager.objectCount}`
        });
    }
    else if(sessionManager.templateType==3){
        console.log('TODO: add design object handler');
        sessionManager.objectCount++;
        sessionManager.objectMetaData.push({
            fileName: 'type3-placeholder',
            type: 'type3-placeholder',
            fileSize: 0,
            divName: `object-${sessionManager.objectCount}`
        });
    }
    
    closeDashboard();
}

function closeDashboard(){
    $('#content-type-dashboard').animate({
        opacity: 0
    }, 1500, function(){
        $(this).hide();
    });
}

function operateMedium(){
    console.log('upload');   
}

function addContentToRoom(type){
    if(type==0){
        console.log('TODO: add empty room backend builder');
    }
    else if(type==1){
        console.log('TODO: add image gallery backend builder');
    }
    
    if(sessionManager.objectCount>0){
        sessionManager.step++;
        $('#page-2').animate({
            opacity: 0
        }, 2000, function(){
            $(this).hide();

            $('#page-3').show().animate({
                opacity: 1.0
            }, 2000);

            setTimeout(function(){
                $('#step-counter').text('finish');
            }, 500);
        });
    }
}