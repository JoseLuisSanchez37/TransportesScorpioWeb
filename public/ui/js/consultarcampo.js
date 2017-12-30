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
                var concatcampos ="";
                var refcampos = firebase.database().ref('temporada_campo/' + temporadaactual + '/'); 
                refcampos.on('child_added',function(datacampos){
                    var nombrecampo = datacampos.key;
                    concatcampos +='<input name="groupCampos" type="radio" id="radio'+ nombrecampo+'_" checked="checked" value="'+nombrecampo+'"/> <label for="radio'+nombrecampo+'_">'+nombrecampo+'</label>'
                    document.getElementById('Campos').innerHTML = concatcampos;
                });

            });            
        });
    });
        CargaPrimero();
 });

    function CargaPrimero()
    {
        var IdsEmpleados = new Array();
        var nomcampo = "";
        $("input[name=groupCampos]:checked").each(function(){
        nomcampo = ($(this).val());
        });    
        var refidsempleados = firebase.database().ref('asignacion_empleados_campo/' + sede + '/' + temporadaactual + '/' + nomcampo + '/'); 
        refidsempleados.on('child_added',function(dataidsempleados){
            var idempleado = dataidsempleados.key;
            var reffechasasistencia = firebase.database().ref('asistencias/' + sede + '/' + nomcampo + '/'); 
            reffechasasistencia.on('child_added',function(datafechas){
                var fechaasistencia = datafechas.key;
                var reffechasasistencia = firebase.database().ref('asistencias/' + sede + '/' + nomcampo + '/' + fechaasistencia + '/'); 
                reffechasasistencia.on('child_added',function(datafechasidsempleados){
                });                
            });
        });
    }

 var sede ="";
 var temporadaactual ="";

    document.getElementById('btn_cargarListas').addEventListener('click',CargarEmpleados);

    function CargarEmpleados()
    {
        var IdsEmpleados = new Array();
        var nomcampo = "";
        $("input[name=groupCampos]:checked").each(function(){
        nomcampo = ($(this).val());
        });    

        document.getElementById('nombrecampo').innerHTML = "Campo " + nomcampo;

        var refidsempleados = firebase.database().ref('asignacion_empleados_campo/' + sede + '/' + temporadaactual + '/' + nomcampo + '/'); 
        refidsempleados.on('child_added',function(dataidsempleados){
            var idempleado = dataidsempleados.val().IDExterno
            var totalasistencias = 0;
            var contfecha = 0;
            var fecha="No ha asistido";
            var reffechasasistencia = firebase.database().ref('asistencias/' + sede + '/' + nomcampo + '/'); 
            reffechasasistencia.on('child_added',function(datafechas){
                var fechaasistencia = datafechas.key;
                var reffechasasistencia = firebase.database().ref('asistencias/' + sede + '/' + nomcampo + '/' + fechaasistencia + '/'); 
                reffechasasistencia.on('child_added',function(datafechasidsempleados){
                    if(datafechasidsempleados.key == idempleado)
                    {
                        if(contfecha == 0)
                        {
                            fecha = fechaasistencia;
                        }
                        contfecha = 1;
                        totalasistencias = totalasistencias + 1;
                    }
                });                
            });
            var fechafinal = 'N/A';
            if(fecha != 'No ha asistido')
            {
                var fechapedazos = fecha.split('-');
                var fechacompleta = fechapedazos[2] +'/'+ fechapedazos[1] + '/' + fechapedazos[0];
                fechafinal = sumaFecha(90,fechacompleta);
            }    

            var value = [idempleado, dataidsempleados.val().Nombre, dataidsempleados.val().Apellido_Paterno,dataidsempleados.val().Apellido_Materno,totalasistencias, fecha, fechafinal];
            console.log('Insertando...');

            var filaempleado = '<tr>' + 
                       '<td>' + idempleado +'</td>' +
                       '<td>' + dataidsempleados.val().Nombre +'</td>' +
                       '<td>' + dataidsempleados.val().Apellido_Paterno +'</td>' +
                       '<td>' + dataidsempleados.val().Apellido_Materno +'</td>' +
                       '<td>' + totalasistencias +'</td>' +
                       '<td>' + fecha +'</td>' +
                       '<td>' + fechafinal +'</td>' + 
                       '</tr>';
                       var btn = document.createElement("TR");
                       btn.innerHTML=filaempleado;
                       document.getElementById("bodylistadoempleados").appendChild(btn);
        });
    }

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


     /*
    function RegistrarTemporada(){

       var inp = document.getElementsByTagName('input');
        for(var i in inp){
        if(inp[i].type == "text" || inp[i].type == "number"){
            if(inp[i].value <1){
                alert('Campos Vacios');
                inp[i].focus();
                return;
            }         
        }
        }

       
        var nombreTemporada = document.getElementById('temporada').value;
    

        var salarios =new Object();
        
                for(var x=0; x<arrayperfiles.length; x++){
                    var dato = document.getElementById('txt' + sede + '_' + arrayperfiles[x]).value;
                    //alert("Lugar: " +  sedes[i] + "  Perfil: " + arrayperfiles[x] + "  Sueldo: " + dato);
                    var perfil=arrayperfiles[x];
                    salarios[perfil] = dato;
                } 


    var temporada = document.getElementById('temporada'); 

    var post = {
    Temporada: temporada.value,
    salarios,
    sede
    };

    
   // var resultado = firebase.database().ref('temporada').push().key;
    //console.log(resultado);
    var updates = {};
    var updates2 = {};


    var temporadaobject = new Object();

    temporadaobject['Temporada_Actual'] = temporada.value;

    updates2['/temporadas_sedes/' + sede +'/' ] = temporadaobject;

    updates['/temporada/' + temporada.value] = post ;
    if(updates != null){
        alert('Registrado');
         temporada.value="";
         firebase.database().ref().update(updates2);    
         firebase.database().ref().update(updates); 
        location.reload(true);

         //limpiar la caja de texto =

     return ;   
    }
    else{
        alert('Error al Registrar');
    }

    }

    */

  
   