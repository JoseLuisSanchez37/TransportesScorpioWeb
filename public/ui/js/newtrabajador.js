"use strict";
$(document).ready(function(){
 


var actividad = document.getElementById('actividad'); 
var nombre = document.getElementById('nombre');
var apellido_paterno = document.getElementById('app');
var apellido_materno = document.getElementById('apm');
var fecha_nacimiento = document.getElementById('fechaN');
var lugar_nacimiento = document.getElementById('lugarN');
var curp = document.getElementById("CURP");
var contrato = document.getElementById("dias");
var url_foto = document.getElementById("img");
function nuevoTrabajador() {
    
    
    if (actividad.value.length < 3)
    {
        alert('Actividad obligatorio');
        return;
    }
   if (nombre.value.length < 3)
    {
        alert('Nombre obligatorio');
        return;
    }
    if (apellido_paterno.value.length < 3 || apellido_materno.value.length < 3)
    {
        alert('Apellido obligatorio');
        return;
    }
    if (fecha_nacimiento.value.length <=0 )
    {
        alert('Fecha de Nacimiento obligatorio');
        return;
    }
    if (lugar_nacimiento.value.length < 5 )
    {
        alert('Lugar de Nacimiento obligatorio');
        return;
    }
    if (curp.value.length < 10 )
    {
        alert('Curp obligatorio');
        return;
    }
    if (contrato.value.length ==0)
    {
        alert('Dias obligatorio');
        return;
    }
    var foto = url_foto.src
        var ImagenPequenia= RedimencionarImagen(foto,200,200); 
        function RedimencionarImagen (srcData, width, height) {
      var imageObj = new Image(),
          canvas   = document.createElement("canvas"),
          ctx      = canvas.getContext('2d'),
          xStart   = 0,
          yStart   = 0,
          aspectRadio,
          newWidth,
          newHeight;
      imageObj.src  = srcData;
      canvas.width  = width;
      canvas.height = height;
      aspectRadio = imageObj.height / imageObj.width;
      if(imageObj.height < imageObj.width) {
         //horizontal
         aspectRadio = imageObj.width / imageObj.height;
         newHeight   = height,
         newWidth    = aspectRadio * height;
         xStart      = -(newWidth - width) / 2;
      } else {
         //vertical
         newWidth  = width,
         newHeight = aspectRadio * width;
         yStart    = -(newHeight - height) / 2;
      }
      ctx.drawImage(imageObj, xStart, yStart, newWidth, newHeight);
      return canvas.toDataURL("image/jpeg", 0.75);
    }
   
    var imagensave = dataURLtoBlob(ImagenPequenia);
    
    
    function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}
    
    
    
    
    
    
    
    
    var post = {
        Actividad: actividad.value,
        Nombre: nombre.value,
        Apellido_Paterno: apellido_paterno.value,
        Apellido_Materno: apellido_materno.value,
        Fecha_Nacimiento: fecha_nacimiento.value,
        Lugar_Nacimiento: lugar_nacimiento.value,
        CURP: curp.value,
        Contrato: contrato.value,
        
    };
    
       
    
    //console.log(ImagenPequenia);
    var resultado = firebase.database().ref('empleados').push(post,alfinalizar());
    console.log(resultado.key);
    function alfinalizar(error){
        if (error){
            alert('Ha habido problemas al realizar la operación: '+error.code);
        }
        else{
            alert('El alta se ha realizado con éxito !');
            //parent.document.getElementById("frame_asig_camion").contentWindow.location.reload();
            
            nombre.value="";
            apellido_paterno.value="";
            apellido_materno.value="";
            fecha_nacimiento.value="";
            lugar_nacimiento.value="";
            curp.value="";
            url_foto.src="";
            
        }       
        }
    
    var RefStorage = firebase.storage().ref("imagenes/"+resultado.key);
    //var FotoEmp ={};
    //FotoEmp[resultado.key]={Foto:url_foto};
    RefStorage.put(imagensave);
    
    
    
    
    
    
    
    //var updates = {};
    //updates['/empleados/' + resultado] = post;
    
    //return firebase.database().ref().update(updates);
  
    
    
   
    /*resultado.push(post,alfinalizar());
     
    
    function alfinalizar(error){
        if (error){
            alert('Ha habido problemas al realizar la operación: '+error.code);
        }
        else{
            alert('El alta se ha realizado con éxito !');
            //parent.document.getElementById("frame_asig_camion").contentWindow.location.reload();
            
            nombre.value="";
            apellido_paterno.value="";
            apellido_materno.value="";
            fecha_nacimiento.value="";
            lugar_nacimiento.value="";
            curp.value="";
            url_foto.src="";
            
        }       
        
        }*/
    
    
}

document.getElementById('btn_nuevotrabajador').addEventListener('click', nuevoTrabajador);

window.onload = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var database = firebase.database();
            console.log(database);
        }
    });
};
});