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

document.addEventListener('DOMContentLoaded', function(){
    
    innerImageURL = '../media/img/inner-arjs.png';
    updateFullMarkerImage();

    document.querySelector('#buttonDownloadEncoded').addEventListener('click', function(){
        if( innerImageURL === null ){
            alert('upload a file first')
            return
        }
        console.assert(innerImageURL)
        THREEx.ArPatternFile.encodeImageURL(innerImageURL, function onComplete(patternFileString){
            THREEx.ArPatternFile.triggerDownload(patternFileString)
        })
    });

    document.querySelector('#buttonDownloadFullImage').addEventListener('click', function(){
        // debugger
        if( innerImageURL === null ){
            alert('upload a file first')
            return
        }
        // tech from https://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
        var domElement = window.document.createElement('a');
        domElement.href = fullMarkerURL;
        domElement.download = 'marker.png';
        document.body.appendChild(domElement)
        domElement.click();
        document.body.removeChild(domElement)
    });

    document.querySelector('#fileinput').addEventListener('change', function(){
        var file = this.files[0];
        // debugger
        var reader = new FileReader();
        reader.onload = function(event){
            innerImageURL = event.target.result
            updateFullMarkerImage()
        };
        reader.readAsDataURL(file);
    });
});

function convertCanvasToImage(canvas) {// store the result of this function in a variable that will represent the file entered in line 57 above
	var image = new Image();
	image.src = canvas.toDataURL("image/png");
	return image;
}