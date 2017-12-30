"use strict";

$(document).ready(function(){
    
    document.getElementById('datepickerInicio').value = "";
    document.getElementById('datepickerFin').value = "";

   
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
                    //concatcampos += '<input type="hidden" id="radio'+numcamion+'_" value="'+fecha+'">';
                    document.getElementById('Campos').innerHTML = concatcampos;
                    CargaPrimero();
                });

            });            
        });
    });

 });



    //teniendo el campo traer todos los empleados del campo y guardarlos en un array 

    function CargaPrimero()
    {
        var nomcampo = "";
        $("input[name=groupCampos]:checked").each(function(){
        nomcampo = ($(this).val());
        });
        var reffechasasistencia = firebase.database().ref('asistencias/' + sede + '/' + nomcampo + '/'); 
        reffechasasistencia.limitToFirst(1).on('child_added',function(datafechas){
            InicializarDatePicker(datafechas.key);
        });
    }

    function InicializarDatePicker(fechamin)
    {
        var fechapedazos = fechamin.split('-');
        var fechacompleta = fechapedazos[2] +'/'+ fechapedazos[1] + '/' + fechapedazos[0];
        //dia mes año
        var fechaminima = new Date(fechapedazos[0],fechapedazos[1],fechapedazos[2]);
        
        var obtenerfechamaxima = sumaFecha(90,fechacompleta);
        var fechamaximapedazos = obtenerfechamaxima.split('-');
        var fechamaxima = new Date(fechamaximapedazos[0],fechamaximapedazos[1]-1,fechamaximapedazos[2]);
        
        //min: fechaminima,
        //min: fechaminima,


        $('#datepickerInicio').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 1, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        max: fechamaxima,
        formatSubmit: 'yyyy/mm/dd',
        format: 'd mmmm, yyyy',
        closeOnSelect: true // Close upon selecting a date,
        });
        
        $('#datepickerFin').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 1, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        max: fechamaxima,
        formatSubmit: 'yyyy/mm/dd',
        format: 'd mmmm, yyyy',
        closeOnSelect: false // Close upon selecting a date,
        });   
    }


    var sede ="";
    var temporadaactual ="";


    document.getElementById('btn_cargarListas').addEventListener('click',CargarAsistencias);

    function CargarAsistencias()
    {
        if ( $.fn.dataTable.isDataTable( '#tbl_asistencias' ) ) {
        var  table = $('#tbl_asistencias').DataTable();
        var rows = table
        .rows()
        .remove()
        .draw();
        table.destroy();
        }

        var tbl_asistencias = $('#tbl_asistencias').DataTable({
        processing:true,
        "searching": false,
        "language": {
        "processing": "Cargando...",
        "url":"//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
        }
        });

        var IdsEmpleados = new Array();

        var nomcampo = "";
        $("input[name=groupCampos]:checked").each(function(){
        nomcampo = ($(this).val());
        });    

        document.getElementById('nombrecampo').innerHTML = "Campo " + nomcampo;

        var fecharec1 = document.getElementById('datepickerInicio').value;
        var datefechainicio = new Date(fecharec1);
        datefechainicio.setDate(datefechainicio.getDate()-1);
        var fecharec2 = document.getElementById('datepickerFin').value;
        var datefechafinal = new Date(fecharec2);

        //var testfechainicio = '2017-8-26';
        //var datefechainicio = new Date(testfechainicio);
        //datefechainicio.setDate(datefechainicio.getDate()+1);
        
        
        //var testfechafinal = '2017-8-27';
        //var datefechafinal = new Date(testfechafinal);
        //datefechafinal.setDate(datefechafinal.getDate()+1);

        

        var totalasistencias = 0;
        var fechaasistencia = "";
        var reffechasasistencia = firebase.database().ref('asistencias/' + sede + '/' + nomcampo + '/'); 
        reffechasasistencia.on('child_added',function(datafechas){
            fechaasistencia = datafechas.key;
            var fecharecibida = new Date(fechaasistencia);
            var validafecha = fecharecibida;
            //validafecha.setDate(validafecha.getDate() + 1);
            if(validafecha >= datefechainicio  && validafecha <=  datefechafinal)
            {
                totalasistencias = 0;
                var reffechasasistencia = firebase.database().ref('asistencias/' + sede + '/' + nomcampo + '/' + fechaasistencia + '/'); 
                reffechasasistencia.on('child_added',function(datafechasidsempleados){
                    totalasistencias = totalasistencias + 1;
                });
                var value = [fechaasistencia,totalasistencias];  
                tbl_asistencias.rows.add([value]).draw();
            }
        });

        //var value = [idempleado, dataidsempleados.val().Nombre, dataidsempleados.val().Apellido_Paterno,dataidsempleados.val().Apellido_Materno,totalasistencias, fecha, fechafinal];
        //tbl_trabajador.rows.add([value]).draw();    
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

  
   