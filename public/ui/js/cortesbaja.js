"use strict";

$(document).ready(function(){
    document.getElementById('btnTerminarContrato').disabled = true;
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
                ObtenerEmpleadosBaja()
            });            
        });
    });  

});

function GuardarDocumento(IdRecibido,curpRecibida)
{
  const file = document.querySelector('#' + IdRecibido).files[0];
  var storageRef = firebase.storage().ref('DocumentosBajas/' + curpRecibida + ".pdf");
  storageRef.put(file); 
  console.log('Archivo Guardado: ' + curpRecibida);
}

function ObtenerEmpleadosBaja()
{
   var refcampos = firebase.database().ref('bajas_pendientes/' + sede ); 
   refcampos.on('child_added',function(datacampos){
       var campo = datacampos.key;
      var refIds = firebase.database().ref('bajas_pendientes/' + sede + '/' + campo); 
      refIds.on('child_added',function(dataIds){
        var idsistema = dataIds.key;
        var motivobaja =  dataIds.val().motivo;
        var observacionesbaja = dataIds.val().observaciones;
        console.log(idsistema + motivobaja + observacionesbaja);

        var refDatosEmpleado = firebase.database().ref('asignacion_empleados_campo/' + sede  + '/' + temporadaactual + '/' + campo + '/' + idsistema); 
        refDatosEmpleado.once('value',function(datosEmp){ 
          var idbuscar = datosEmp.key;
          var idnormal = datosEmp.key;

            try {
              if(datosEmp.val().IDExterno.trim() != 'undefined')
              {
              idbuscar = datosEmp.val().IDExterno;
             }
            }catch(err) {}

          var totalasistencias= 0;
          var totalgiros = 0;
          var totalprestamos = 0;
          var totaldiastrabajados = 0;

          var refprestamos = firebase.database().ref('registros_trabajadores/' + sede  + '/' + campo + '/' + idbuscar + '/prestamos/'); 
          refprestamos.on('child_added',function(dataprestamos){
            totalprestamos =  totalprestamos +  parseInt(dataprestamos.val());
          });
          var refgiros = firebase.database().ref('registros_trabajadores/' + sede  + '/' + campo + '/' + idbuscar + '/giros/'); 
          refgiros.on('child_added',function(datagiros){
            totalgiros =  totalgiros + parseInt(datagiros.val());
          });
          var refasistencias = firebase.database().ref('registros_trabajadores/' + sede  + '/' + campo + '/' + idbuscar + '/asistencias/'); 
          refasistencias.on('child_added',function(dataasistencias){
            var pago = parseInt(salarios[dataasistencias.val()]);
            totalasistencias =  totalasistencias + pago;
            totaldiastrabajados = totaldiastrabajados + 1;
          }); 

          var refasistencias = firebase.database().ref('temporada/' + temporadaactual + '/salarios/').limitToFirst(1); 
          refasistencias.on('child_added',function(dataasistencias){
            var nomcompleto = datosEmp.val().Nombre + ' ' + datosEmp.val().Apellido_Paterno + ' ' + datosEmp.val().Apellido_Materno ; 
            var totalapagar = totalasistencias - (totalgiros + totalprestamos);
            var fechasalida = datosEmp.val().Fecha_Salida;
            var fechapedazos = fechasalida.split('-');
            var fechacompleta = fechapedazos[2] +'/'+ fechapedazos[1] + '/' + fechapedazos[0];
            var fechainicio = sumaFecha(2,fechacompleta);
            var fechafinal = sumaFecha(92,fechacompleta);
            var filaempleado = '<tr>' + 
            '<td><input type="checkbox" onchange="SeleccionarParaRenovar(value);" name="cheksterminar" value="' + idbuscar + '" id="checkbox' + idbuscar +  '_"/> <label for="checkbox' + idbuscar + '_"></label></td>' +
            '<td><input type="checkbox" disabled=true  name="cheksrenovados" id="chkren_' + idbuscar +  '_"/> <label for="chkren_' + idbuscar + '_"></label></td>' +
            '<td>' + idbuscar +'</td>' +
            '<td>' + datosEmp.val().CURP +'</td>' +
            '<td>'+nomcompleto+'</td>' +
            '<td>' + fechainicio + '</td>' +
            '<td>'+totaldiastrabajados+'</td>' + 
            '<td>$'+totalasistencias+'</td>' + 
            '<td>$'+totalgiros+'</td>' + 
            '<td>$'+totalprestamos+'</td>' + 
            '<td>$'+totalapagar+'</td>' + 
            '<td>'+ motivobaja +'</td>' + 
            '<td>'+ observacionesbaja +'</td>' + 
            '<td>' +
            '<input type="file" id="BtnArchivo_' + idbuscar +  '_" disabled=true onchange="GuardarDocumento(id,name);" name="' + datosEmp.val().CURP+ '" accept=".pdf"   class="waves-effect waves-light btn">' +
            '</td>' + 
            '</tr>';
            var btn = document.createElement("TR");
            btn.innerHTML=filaempleado;
            document.getElementById("bodylistadoempleados").appendChild(btn);           
            var value = [idbuscar, datosEmp.val().CURP, nomcompleto, fechainicio, fechafinal, totaldiastrabajados, "$ " +  totalasistencias, "$ " + totalgiros, "$ " + totalprestamos, "$ " + totalapagar];
            arrempleadostabla.push(value);
            var valuetermino = [idbuscar, datosEmp.val().pushId,datosEmp.val().CURP, datosEmp.val().Apellido_Materno, datosEmp.val().Apellido_Paterno, datosEmp.val().CURP, datosEmp.val().Fecha_Nacimiento, datosEmp.val().Fecha_Salida, datosEmp.val().Lugar_Nacimiento, datosEmp.val().Nombre, fechainicio, fechafinal, totaldiastrabajados,idnormal,campo,motivobaja,observacionesbaja];
            arraydatostermino.push(valuetermino); //esteeeee
            }); 
          });
      });
   });
}



function ObtenerSalarios()
{
    var refsalarios = firebase.database().ref('temporada/' + temporadaactual + '/salarios/'); 
    refsalarios.on('child_added',function(datasalarios){
        salarios[datasalarios.key] = datasalarios.val();
    });
}

function SeleccionarParaRenovar(idbusqueda)
{
    var cheboxseleccionado = document.getElementById('checkbox' + idbusqueda +  '_').checked;
    $('#chkren_' + idbusqueda +  '_').attr("checked", false);
    if(cheboxseleccionado)
    {
        $('#chkren_' + idbusqueda +  '_').attr("disabled", false);
        $('#BtnArchivo_' + idbusqueda +  '_').attr("disabled",false);
    }
    else
    {
        $('#chkren_' + idbusqueda +  '_').attr("disabled", true);
        $('#BtnArchivo_' + idbusqueda +  '_').attr("disabled",true)
    }
}

function ImprimirListado()
{
    document.getElementById('btnTerminarContrato').disabled = false;
    var filas = new Array();
    var inp = document.getElementsByTagName('input');
    var contador = 0;
    for(var i in inp){
        if(inp[i].type == "checkbox")
        {
            inp[i].disabled = true;
        }

        if(inp[i].type == "checkbox" && inp[i].name == "cheksterminar" )
        {
            if( inp[i].checked == true )
            {       
                filas.push(arrempleadostabla[contador]); 
                arrayterminocontrato.push(arraydatostermino[contador]);   
                var checkboxrenovara = document.getElementById('chkren_' + inp[i].value +  '_').checked;
                if(checkboxrenovara)
                {
                    idempladosrenuevan.push(arraydatostermino[contador]);
                }
            }
            contador ++;
        }
    }

    var columns = ["Numero de control","CURP","Nombre completo","Fecha llegada","Fecha termino","Dias trabajados","total","Giros","Prestamos","Total a pagar"];
    var doc = new jsPDF('1', 'mm',[612,  1008]);
    var logo = new Image();
    logo.src = 'ui/img/horizontalmarcaagua.jpg'.trim();
    doc.addImage(logo, 'JPEG', 200, 10,210,30);
    doc.setFontSize(16);
    doc.setFontStyle('bold');
    doc.text(270, 50, 'Listado de empleados baja');
    var fechas = new Date();
    var fechagenerado = (fechas.getFullYear() + "-" + (fechas.getMonth() +1) + "-" + fechas.getDate())
    doc.text(270, 60,'Generado: ' + fechagenerado);
    doc.autoTable(columns, filas ,{styles: {fontSize: 12}, margin : {top: 70}});
    doc.save('ListaEmpleadosBaja.pdf');    
}

var idempladosrenuevan = new Array();
var arrayterminocontrato = new Array();
var arraydatostermino = new Array();


function terminarcontrato(dato)
{
    var eliminardeasistenciaas = "";
    var confirmterminocontrato=confirm("¿Desea Dar De Baja, Se Eliminaran todos los datos?");
    if (confirmterminocontrato)
    {
      var updates = {};
      var updates2 = {};
      var updatesHistorialBajas = {};
      for (var x=0; x<arrayterminocontrato.length; x++)
      {

       var curp = arrayterminocontrato[x][5];
        var post = {
        Apellido_Materno: arrayterminocontrato[x][3],
        Apellido_Paterno: arrayterminocontrato[x][4],
        CURP: arrayterminocontrato[x][5], 
        Fecha_Nacimiento: arrayterminocontrato[x][6],
        Fecha_Salida: arrayterminocontrato[x][7],
        Lugar_Nacimiento: arrayterminocontrato[x][8],
        Nombre: arrayterminocontrato[x][9],};

        var datos = {
          Apellido_Materno: arrayterminocontrato[x][3],
          Apellido_Paterno: arrayterminocontrato[x][4],
          Nombre: arrayterminocontrato[x][9],
          Lugar_Nacimiento: arrayterminocontrato[x][8],
        };

        updatesHistorialBajas['/bajas/' + sede  + '/' +  temporadaactual + '/' +  curp ] = datos;
        updates2['/contratos/' + sede  + '/' + arrayterminocontrato[x][2] + '/' +  temporadaactual + '/' +  arrayterminocontrato[x][10] + '_' +  arrayterminocontrato[x][11]  ] = arrayterminocontrato[x][12] ;
        updates['/contratos/' + sede  + '/' + arrayterminocontrato[x][2] ] = post ;
            
        var campoeliminacion = arrayterminocontrato[x][14];
        var idasisgnasistema = arrayterminocontrato[x][13];
        var refempleadoeliminarOMod = 'asignacion_empleados_campo/' + sede + '/' + temporadaactual + '/' + campoeliminacion + '/' + idasisgnasistema + '/';
            

        for(var y=0; y<idempladosrenuevan.length; y++)
          {
            if(idempladosrenuevan[y][13] == arrayterminocontrato[x][13])
            {
              var updatesListaNegra = {};
              var postListaNegra = {
                Apellido_Materno: arrayterminocontrato[x][3],
                Apellido_Paterno: arrayterminocontrato[x][4],
                CURP: arrayterminocontrato[x][5], //poner el push id en lugar de curp 
                Fecha_Nacimiento: arrayterminocontrato[x][6],
                Lugar_Nacimiento: arrayterminocontrato[x][8],
                Nombre: arrayterminocontrato[x][9],
                Motivo: arrayterminocontrato[x][15] , 
                Observaciones: arrayterminocontrato[x][16], 
              };
              updatesListaNegra['/lista_negra/' + arrayterminocontrato[x][2] ] = postListaNegra;
              firebase.database().ref().update(updatesListaNegra);
            }

            if(y==idempladosrenuevan.length)
              {
                var eliminarasignacioncampo = firebase.database().ref('asignacion_empleados_campo/' + sede + '/' + temporadaactual + '/' + arrayterminocontrato[x][14] + '/' + arrayterminocontrato[x][13] ).remove();
                console.log(eliminarasignacioncampo);
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
                //alert(reffechastrabajadas);
          });
          var refeliminarpaselista = firebase.database().ref('pase_de_lista/' +   sede + '/' +  arrayterminocontrato[x][14] + '/' + arrayterminocontrato[x][0]).remove();
          var refeliminarregistrostrabajadores = firebase.database().ref('registros_trabajadores/' + sede + '/' +  arrayterminocontrato[x][14] + '/' + arrayterminocontrato[x][0]).remove(); 
          var refElimBaja =  firebase.database().ref('bajas_pendientes/' + sede + '/' + campoeliminacion + '/' + idasisgnasistema).remove();
    }

        firebase.database().ref().update(updatesHistorialBajas); 
        firebase.database().ref().update(updates); 
        firebase.database().ref().update(updates2); 
        alert('Bajas Realizadas');
        location.reload(true);
}
}

var sede="";
var  temporadaactual ="";
var salarios = [];
var arrempleadostabla = new Array();

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