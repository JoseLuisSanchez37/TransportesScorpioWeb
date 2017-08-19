"use strict";
$(document).ready(function(){
   
    var database = firebase.database();
    var referencia=database.ref("salidas");
    var i=0;
    
    
    var ID_Empleado=1;
        var RefAsigEmpCampo = firebase.database().ref("asignacion_empleados_campo");
        RefAsigEmpCampo.on("child_added",function(dato){
            var RefAsigEmpCampo2= firebase.database().ref("asignacion_empleados_campo").child(dato.key);
            RefAsigEmpCampo2.on("child_added",function(dato2){
                var RefAsigEmpCampo3= firebase.database().ref("asignacion_empleados_campo").child(dato.key).child(dato2.key);
                RefAsigEmpCampo3.on("child_added",function(dato3){
                    ID_Empleado++;
                });
            });
        });
        
   
    
      
    referencia.on("child_added", function(data) {
        
        var Camiones;
        var ref=firebase.database().ref("salidas").child(data.key);
       
        ref.on("child_added",function(datos){                   
            
        Camiones='<div name="sel" class="row"><div class="col-md-3 ">';
        Camiones+=' <input type="checkbox"  id="check'+i+'"  name="cami[]" value="'+datos.key+'" />';
        Camiones+=' <label for="check'+i+'">'+datos.key+'</label></div>';
         
        i++;
         $(Camiones).appendTo('#listado');
            
        });
   });
      
  // var btnaddempl = $('iframe[name=frame_empleado]').contents().find('#btn_nuevotrabajador');//.val();
    //btnaddempl.addEventListener("click",lista);
    
   
    
    
     var refTemCampo = firebase.database().ref("temporada_campo").orderByKey().limitToLast(1);
    var incre=1;
    var campos;
    refTemCampo.on("child_added",function (valor){
        var Ref = firebase.database().ref("temporada_campo").child(valor.key);
        Ref.on("child_added",function (datosT){
            //alert(datosT.val()); 
            campos = '<option value="'+datosT.key+'">'+datosT.key+'</option>';
            incre++;
            $(campos).appendTo('#campos');
            
        
    });    
    
     $(document).ready(function() {
    $('select').material_select();
        });
    });
      
    
    var checkboxes = document.getElementById("camion_espera");    
    var AsignarCampo = document.getElementById("btn_asignar");
    AsignarCampo.addEventListener("click",AddCampo,false);
    var Select = document.getElementById("campos");
    //var salir = firebase.database().ref('asignacion_empleados_campo');
    function AddCampo(){
        
        
        
        
    if (Select.value.length <= 0 )
        {
            alert('Campo obligatorio');
            return;
        }
        var Clave=[];
        var t=0;
        var Referencia = firebase.database().ref("salidas");
        Referencia.on("child_added",function(data){
            var Referen = firebase.database().ref("salidas").child(data.key);
            Referen.on("child_added",function(data2){
                var REF = firebase.database().ref("salidas").child(data.key).child(data2.key);
                REF.on("child_added",function(data3){
                    Clave[t]=data3.key;
                    t++;
                    console.log(Clave);
                });
            });
        });
    
        
        
        
        
        
        
              
        var re=firebase.database().ref("temporada_campo").orderByKey().limitToLast(1);
        re.on("child_added",function (data){           
       var n=0;
        var ElimCamion=[];
            var i=0;
	   for(var e=0;e<checkboxes.length;e++){
           
           if(checkboxes[e].checked){
               
               var Referencia = firebase.database().ref("salidas");
               Referencia.on("child_added",function(data2){
                   
                   var Referen = firebase.database().ref("salidas").child(data2.key);
                   
                   Referen.on("child_added",function(dta){
                      
                       if(checkboxes[e].value==dta.key){
                           
                       var Ref = firebase.database().ref("salidas").child(data2.key).child(dta.key);
                           Ref.on("child_added",function(datos){
                       
                           var pushid =datos.key;
                               
                               
                            var RefEmpleados= firebase.database().ref("empleados").child(pushid);
                               
                             RefEmpleados.update({ID:ID_Empleado});
                                  
                               var RefInser = firebase.database().ref("asignacion_empleados_campo").child(data.key).child(Select.value);//.child(NomCampo.value);   
                           var empl_id={};
                           empl_id[pushid]={ID:ID_Empleado};
                           RefInser.update(empl_id);
                           var RefNodeID = firebase.database().ref("Asignacion_ID");
                           RefNodeID.update(empl_id);
                           ElimCamion[e]=checkboxes[e].value;
                           var eliminacion={};
                           eliminacion[ElimCamion[e]]={id:null};
                           //var RefEmpleados= firebase.database().ref("empleados").child(pushid);
                               //RefEmpleados.on("child_added",function(emple){
                                 //  var refe_empleados = firebase.database().ref("empleados").child(pushid);
                                   
                             //      RefEmpleados.update({ID:ID_Empleado});
                               //});
                               
                           var refSalidasCopia =firebase.database().ref("salidas/"+data2.key).child(dta.key);
                           refSalidasCopia.remove();
                           i++;
                             
                       //}
                           });
                               
                        
                                                     
                           
                           
                       }                       
                      
                   });
               });
	       }
           else{
               n++;
           }
        }
         if(n==checkboxes.length){
            alert("Seleccione una opcion");
        }
        else{
            alert("Salida Registrada");
            formReset();
            function formReset()
            {
                //document.getElementById("form_camion_espera").reset();
               window.location.reload();
                 //parent.document.getElementById("frame_asig_camion").contentWindow.location.reload();
                //$("#listado div.row").remove();
            }
        }
        
        });
    }
    });
        
    