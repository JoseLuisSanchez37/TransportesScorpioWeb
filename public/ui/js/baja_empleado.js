"use strict";

$(document).ready(function(){
  
   var database = firebase.database();

    // Fijarse que la ruta de partida ahora es la colección productos:
    var referencia=database.ref("empleados");
    var i=1;

    var empleados={};
    referencia.on('value',function(datos)
    {
        empleados=datos.val();
        
        // Recorremos los productos y los mostramos
        $.each(empleados, function(indice,valor)
        {
            
            var prevProducto='<div name="sel" class="row"><div class="col-md-3 cabeceraProducto">';            
            prevProducto+=' <input type="radio"  id="check'+i+'" onchange="mostrar();" name="emp" value="'+valor.Nombre+' '+valor.Apellido_Paterno+' '+valor.Apellido_Materno+'" />';
            prevProducto+=' <label for="check'+i+'">'+valor.Nombre+' '+valor.Apellido_Paterno+' '+valor.Apellido_Materno+'</label></div>';
            i=i+1;
            $(prevProducto).appendTo('#listado');            
            });  
       
    });
    
    //var slc_empleados = document.getElementById("asig_camion");
    function mostrar(){
        alert("hola");
    }
    
});