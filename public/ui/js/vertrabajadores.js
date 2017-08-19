"use strict";

$(document).ready(function(){
  
  var tbl_trabajador = $('#tbl_trabajadores').DataTable({
      processing:true,
      "language": {
        "processing": "Cargando...",
        "url":"//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
        }
    });
  
  var empleados = firebase.database().ref('empleados/');
    empleados.on('child_added', function (data) {
        var value = [data.val().CURP,data.val().Actividad, data.val().Nombre, data.val().Apellido_Paterno, data.val().Apellido_Materno, data.val().Fecha_Nacimiento, data.val().Lugar_Nacimiento];
        tbl_trabajador.rows.add([value]).draw();
    });
});