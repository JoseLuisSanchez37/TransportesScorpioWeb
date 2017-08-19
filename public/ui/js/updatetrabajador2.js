"use strict";
$(document).ready(function(){
    var BuscarNombre = document.getElementById("buscarNom");
    var BuscarID = document.getElementById("buscarID");
    
    
    
    var btnBuscar = document.getElementById("btn_buscar");
    btnBuscar.addEventListener("click",busqueda,false);
    var Empleados;
    var resultado;
    var ShowEmpleado;
    var rad ;
    function busqueda() {
        
         
        if(BuscarNombre.value.length < 3 && BuscarID.value.length <= 0){
            alert("Nombre o ID Obligatorio");
            return;
        }
        var i=0;
        var n=0;
        resultado = firebase.database().ref('empleados');//.push().key;
        
        $("#empleadoupdate div.row").remove();
        $("#camposupdate div.row").remove();
           

        resultado.on("child_added",function(data){
           
            if(BuscarNombre.value==data.val().Nombre || BuscarID.value==data.val().ID){
                 n++;
                //console.log(n);
                Empleados='<div name="sel" class="row"><div class="col-md-3 ">';
                Empleados+=' <input type="radio"  id="check'+i+'"  name="myRadios" value="'+data.key+'"/>';
                Empleados+=' <label for="check'+i+'">'+data.val().Nombre+" "+data.val().Apellido_Paterno+" "+data.val().Apellido_Materno+'</label></div>';
                                
                i++;
                $(Empleados).appendTo('#empleadoupdate');
            }
            $("input[name=myRadios]").change(function () {
                var valor= $(this).val();
                $("#camposupdate div.row").remove();
                resultado.on("child_added",function(data){    
                    if(valor==data.key){
                        ShowEmpleado='<div class="row"><label>Actividad</label>';
                        ShowEmpleado+= '<input id="actividad" type="text" value="'+data.val().Actividad+'"  required="required" onkeypress="return sololetras(event);">';
                        ShowEmpleado+= '<label>Nombre</label>';
                        ShowEmpleado+= '<input id="nombre" type="text" value="'+data.val().Nombre+'" required="required" onkeypress="return sololetras(event);" maxlength="25">';
                        ShowEmpleado+= '<label>Apellido Paterno</label>';
                        ShowEmpleado+= '<input id="app" type="text" value="'+data.val().Apellido_Paterno+'" required="required" onkeypress="return sololetras(event);" maxlength="25">';
                        ShowEmpleado+= '<label>Apellido Materno</label>';
                        ShowEmpleado+= '<input id="apm" type="text" value="'+data.val().Apellido_Materno+'" required="required" onkeypress="return sololetras(event);" maxlength="25">';
                        ShowEmpleado+= '<label>Fecha de Nacimiento</label>';
                        ShowEmpleado+= '<input id="fechaN" type="date" value="'+data.val().Fecha_Nacimiento+'" required="required">';
                        ShowEmpleado+= '<label>Lugar de Nacimiento</label>';
                        ShowEmpleado+= '<input id="lugarN" type="text" value="'+data.val().Lugar_Nacimiento+'" required="required">';
                        ShowEmpleado+= '<label>CURP</label>';
                        ShowEmpleado+= '<input id="CURP" type="text" value="'+data.val().CURP+'" required="required" maxlength="30">';
                        ShowEmpleado+= '<label>Dias de Contrato</label>';
                        ShowEmpleado+= '<input id="dias" type="text" value="'+data.val().Contrato+'" required="required" maxlength="3" onkeypress="return SoloNumeros(event);">';
                        ShowEmpleado+= '<label>Tomar Foto</label>';

                        ShowEmpleado+= '<div id="miCameraOnline">';
                        ShowEmpleado+= '<label>Abrir Camara</label>';
                        ShowEmpleado+= '<button  type="button" id="t" class="btn btn-floating btn-large cyan pulse"><i class="small material-icons">videocam</i></button>';
                        ShowEmpleado+= '<label>Tomas Foto</label>';
                        ShowEmpleado+= '<video id="v"></video>';
                        ShowEmpleado+= '<button id="tomar" type="button" class="btn btn-floating btn-large cyan pulse"><i class=" small material-icons">aspect_ratio</i></button>';
                        ShowEmpleado+= '<div><canvas id="c" ></canvas>';
                        ShowEmpleado+= '<img src="" id="img"></div>';
                        ShowEmpleado+= '</div>';
                        ShowEmpleado+= '<div class="row">';
                        ShowEmpleado+= '<div class="center input-field col s12">';
                        ShowEmpleado+= '<button type="button" id="btn_actualizar"   class="waves-effect waves-light btn light-blue darken-2 ">Actualizar</button>';
                        ShowEmpleado+= '</div>';
                        ShowEmpleado+= '</div>';
                        $(ShowEmpleado).appendTo('#camposupdate');
                        
                        var btnCamara = document.getElementById("t");
                        btnCamara.onclick = function(){
                            camara();
                
                            function camara(){
                                var video = document.querySelector('#v'), canvas = document.querySelector('#c'), btn = document.querySelector('#tomar'), img = document.querySelector('#img');     navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUSerMedia || navigator.msGetUserMedia);
                                if(navigator.getUserMedia){
                                    navigator.getUserMedia({video: true},function(stream ){
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
                        }
                        var btnActualizar = document.getElementById("btn_actualizar");
                        btnActualizar.onclick = function() {     

                            var actividad = document.getElementById('actividad'); 
                            var nombre = document.getElementById('nombre');
                            var apellido_paterno = document.getElementById('app');
                            var apellido_materno = document.getElementById('apm');
                            var fecha_nacimiento = document.getElementById('fechaN');
                            var lugar_nacimiento = document.getElementById('lugarN');
                            var curp = document.getElementById("CURP");
                            var contrato = document.getElementById("dias");
                            var url_foto = document.getElementById("img");
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

                        var resultado = firebase.database().ref('empleados').child(data.key);//.push().key;
                        console.log(resultado);
                        //resultado.update(post);    
                        //var resultado2 = firebase.database().ref('empleadoscopia').child(data.key);;//.push().key;
                        resultado.update(post,alfinalizar());
                        function alfinalizar(error){
                            if (error){
                                alert('Ha habido problemas al realizar la operación: '+error.code);
                            }
                            else{
                                var RefStorage = firebase.storage().ref("imagenes/"+data.key);   
                                RefStorage.put(imagensave);
    
                                alert('Operacion con éxito !');
                                $("#empleadoupdate div.row").remove();
                                $("#camposupdate div.row").remove();
                                BuscarID.value="";
                                BuscarNombre.value="";
                            }       

                            }

                            }
        
    
                    }
                
			     });
                 
            });
        });    
       
    }
    
    
});