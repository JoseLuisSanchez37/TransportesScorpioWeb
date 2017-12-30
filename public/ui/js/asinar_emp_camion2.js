"use strict";

$(document).ready(function(){

    var listEmpleados;

    var EmpSalidas=[];
    var IDS=[];
    var NO=[];
    var a=0;
    var i=0;
    //var btnVer = document.getElementById("ver");
    //btnVer.addEventListener("click",mostrar,false);
    //function mostrar(){

    var database = firebase.database().ref("empleados");
    $("#listado div.row").remove();
    var RefSalidas = firebase.database().ref("salidasCopia");
        RefSalidas.on("child_added",function(data){

            var refSaldate = firebase.database().ref("salidasCopia").child(data.key);
            refSaldate.on("child_added",function(datos){
                var refcamionsal = firebase.database().ref("salidasCopia").child(data.key).child(datos.key);


                refcamionsal.on("child_added",function(datos2){
                    EmpSalidas[i]=datos2.key;
                    i++;
                    //alert(datos2.key);
            });
        });
        });
    //var btnVer = document.getElementById("ver");
    //btnVer.addEventListener("click",mostrar,false);
    //function mostrar(){
        var checar=false;
        var p=0;
        database.on("child_added",function(emp){
            //alert(emp.key);
        console.log(EmpSalidas.length);
            for(var j=0;j<EmpSalidas.length;j++){
                if(emp.key==EmpSalidas[j]){
                    checar=true;
                }
            }
            if(checar==false){
              //Agregado por Jose Luis. Se evalua si el empleado ya fue asignado a un camion.
              //Si aun no esta asignado un camion lo mostramos, de lo contrario no se muestra.
              if (!emp.val().Camion) {
                listEmpleados='<div name="sel" class="row"><div class="col-md-3 ">';
                listEmpleados+=' <input type="checkbox"  id="check'+p+'"  name="emp[]" value="'+emp.key+' '+emp.val().Nombre+'" />';
                listEmpleados+=' <label for="check'+p+'">'+emp.val().Nombre+' '+emp.val().Apellido_Paterno+' '+emp.val().Apellido_Materno+'</label></div>';
                p++;
                $(listEmpleados).appendTo('#listado');
              }

            }

            checar=false;

        });

    //}









    var auto = document.getElementById('num_camion');
    var slc_empleados = document.getElementById("asig_camion");
    slc_empleados.addEventListener("click",ver,false);

    var obj = {};
    obj[auto.value];
    var insert=auto.value;

    var f = new Date();

    var SALIDAS;
    var SALIDAS2;
    var eliminar;
    function ver(){
        if (auto.value.length <=0 )
        {
            alert('Camion obligatorio');
            return;
        }
        var n=0;


        var a= document.getElementById("camion");
        for(var i=0;i<a.length;i++){
            if(a[i].checked){
                //var id = (a[i].value);
                //var ID=parseInt(id);
                var num = a[i].value.indexOf(" ");
                var Nombre=a[i].value.substring(num);
                var ID=a[i].value.substring(0, num);
                var empleado={};
                empleado[ID] = { Nombre: Nombre };

                var referEmpleado = firebase.database().ref("empleados/" + ID);
                referEmpleado.update({ fechaSalida: (f.getFullYear() + "-" + (f.getMonth() +1) + "-" + f.getDate()) });

                SALIDAS= firebase.database().ref('salidasCopia'+'/'+(f.getFullYear() + "-" + (f.getMonth() +1) + "-" + f.getDate()+'/'+auto.value));
                SALIDAS2= firebase.database().ref('salidas'+'/'+(f.getFullYear() + "-" + (f.getMonth() +1) + "-" + f.getDate()+'/'+auto.value));
                SALIDAS.update(empleado);
                SALIDAS2.update(empleado);
            }
            else{
                n++;
            }


        }

        if(n==a.length){
            alert("Seleccione una opcion");
            return;
        }
        else{


            alert("Camion Registrado");
           window.location.reload();

        }

    }




});
