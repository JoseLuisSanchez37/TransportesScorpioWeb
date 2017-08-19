"use strict";

var btnc= document.getElementById('t');
btnc.addEventListener("click",camara);

function camara(){
    var video = document.querySelector('#v'), canvas = document.querySelector('#c'), btn = document.querySelector('#tomar'), img = document.querySelector('#img');     navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUSerMedia || navigator.msGetUserMedia);     if(navigator.getUserMedia){
                navigator.getUserMedia({video:true},function(stream){
                    video.src = window.URL.createObjectURL(stream);
                    video.play();},function(e){
                    console.log(e)});
                video.addEventListener('loadedmetadata',function(){canvas.width = video.videoWidth, canvas.height = video.videoHeight;},false);       btn.addEventListener('click',
                function(){
                    canvas.getContext('2d').drawImage(video,0,0);
                    var imgData = canvas.toDataURL('image/png');
                    img.setAttribute('src',imgData);
                   
                });
            }
            else{
                alert("Actualiza tu navegador");
            }   
}
        