"use strict";
$(document).ready(function(){

    var useremail = "";
    var emailsinarroba ="";
    firebase.auth().onAuthStateChanged(function (user) {
        useremail = user.email;
        emailsinarroba  =  useremail.substr(0,useremail.indexOf("@"));

        var informacionusuario = firebase.database().ref('usuarios/' + emailsinarroba  ); 
        informacionusuario.once('value',function(data){
            sede = data.val().sede;
            var reftemporadaactual = firebase.database().ref('temporadas_sedes/' + sede + '/'); 
            reftemporadaactual.once('value',function(datatemporada){
                temporadaactual = datatemporada.val().Temporada_Actual;
            });            
        });
    });
});

var sede = "";
var temporadaactual = "";
var camposeleccionado = "";
var IDEspecialModificar = "";
var idnormalsistema;

function BuscarTrabajadorPorIdEspecial()
{
    var IdABuscar = document.getElementById('IdABuscar').value;
    var RefCampos = firebase.database().ref('asignacion_empleados_campo/' + sede +'/' + temporadaactual + '/');
    RefCampos.on('child_added', function (dataCampos) {
        var campo = dataCampos.key;
        var refids = firebase.database().ref('asignacion_empleados_campo/' + sede  + '/' + temporadaactual + '/' + campo + '/'); 
        refids.on('child_added',function(dataids){
            var pushid  = dataids.val().pushId;           
            var idnormalasigsis = dataids.key;
            var idbuscar = dataids.key;
            
            if(dataids.val().IDExterno != 'undefined')
            {
                idbuscar = dataids.val().IDExterno;
            }
            
           var nomcompleto = dataids.val().Nombre + dataids.val().Apellido_Paterno +  dataids.val().Apellido_Materno ;     
    
           if( IdABuscar == idbuscar)
           {
            IDEspecialModificar = idbuscar;
            camposeleccionado = campo;
            idnormalsistema = idnormalasigsis;
                  var filaempleado = '<tr>' +
                  '<td id="numControl_' + pushid + '">'+  idbuscar +'</td>' +
                  '<td id="curp_' + pushid + '">'+ dataids.val().CURP +'</td>' +
                  '<td id="act_' + pushid + '">' + dataids.val().Actividad + '</td>' + 
                  '<td id="nom_' + pushid + '">'+ dataids.val().Nombre+'</td>' + 
                  '<td id="ap_' + pushid + '">'+ dataids.val().Apellido_Paterno+'</td>' + 
                  '<td id="am_' + pushid + '">' + dataids.val().Apellido_Materno +  '</td>' + 
                  '<td id="fn_' + pushid + '">' + dataids.val().Fecha_Nacimiento +'</td>' + 
                  '<td id="ln_' + pushid + '">' + dataids.val().Lugar_Nacimiento + '</td>' + 
                  '<td class="boton" >' + 
                  '<p> <a onclick="ModificarModal(name);" name="'+ pushid +'" class="waves-effect waves-light btn ">Editar</a> </p>' +
                  '</td>' + '</tr>';
                  var btn = document.createElement("TR");
                  btn.innerHTML=filaempleado;
                  document.getElementById("cuerpo_tablita").appendChild(btn);
                  //arrarempleadosdata.push(value2);
           }
         });
    });
}


function ModificarModal(dato)
{   
  $('.modal').modal();
  $('#modal1').modal('open');
  document.getElementById('NumeroDeControl').value = IDEspecialModificar;
}

function GuardarModificacion()
{
  var NuevoID = document.getElementById('NumeroDeControl').value;
  var idespecial  = NuevoID;
  var roltrabajador = "";

        //buscar si el id existe
        var ExisteElID = false;
        var refempleadoexistente =  firebase.database().ref('asignacion_empleados_campo/' + sede + '/' + temporadaactual  + '/' +  camposeleccionado);
        refempleadoexistente.on('child_added',function(dataempleados){
            var idempleadonormal = dataempleados.key;
            //alert('ID sistema: ' + dataempleados.key); // trae el id que asigna el sistema del empleado
            var refIDEspecialexistente =  firebase.database().ref('asignacion_empleados_campo/' + sede + '/' + temporadaactual  + '/' +  camposeleccionado + '/' + idempleadonormal + '/IDExterno');
            refIDEspecialexistente.once('value',function(dataempleadosexiste){ 
               var idespecialtiene = dataempleadosexiste.val();

               if(idespecialtiene != null)
               {
                    //alert('El Id: ' + idempleadonormal + 'tiene id especial : ' + idespecialtiene );
                    if(idespecialtiene == idespecial) 
                    {
                        ExisteElID = true;
                        //console.log('Ya existe el que ando buscando....');
                    }
               }
            });
        });

        //AQUI PONER EL IF QUE AGREGARA  dentro de una iteracion

        if(ExisteElID == true)
        {
            alert('EL ID Ya está asignado a otro trabajador, Verifique');
            //poner el focus en el txt
        }
        else
        {
            var refpaselista =  firebase.database().ref('pase_de_lista/' + sede + '/' +  camposeleccionado + '/' + IDEspecialModificar );
            refpaselista.once('value', function (dataPaseLista) {
                roltrabajador = dataPaseLista.val();
                firebase.database().ref('pase_de_lista/' + sede + '/' + camposeleccionado + '/' + NuevoID).set(roltrabajador);
                var referenciaeliminar = 'pase_de_lista/' + sede + '/' +  camposeleccionado + '/' + IDEspecialModificar;
                EliminarDePaseLista(referenciaeliminar);
            });
            
            firebase.database().ref('asignacion_empleados_campo/' + sede + '/' + temporadaactual + '/' + camposeleccionado + '/' + idnormalsistema + '/IDExterno').set(NuevoID);
            //refpaselista.remove();
            //falta eliminar el pase de lista que itero

            //refpaselista.remove();
            alert('Modificado Correctamente');
            location.reload();

        }
}

function EliminarDePaseLista(referenciaRec)
{
    firebase.database().ref(referenciaRec).remove();
}
