"use strict";
$(document).ready(function(){
  document.getElementById('CargarPDF').disabled = true;
  var contacnumcamiones= "";
  var concatCamionesModal = "";
  var fechassalidas = firebase.database().ref('salidas/');
  fechassalidas.on('child_added', function (data) {
    var fecha = data.key;
    var fechassalidas = firebase.database().ref('salidas/' + fecha +'/');
    fechassalidas.on('child_added', function (data) {
      var numcamion = data.key;
      contacnumcamiones +='<input name="groupCamiones" type="radio" id="rr'+numcamion+'_"  value="'+numcamion+'"/> <label for="rr'+numcamion+'_">'+numcamion+'</label>'
      contacnumcamiones += '<input type="hidden" id="radio'+numcamion+'_" value="'+fecha+'">';
      concatCamionesModal +='<input name="groupCamionesModal" type="radio" id="radr'+numcamion+'_"  value="'+numcamion+'"/> <label for="radr'+numcamion+'_">'+numcamion+'</label>'
      concatCamionesModal += '<input type="hidden" id="radioModal'+numcamion+'_" value="'+fecha+'">';
    });
    document.getElementById('CamionesSalieron').innerHTML = contacnumcamiones;
    document.getElementById('CamionesSalieronModal').innerHTML = concatCamionesModal;
  });
});


document.getElementById('btn_cargarListas').addEventListener('click',CargarListadoCamion);
var numcamion = ""; 
var fechacamionselec = "";

function CargarListadoCamion()
{ 
  $('tbody tr').remove();
  arrarempleadosdata.length = 0;
  document.getElementById('CargarPDF').disabled = false;
  $("input[name=groupCamiones]:checked").each(function(){
   numcamion = ($(this).val());
 });

  fechacamionselec = document.getElementById('radio'+numcamion+'_').value;
    var numconsecutivoempleado = 1;
  var pushidempleados = firebase.database().ref('salidas/' + fechacamionselec +'/' + numcamion + '/');
  pushidempleados.on('child_added', function (data) {
    var pushid = data.key;
    var pushidempleados = firebase.database().ref('empleados/' + pushid +'/');
    pushidempleados.once('value', function (data) {
          var FechaYCamionSalida = fechacamionselec + '/' + numcamion;
          var value = [data.val().CURP,data.val().Actividad, data.val().Nombre, data.val().Apellido_Paterno, data.val().Apellido_Materno, data.val().Fecha_Nacimiento, data.val().Lugar_Nacimiento];
          var value2 = [numconsecutivoempleado,data.val().CURP,data.val().Nombre, data.val().Apellido_Paterno, data.val().Apellido_Materno, data.val().Fecha_Nacimiento, data.val().Lugar_Nacimiento]; 
          var filaempleado = '<tr>' +
          '<td id="num_' + pushid + '">'+  numconsecutivoempleado +'</td>' +
          '<td id="curp_' + pushid + '">'+ data.val().CURP +'</td>' +
          '<td id="act_' + pushid + '">' + data.val().Actividad + '</td>' + 
          '<td id="nom_' + pushid + '">'+ data.val().Nombre+'</td>' + 
          '<td id="ap_' + pushid + '">'+ data.val().Apellido_Paterno+'</td>' + 
          '<td id="am_' + pushid + '">' + data.val().Apellido_Materno +  '</td>' + 
          '<td id="fn_' + pushid + '">' + data.val().Fecha_Nacimiento +'</td>' + 
          '<td id="ln_' + pushid + '">' + data.val().Lugar_Nacimiento + '</td>' + 
          '<td class="boton" >' + 
          '<p> <a onclick="ModificarModal(name);" name="'+ pushid +'" class="waves-effect waves-light btn ">Modificar</a> </p>' +
          '<p> <a onclick="MoverDeCamion(name,id);" id="' + FechaYCamionSalida + '" name="'+ pushid +'" class="waves-effect waves-light btn ">Mover</a> </p>' +
          '<a onclick="EliminarDeCamion(name)" name="'+ pushid +'"; class="waves-effect waves-light btn red">Eliminar</a>' +
          '</td>'
          '</tr>';
          var btn = document.createElement("TR");
          btn.innerHTML=filaempleado;
          document.getElementById("cuerpo_tablita").appendChild(btn);
          arrarempleadosdata.push(value2);
          numconsecutivoempleado =  numconsecutivoempleado + 1;      
        });
  });

}


function GuardarMoverCamion()
{
  var numcamionmover = "";
  $("input[name=groupCamionesModal]:checked").each(function(){
   numcamionmover = ($(this).val());
  });
  var pushidempleados = firebase.database().ref('empleados/' + pushidmover +'/');
  pushidempleados.once('value', function (data) {
  var nombreguardar = data.val().Nombre;
  var fechaGuardar = document.getElementById('radioModal'+numcamion + '_').value;
  var updates = {};
  updates['salidas/' + fechaGuardar +'/' + numcamionmover + '/' + pushidmover + '/nombre'] = nombreguardar.toUpperCase();
  updates['salidasCopia/' + fechaGuardar +'/' + numcamionmover + '/' + pushidmover + '/nombre'] = nombreguardar.toUpperCase();    
  updates['salidas/' + fechaycamionViene + '/' + pushidmover + '/nombre'] = null;
  updates['salidasCopia/' + fechaycamionViene + '/' + pushidmover + '/nombre'] = null;    
  firebase.database().ref().update(updates);
  alert('Se Movio Al Camion: ' + numcamionmover);
  location.reload();
  });
}

var pushidmover="";
var fechaycamionViene = "";

function MoverDeCamion(dato,VieneDe)
{
  pushidmover= dato;
  fechaycamionViene = VieneDe;
  $('.modal').modal();
  $('#modalListadoCamiones').modal('open');
  document.getElementById('pushidmodificar').value = dato;
}

function ModificarModal(dato)
{
  $('.modal').modal();
  $('#modal1').modal('open');
  document.getElementById('nombre').value = document.getElementById('nom_' + dato ).innerHTML;
  document.getElementById('apellido_paterno').value = document.getElementById('ap_' + dato ).innerHTML;
  document.getElementById('apellido_materno').value = document.getElementById('am_' + dato ).innerHTML;
  document.getElementById('curp').value = document.getElementById('curp_' + dato ).innerHTML;
  document.getElementById('fecha_nacimiento').value = document.getElementById('fn_' + dato ).innerHTML;
  document.getElementById('lugar_nacimiento').value = document.getElementById('ln_' + dato ).innerHTML;
  document.getElementById('pushidmodificar').value = dato;
}

function GuardarModificacion()
{
  var nombre = document.getElementById('nombre');
  var apellido_paterno = document.getElementById('apellido_paterno');
  var apellido_materno = document.getElementById('apellido_materno');
  var fecha_nacimiento = document.getElementById('fecha_nacimiento');
  var lugar_nacimiento = document.getElementById('lugar_nacimiento');
  var curp = document.getElementById("curp");
  var pushdimodificar = document.getElementById('pushidmodificar').value;
  var updates = {};
  updates['salidas/' + fechacamionselec +'/' + numcamion + '/' + pushdimodificar + '/nombre'] = nombre.value.toUpperCase();
  updates['salidasCopia/' + fechacamionselec +'/' + numcamion + '/' + pushdimodificar + '/nombre'] = nombre.value.toUpperCase();    
  updates['/empleados/' + pushdimodificar + '/Nombre'] = nombre.value.toUpperCase();
  updates['/empleados/' + pushdimodificar + '/Apellido_Paterno'] = apellido_paterno.value.toUpperCase();
  updates['/empleados/' + pushdimodificar + '/Apellido_Materno'] = apellido_materno.value.toUpperCase();
  updates['/empleados/' + pushdimodificar + '/Fecha_Nacimiento'] = fecha_nacimiento.value.toUpperCase();
  updates['/empleados/' + pushdimodificar + '/Lugar_Nacimiento'] = lugar_nacimiento.value.toUpperCase();
  updates['/empleados/' + pushdimodificar + '/CURP'] = curp.value.toUpperCase();
  firebase.database().ref().update(updates);
  alert('Modificado');
  location.reload();
}

function EliminarDeCamion(dato)
{
  if(confirm("¿Desea Eliminar Al Empleado?"))
  {
   var refSalidas = firebase.database().ref('salidas/' + fechacamionselec +'/' + numcamion + '/' + dato);
   refSalidas.remove();
   var refSalidasCopia = firebase.database().ref('salidasCopia/' + fechacamionselec +'/' + numcamion + '/' + dato);
   refSalidasCopia.remove();
   var refempleados = firebase.database().ref('empleados/' + dato );
   refempleados.remove();
   location.reload();
 }
}

document.getElementById('CargarPDF').addEventListener('click',CargarPDF);
var arrarempleadosdata= new Array();
function CargarPDF()
{
     var columns = ["No","CURP","Nombre", "Apellido Paterno","Apellido Materno","Fecha Nacimiento","Domicilio"];
     var doc = new jsPDF('1', 'mm', [297, 210]);
     var logo = new Image();
     logo.src = 'ui/img/horizontalmarcaagua.jpg';
     doc.addImage(logo, 'JPEG', 30, 10,210,30);
     doc.setFontSize(14);
     doc.setFontStyle('bold');
     doc.text(120, 40, 'Listado de empleados');
     doc.text(132, 47, 'Autobus ' + numcamion);
     var fechas = new Date();
     var fechasalida = (fechas.getFullYear() + "-" + (fechas.getMonth() +1) + "-" + fechas.getDate())
     doc.text(133, 54, fechasalida);
     doc.autoTable(columns, arrarempleadosdata,{styles: {fontSize: 9},margin : {top: 57} });
     doc.save('ListaEmpleados.pdf');
   }

   function EsEmpleadoSolo(pushid)
   {
    var esempleadosolo = false;
    var pushidempleados = firebase.database().ref('empleados/' + pushid +'/');
    pushidempleados.on('child_added', function (data) {
      if(data.val.Modalidad != "undefined")
      {
        esempleadosolo = true;
        return true;
      }
    });
    return esempleadosolo;
  }