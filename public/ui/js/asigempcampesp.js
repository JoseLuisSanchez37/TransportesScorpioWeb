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
             var tempactual = firebase.database().ref('temporadas_sedes/' + sede ); 
             tempactual.once('value',function(data){
                temporadaactual = data.val().Temporada_Actual;
                var concatcampos="";
                var campos = firebase.database().ref('temporada_campo/' + temporadaactual +"/"); 
                campos.on('child_added',function(data){
                    if(data.val() == "true"){
                        var nombrecampo =  data.key;
                        concatcampos +='<input name="groupCampos" type="radio" id="radio'+ nombrecampo+'_" checked="checked" value="'+nombrecampo+'"/> <label for="radio'+nombrecampo+'_">'+nombrecampo+'</label>'
                        document.getElementById('Campos').innerHTML = concatcampos;
                        camposespeciales.push(data.key);    
                    } 
                });
            });
        });
    });
 });

     var camposespeciales = new Array();
     var sede ="";
     var temporadaactual="";
     var IdsEmpleadosCampo = new Array();
     var camposelec ="";

     function EliminarNodoHTML(idnodo,numeroempleado,valueboton)
     {
        alert(numeroempleado);
        alert(valueboton);
        document.getElementById(idnodo).innerHTML = "";
     }

    function CargarEmpleadosPorCampoEspecial()
    {
        $("input[name=groupCampos]:checked").each(function(){
        camposelec = ($(this).val());
        });

        var concatxtempleados= '<strong>Ingrese IDs especiales del campo '+ camposelec +':</strong>';
        var empleadosdelcampo = firebase.database().ref('asignacion_empleados_campo/' + sede +  '/' + temporadaactual +"/" + camposelec ); 
        empleadosdelcampo.on('child_added',function(data){
            var numempleado = data.key;
            IdsEmpleadosCampo.push(data.key);

                var x=0;
                var apmaterno="";
                var appaterno="";
                var nombre = "";
                var tieneidexterno = false;
                var tipodeactividad="";
               var empleado = firebase.database().ref('asignacion_empleados_campo/' + sede +  '/' + temporadaactual +"/" + camposelec  +  "/" + numempleado); 
                empleado.on('child_added',function(data){
                    
                    if(data.key == "Apellido_Materno")
                    {
                        apmaterno = data.val();
                    }
                    if(data.key == "Apellido_Paterno")
                    {
                        appaterno = data.val();
                    }
                    if(data.key == "Nombre"){
                        nombre = data.val();
                    }
                    if(data.key == "IDExterno"){
                        tieneidexterno = true; 
                    }
                    if(data.key == "Actividad")
                    {
                        tipodeactividad = data.val();
                    }
                    x=x+1;
                }); //termina obtener empleado

                if(tieneidexterno == false)
                {
                    var nomcompleto = nombre + ' ' + appaterno + ' ' + apmaterno;
                    concatxtempleados += '<div id="NodoEliminar_' + numempleado + '">';
                    concatxtempleados += '<div class="row">';
                    concatxtempleados += '<div class="input-field col s4">';
                    concatxtempleados += '<input type="number" id="txtIDEsp_' + numempleado + '" name="' + numempleado + '" class="validate" >';
                    concatxtempleados += '<label>' + nomcompleto  + ':</label>';
                    concatxtempleados += '<a class="waves-effect waves-light btn" name="' + numempleado + '" onclick="GuardarDatos(name)" >Guardar</a>';
                    concatxtempleados += '<input type="hidden" id="txt'+numempleado +'_" name="NodoEliminar_' + numempleado + '" value="'+tipodeactividad+'">';
                    concatxtempleados += '</div>';
                    concatxtempleados += '</div>';
                    concatxtempleados += '</div>';
                }
                document.getElementById('CajasTextoSalario').innerHTML = concatxtempleados; 
        });
        
        
    }

    function crearBotonesGuardar(){
        var strbotones = '<button type="button" id="btnGuardar" onclick="GuardarIdsEspeciales()" class="waves-effect waves-light btn light-blue darken-2 ">Guardar</button>         ';
        strbotones += '<button type="reset" id="cancel_temp" class="waves-effect waves-light btn light-blue darken-2">Cancelar</button>';
        document.getElementById('BotonesAgregar').innerHTML = strbotones;
    }

    function GuardarDatos(numempleadorec)
    {
        var tipoact = document.getElementById('txt'+  numempleadorec +'_').value;
        var idespecial = document.getElementById('txtIDEsp_' + numempleadorec ).value;
        
        var ExisteElID = false;
        var refempleadoexistente =  firebase.database().ref('asignacion_empleados_campo/' + sede + '/' + temporadaactual  + '/' +  camposelec  );
        refempleadoexistente.on('child_added',function(dataempleados){
            var idempleadonormal = dataempleados.key;
            var refIDEspecialexistente =  firebase.database().ref('asignacion_empleados_campo/' + sede + '/' + temporadaactual  + '/' +  camposelec + '/' + idempleadonormal + '/IDExterno');
            refIDEspecialexistente.once('value',function(dataempleadosexiste){ 
               var idespecialtiene = dataempleadosexiste.val();

               if(idespecialtiene != null)
               {
                    if(idespecialtiene == idespecial) 
                    {
                        ExisteElID = true;
                    }
               }
            });
        });

        if(ExisteElID == true)
        {
            alert('EL ID Ya está asignado a otro trabajador, Verifique');
        }
        else
        {
            firebase.database().ref('pase_de_lista/' + sede +  '/' + camposelec  +  "/" + idespecial).set(tipoact); 
            firebase.database().ref('asignacion_empleados_campo/' + sede +  '/' + temporadaactual +"/" + camposelec  +  "/" + numempleadorec + "/IDExterno").set(idespecial); 
            document.getElementById('NodoEliminar_' + numempleadorec).innerHTML = "";
            alert('Guardado Correctamente');
        }
    }

/*
    function GuardarIdsEspeciales(){

       var inp = document.getElementsByTagName('input');
        for(var i in inp){
        if(inp[i].type == "number"){
            if(inp[i].value <1){
                alert('Campos Vacios');
                inp[i].focus();
                return;
            }         
          }
        }

        for(var i in inp){
        if(inp[i].type == "number"){
          var tipoact = document.getElementById('txt'+  inp[i].name +'_').value;
          firebase.database().ref('pase_de_lista/' + sede +  '/' + camposelec  +  "/" + inp[i].value).set(tipoact); 
          firebase.database().ref('asignacion_empleados_campo/' + sede +  '/' + temporadaactual +"/" + camposelec  +  "/" + inp[i].name + "/IDExterno").set(inp[i].value); 
          }
        }
        alert('Guardados');
        location.reload(true);
    }
    */