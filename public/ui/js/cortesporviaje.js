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
                ObtenerSalarios();
                //CargarSalidasPorCampo();
                CargarLlenadoCampos();
            });            
        });
    });

  
});

  function CargarLlenadoCampos() //llenado del combo de campos 
  {
    var campos ="";
    var refCampo = firebase.database().ref("temporada_campo/" + temporadaactual );
        refCampo.on("value", function (dataResponse) {
            dataResponse.forEach(function(child){
            campos = '<option value="' + child.key + '">' + child.key + '</option>';
            $(campos).appendTo('#campos');
            });
            $(document).ready(function () {
                $('select').material_select();
            });
        });
  }

var AsignarCampo = document.getElementById("btn_Seleccionar");
AsignarCampo.addEventListener("click", CargarSalidasPorCampo, false);


function CargarSalidasPorCampo()
{
   document.getElementById('tablita').innerHTML = '';   //limpiar tabla  
  var Select = document.getElementById("campos");

  if (Select.value.length <= 0) {
    alert('Seleccione Un Campo');
    return;
    }
   
    var campo = Select.value;
    camposeleccionado = campo;
  
    var reffechassalidas = firebase.database().ref('SalidasFiltro/' + sede + '/' + temporadaactual + '/' + campo); 
    reffechassalidas.once('value',function(datafechassalidas){
        //console.log(datafechassalidas.val());
        datafechassalidas.forEach(function(childFecha){
          //console.log(childFecha.key);
          var fechasalida  = childFecha.key;
            childFecha.forEach(function(childCamion){
              //console.log(childCamion.key);
              var camion = childCamion.key;
              //console.log(childCamion.numChildren());
              var numtrabajadores = 'PENDIENTE' //childCamion.numChildren();
              var fechapedazos = fechasalida.split('-');
              var fechacompleta = fechapedazos[2] +'/'+ fechapedazos[1] + '/' + fechapedazos[0];
              var fechainicio = sumaFecha(2,fechacompleta);
              var fechafinal = sumaFecha(92,fechacompleta);
              var fila = '<tr>' +
              '<td>' + fechasalida + '</td>' +
              '<td>' + fechainicio + '</td>' +
              '<td>' +  fechafinal + '</td>' +
              '<td>' + camion + '</td>' +
              '<td>' +  numtrabajadores + '</td>'+ 
              '<td>' + 
              '<p> <a onclick="GenerarListado(name);" name="'+ fechasalida + '/' + camion + '" class="waves-effect waves-light btn">Listado</a> </p>' +
              '<a disabled=true  onclick="terminarcontrato(name)" id="btntercon_'+ fechasalida.replace('-','_') + '_' + camion +'_" name="'+ fechasalida + '/' + camion + '"  class="waves-effect waves-light btn red">Terminar Contrato</a>' +
              '</td>' +
              '</tr>';
              var btn = document.createElement("TR");
              btn.innerHTML=fila;
              document.getElementById("tablita").appendChild(btn);
            });
        });

    });

}


function ObtenerSalarios()
{
    var refsalarios = firebase.database().ref('temporada/' + temporadaactual + '/salarios/'); 
    refsalarios.once('value',function(datasalarios){
       datasalarios.forEach(function(childSalarios){
          salarios[childSalarios.key] = childSalarios.val();
       });
    });
}

function ImprimirListado()
{
    var fechadeshabilitar = viajeseleccionado;
    $('#btntercon_'+ fechadeshabilitar.replace('-','_').replace('/','_') +'_').attr("disabled", false);
    seimprimiolistado = true;
    var columns = ["Numero de control","CURP","Nombre completo","Fecha llegada","Fecha termino","Enganche","Dias trabajados","total","Giros","Prestamos","Total a pagar"];
    var doc = new jsPDF('1', 'mm',[612,  1008]);
    var logo = new Image();
    logo.src = 'ui/img/horizontalmarcaagua.jpg'.trim();
    doc.addImage(logo, 'JPEG', 200, 10,210,30);
    doc.setFontSize(16);
    doc.setFontStyle('bold');
    doc.text(270, 50, 'Listado de empleados');
    var fechas = new Date();
    var fechagenerado = (fechas.getFullYear() + "-" + (fechas.getMonth() +1) + "-" + fechas.getDate())
    doc.text(270, 60,'Generado: ' + fechagenerado);
    doc.autoTable(columns, arrempleadostabla ,{styles: {fontSize: 12}, margin : {top: 70}});
    doc.save('ListaEmpleados.pdf');
}

var seimprimiolistado = false;
var camposeleccionado = "";
function terminarcontrato(dato)
{
    var eliminardeasistenciaas = "";
    var diascontrato = 0;
    if(seimprimiolistado == true)
    {
      var confirmterminocontrato=confirm("¿Desea Terminar El Contrato, Se Eliminaran todos los datos?");
      if (confirmterminocontrato)
      {
         var idempladosrenuevan = new Array();
         idempladosrenuevan.length =0;
         var hayrenovaciones = false;
         var inp = document.getElementsByTagName('input');
         for(var i in inp){
            if(inp[i].type == "checkbox"){
                inp[i].disabled = true;
                if(inp[i].checked == true)
                {
                 idempladosrenuevan.push(arrayterminocontrato[i-1][13])
               hayrenovaciones = true;    
           }
       }
   }

   if(hayrenovaciones == true)
   {
    diascontrato = prompt("Ingrese los dias de duracion del contrato");
   }
            var updates = {};
            var updates2 = {};
            for (var x=0; x<arrayterminocontrato.length; x++)
            {      
                var post = {
                    Apellido_Materno: arrayterminocontrato[x][3],
                    Apellido_Paterno: arrayterminocontrato[x][4],
                CURP: arrayterminocontrato[x][5], //poner el push id en lugar de curp 
                Fecha_Nacimiento: arrayterminocontrato[x][6],
                Fecha_Salida: arrayterminocontrato[x][7],
                Lugar_Nacimiento: arrayterminocontrato[x][8],
                Nombre: arrayterminocontrato[x][9],
            };

            updates2['/contratos/' + sede  + '/' + arrayterminocontrato[x][2] + '/' +  temporadaactual + '/' +  arrayterminocontrato[x][10] + '_' +  arrayterminocontrato[x][11]  ] = arrayterminocontrato[x][12] ;
            updates['/contratos/' + sede  + '/' + arrayterminocontrato[x][2] ] = post ;
            var campoeliminacion = arrayterminocontrato[x][14];
            var idasisgnasistema = arrayterminocontrato[x][13];
            var refempleadoeliminarOMod = 'asignacion_empleados_campo/' + sede + '/' + temporadaactual + '/' + campoeliminacion + '/' + idasisgnasistema + '/';
            for(var y=0; y<idempladosrenuevan.length; y++)
            {
                if(idempladosrenuevan[y] == arrayterminocontrato[x][13])
                {
                 var updatesrenovacion = {};
                 firebase.database().ref(refempleadoeliminarOMod + 'Camion').remove();
                 firebase.database().ref(refempleadoeliminarOMod + 'Enganche').remove();
                 firebase.database().ref(refempleadoeliminarOMod + 'IDExterno').remove();
                 var fechas = new Date();
                 var fechacompletaRen = fechas.getDate() + "/" + (fechas.getMonth() +1) + "/" + fechas.getFullYear()
                 var fechaInicioRenovacion  = sumaFecha(1,fechacompletaRen);
                 updates[refempleadoeliminarOMod + 'Contrato'] = diascontrato ;
                 updates[refempleadoeliminarOMod + 'Fecha_Salida'] = fechaInicioRenovacion;
                 updates[refempleadoeliminarOMod + 'Modalidad'] = 'Renovacion' ;
                 firebase.database().ref().update(updatesrenovacion); //inserta los renovados
               }

               if(y==idempladosrenuevan.length)
               {
                var eliminarasignacioncampo = firebase.database().ref('asignacion_empleados_campo/' + sede + '/' + temporadaactual + '/' + arrayterminocontrato[x][14] + '/' + arrayterminocontrato[x][13] ).remove();
                //alert(eliminarasignacioncampo);
                var refeliminar = firebase.storage().ref('imagenes/'+ arrayterminocontrato[x][1] +'.jpg');
                refeliminar.delete().then(function() {
                    console.log('Se elimino la imagen');
                }).catch(function(error) {
                        //console.log(error);
                });
            }
        }
        eliminardeasistenciaas = arrayterminocontrato[x][0];
        var reffechasasistenciascampo = firebase.database().ref('asistencias/' + sede + '/' + campoeliminacion  );
        reffechasasistenciascampo.on('child_added',function(datafecha){ 
        var reffechastrabajadas = firebase.database().ref('asistencias/' + sede + '/'  + campoeliminacion + '/' + datafecha.key + '/' + eliminardeasistenciaas ).remove();
        });
        //reffechasasistenciascampo.off();
        var refeliminarpaselista = firebase.database().ref('pase_de_lista/' +   sede + '/' +  arrayterminocontrato[x][14] + '/' + arrayterminocontrato[x][0]).remove();
        var refeliminarregistrostrabajadores = firebase.database().ref('registros_trabajadores/' + sede + '/' +  arrayterminocontrato[x][14] + '/' + arrayterminocontrato[x][0]).remove();            
    }
        firebase.database().ref().update(updates);
        firebase.database().ref().update(updates2);
        var salidaEliminara = firebase.database().ref('salidasCopia/' + dato);
        console.log(salidaEliminara);
        salidaEliminara.remove();
        var SalidaFiltroEliminara = firebase.database().ref('SalidasFiltro/' + sede + '/' + temporadaactual + '/' + camposeleccionado + '/' + dato);
        console.log("Referencia Eliminar: " + SalidaFiltroEliminara);
        //console.log(SalidaFiltroEliminara);
        SalidaFiltroEliminara.remove();
        alert('Termino de contrato realizado');
        location.reload(true);        
    }
}
else
{
    alert('Antes de terminar el cotrato imprima la lista');
}
}

var sede="";
var  temporadaactual ="";
var salarios = [];
var arrempleadostabla = new Array();
var arrayterminocontrato = new Array();
var listadoseleccionado = "";
var viajeseleccionado="";

var campos = new Array();

function GenerarListado(dato)
{
  
  viajeseleccionado = dato;
   document.getElementById('bodylistadoempleados').innerHTML = '';   //limpiar tabla  
   $('.modal').modal();
   $('#modal1').modal('open');
   var campo = camposeleccionado; // es el que se seleccionara del combo

   var pushidempleados = new Array();
   var refempleadospushid = firebase.database().ref('salidasCopia/' + dato  + '/'); 
   refempleadospushid.once('value',function(dataemp){

      dataemp.forEach(function(childPushIds){
      //console.log(childPushIds.key);
      var pushid = childPushIds.key;
        pushidempleados.push(pushid);
      });       

      var refids = firebase.database().ref('asignacion_empleados_campo/' + sede  + '/' + temporadaactual + '/' + campo + '/'); 
      refids.once('value',function(dataids){
        dataids.forEach(function(childDatosEmpleado){
        var pushid = childDatosEmpleado.val().pushId;
        var idnormalasigsis = childDatosEmpleado.key;

          var resultadoBusquedaIndex = pushidempleados.indexOf(pushid);
          if(resultadoBusquedaIndex >= 0 )
          {
           // console.log("Existe en posision: " + resultadoBusquedaIndex);
            //console.log(idnormalasigsis);
        
            //
            var idbuscar = idnormalasigsis;
            if(childDatosEmpleado.val().IDExterno != 'undefined')
              {
                idbuscar = childDatosEmpleado.val().IDExterno
              }


            var totalasistencias= 0;
            var totalgiros = 0;
            var totalprestamos = 0;
            var totaldiastrabajados = 0;

            var refprestamos = firebase.database().ref('registros_trabajadores/' + sede  + '/' + campo + '/' + idbuscar + '/prestamos/'); 
              refprestamos.once('value',function(dataprestamos){
               dataprestamos.forEach(function(childPrestamos){
                totalprestamos =  totalprestamos +  parseInt(childPrestamos.val());
               });
            });

            var refgiros = firebase.database().ref('registros_trabajadores/' + sede  + '/' + campo + '/' + idbuscar + '/giros/'); 
              refgiros.once('value',function(datagiros){
              datagiros.forEach(function(childGiros){
                totalgiros =  totalgiros + parseInt(childGiros.val());
              });
            });

            //console.log(childCamion.numChildren());


            var refasistencias = firebase.database().ref('registros_trabajadores/' + sede  + '/' + campo + '/' + idbuscar + '/asistencias/'); 
              refasistencias.on('child_added',function(dataasistencias){
              var pago = parseInt(salarios[dataasistencias.val()]);
              totalasistencias =  totalasistencias + pago;
              totaldiastrabajados = totaldiastrabajados + 1;
            });


            var refasistencias2 = firebase.database().ref('registros_trabajadores/' + sede  + '/' + campo + '/' + idbuscar + '/asistencias/').limitToFirst(1); 
                refasistencias2.once('value',function(dataasistencias){

              var fechasalida = childDatosEmpleado.val().Fecha_Salida;
              var fechapedazos = fechasalida.split('-');
              var fechacompleta = fechapedazos[2] +'/'+ fechapedazos[1] + '/' + fechapedazos[0];
              var fechainicio = sumaFecha(2,fechacompleta);
              var fechafinal = sumaFecha(92,fechacompleta);
              var nomcompleto = childDatosEmpleado.val().Nombre + ' ' + childDatosEmpleado.val().Apellido_Paterno + ' ' + childDatosEmpleado.val().Apellido_Materno ; 
              var enganche = parseInt(childDatosEmpleado.val().Enganche);
              var totalapagar = totalasistencias - (totalgiros + totalprestamos + enganche);
              var filaempleado = '<tr>' + 
                  '<td><input type="checkbox" id="checkbox' + idbuscar +  '_"/> <label for="checkbox' + idbuscar + '_"></label></td>' +
                  '<td>' + idbuscar +'</td>' +
                  '<td>' + childDatosEmpleado.val().CURP +'</td>' +
                  '<td>'+nomcompleto+'</td>' +
                  '<td>'+ childDatosEmpleado.val().Enganche+'</td>' +
                  '<td>'+totaldiastrabajados+'</td>' + 
                  '<td>$'+totalasistencias+'</td>' + 
                  '<td>$'+totalgiros+'</td>' + 
                  '<td>$'+totalprestamos+'</td>' + 
                  '<td>$'+totalapagar+'</td>' + 
                  '</tr>';
                  var btn = document.createElement("TR");
                  btn.innerHTML=filaempleado;
                  document.getElementById("bodylistadoempleados").appendChild(btn);
                  var value = [idbuscar, childDatosEmpleado.val().CURP, nomcompleto, fechainicio, fechafinal, "$ " + childDatosEmpleado.val().Enganche,totaldiastrabajados, "$ " +  totalasistencias, "$ " + totalgiros, "$ " + totalprestamos, "$ " + totalapagar];
                  arrempleadostabla.push(value);
                   var valuetermino = [idbuscar, childDatosEmpleado.val().pushId,childDatosEmpleado.val().CURP, childDatosEmpleado.val().Apellido_Materno, childDatosEmpleado.val().Apellido_Paterno, childDatosEmpleado.val().CURP, childDatosEmpleado.val().Fecha_Nacimiento, childDatosEmpleado.val().Fecha_Salida, childDatosEmpleado.val().Lugar_Nacimiento, childDatosEmpleado.val().Nombre, fechainicio, fechafinal, totaldiastrabajados,idnormalasigsis,campo];
                    arrayterminocontrato.push(valuetermino);
                  });
                  //refasistencias.off() 
            //
          }

        });  
      }); //quitar esta
});
}

var arrarempleadosdata= new Array();

function sumaFecha(d, fecha)
{
   var Fecha = new Date();
   var sFecha = fecha || (Fecha.getDate() + "/" + (Fecha.getMonth() +1) + "/" + Fecha.getFullYear());
   var sep = sFecha.indexOf('/') != -1 ? '/' : '-'; 
   var aFecha = sFecha.split(sep);
   var fecha = aFecha[2]+'/'+aFecha[1]+'/'+aFecha[0];
   fecha= new Date(fecha);
   fecha.setDate(fecha.getDate()+parseInt(d));
   var anno=fecha.getFullYear();
   var mes= fecha.getMonth()+1;
   var dia= fecha.getDate();
   mes = (mes < 10) ? ("0" + mes) : mes;
   dia = (dia < 10) ? ("0" + dia) : dia;
   var fechaFinal = anno + '-' + mes + '-' + dia;
   return (fechaFinal);
}