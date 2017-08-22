"use strict";

$(document).ready(function(){

  var tbl_trabajador = $('#tbl_trabajadores').DataTable({
      processing:true,
      "language": {
        "processing": "Cargando...",
        "url":"//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
        }
    });

  //var empleados = firebase.database().ref('empleados/');
  //empleados.on('child_added', function (data) {
  //  var value = [data.val().CURP,data.val().Actividad, data.val().Nombre, data.val().Apellido_Paterno, data.val().Apellido_Materno, data.val().Fecha_Nacimiento, data.val().Lugar_Nacimiento];
  //  tbl_trabajador.rows.add([value]).draw();
  //});

  var trabajadoresPorCamion = [];
  var camiones;
  var salidasRef = firebase.database().ref('salidas');
  salidasRef.on('child_added', function(fechas)){
      var fechasRef = firebase.database().ref('salidas').child(fechas.key);
      fechasRef.on("child_added", function(camiones){
          camiones = '<option value="' + camiones.key + '">' + camiones.key + '</option>';
          $(camiones).appendTo('#camiones');
          $(document).ready(function () {
            $('select').material_select();
          });
      });
  });

  var consultarLista = document.getElementById("btn_consultar");
  consultarLista.addEventListener("click", consultarTrabajadores, false);
  var camionSeleccionado = document.getElementById("camiones");

  function consultarTrabajadores{

  }


});
