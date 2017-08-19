"use strict";
 
$(document).ready(function(){

    var database = firebase.database();
    var referencia=database.ref("salidasCopia");
    var i=0;      
    referencia.on("child_added", function(data) {
        
        var Camiones;
        var ref=firebase.database().ref("salidasCopia").child(data.key);
        
        ref.on("child_added",function(datos){                   
            
        Camiones='<div name="sel" class="row"><div class="col-md-3 ">';
        Camiones+=' <input type="checkbox"  id="check'+i+'"  name="cami[]" value="'+datos.key+'" />';
        Camiones+=' <label for="check'+i+'">'+datos.key+'</label></div>';
         
        i++;
         $(Camiones).appendTo('#listado');
            
        });
    });
    var campo=[];
    var IDs=[];
    var v=0;
    var Referencia = firebase.database().ref("asignacion_empleados_campo");
                                Referencia.on("child_added",function(dato){
                                    var Referencia2 = firebase.database().ref("asignacion_empleados_campo").child(dato.key);
                                    Referencia2.on("child_added",function(dato2){
                                        var Referencia3 = firebase.database().ref("asignacion_empleados_campo").child(dato.key).child(dato2.key);
                                        
                                        Referencia3.on("child_added",function(dato3){
                                                                                    
                                                
                                                campo[v]=dato2.key;
                                                IDs[v]=dato3.key;
                                                 v++;
                                
                                
                                        });
                                    });
                                });
    
    
   
    var checkboxes = document.getElementById("credencial");
    var empleado=[];  
    
    
    var btnGenCre = document.getElementById("btn_creden");
    btnGenCre.addEventListener("click",credencial,false);
    function credencial(){
        var a=0;
        
        //console.log(checkboxes.length);
        //var doc = new jsPDF();
        
        //var IDs=[];
        var nombres=[];
        
                                
                        
        
        
        for(var e=0; e<checkboxes.length;e++){
            if(checkboxes[e].checked){
                var Referencia = firebase.database().ref("salidasCopia");
                Referencia.on("child_added",function(data2){
                    var Referen = firebase.database().ref("salidasCopia").child(data2.key);
                    Referen.on("child_added",function(dta){
                        if(checkboxes[e].value==dta.key){
                            var Ref = firebase.database().ref("salidasCopia").child(data2.key).child(dta.key);
                            Ref.on("child_added",function(datos){
                                empleado[a]=datos.key;
                                nombres[a]= datos.val().Nombre;
                                a++;
                                
                            });
                        } 
                    });
                });
             
            }else{

            }
        }
        
        var test;
        var UrlImagen=[];
        var CampoEmpl=[];
        var z=0;
      for(var x=0;x<empleado.length;x++){
          for(var j=0;j<IDs.length;j++){
              if(empleado[x]==IDs[j]){
                  var StorageRef = firebase.storage().ref("imagenes/").child(IDs[j]).getDownloadURL().then(function(url) {
                      test = url;
                      UrlImagen[z]=url;
                    
                      //alert(url);
                      document.querySelector('img').src = test;

                      }).catch(function(error) {

                      });  
                  //alert(campo[j]);
                  //console.log(campo);
                  CampoEmpl[z]=campo[j];
                  //console.log(CampoEmpl);                
                  
                z++;
              }
          }
          
      }
        /*<div id="can">
                <canvas id="barcode">
                </canvas>
        </div>*/
        
         var left = 15;
    var top = 8;
    var imgWidth = 100;
    var imgHeight = 100;
        
        var rectangle = [11,111,11,111,11,111,11,111];
       var r=0,r2=0;
        var rectangle2 =[21,21,89,89,157,157,225,225];
        var titulos = [45,145,45,145,45,145,45,145];
        var titulos2 = [26,26,94,94,162,162,230,230];
        var foto = [72,172,72,172,72,172,72,172];
        var foto2 = [40,40,108,108,176,176,244,244];
        var nomempleado = [12,112,12,112,12,112,12,112];
        var nomempleado2 = [42,42,112,112,182,182,252,252];
         
         var doc = new jsPDF();  
       
        for(var u=0;u<empleado.length;u++){
            
            if(r==7){
                
                //doc.addImage(UrlImagen[r], 'JPG',imgWidth, imgHeight);
                
                doc.rect(rectangle[r], rectangle2[r], 90, 58);

                //titulos de las credenciales
                doc.setFontSize(10);
                doc.text(titulos[r],titulos2[r],CampoEmpl[u]);//primera credencial titulo

                //Foto
                doc.rect(foto[r],foto2[r], 25, 35);//1 

                //nombres
                doc.setFontSize(9);
                doc.text(nomempleado[r],nomempleado2[r],'Nombre: '+nombres[u]);//nombre del empleado 1 
                 r=0;
                doc.addPage();
            }
            else{
                
                    
                     doc.rect(rectangle[r], rectangle2[r], 90, 58);

                //titulos de las credenciales
                doc.setFontSize(10);
                doc.text(titulos[r],titulos2[r],CampoEmpl[u]);//primera credencial titulo

                //Foto
                doc.rect(foto[r],foto2[r], 25, 35);//1 

                //nombres
                doc.setFontSize(9);
                doc.text(nomempleado[r],nomempleado2[r],'Nombre: '+nombres[u]);//nombre del empleado 1 
                   
                        r++;

            }
            
               
                
        }
       
         doc.save('Credenciales.pdf');  
        
    }
    
    
    
    
});

