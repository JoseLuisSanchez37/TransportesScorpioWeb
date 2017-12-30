"use strict";
$(document).ready(function () {

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
                CargarLlenadoCampos();
            });            
        });
    });

        var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
        var Camiones;

		var refFechasSalidas = firebase.database().ref('salidas/'); //Llenado de los camiones en base a las salidas 
		refFechasSalidas.on("child_added", function (dataFechasSalidas) { 
			var fechasalida = dataFechasSalidas.key;
            var fechapedazos = fechasalida.split('-');
            var mes = fechapedazos[1];
            var ano = fechapedazos[0];
            var dia = fechapedazos[2];

			var refCamiones = firebase.database().ref('salidas/' + fechasalida );
 			refCamiones.on("child_added", function (dataCamiones) {
 				var numcamion = dataCamiones.key;

                camionConFecha.push({ 'idCamion': numcamion , "fecha": fechasalida });
                Camiones = '<div name="sel" class="row"><div class="col-md-3 ">';
                Camiones += ' <input type="checkbox"  id="check' + numcamion + '" name="' + fechasalida + '"  value="' + numcamion + '" />';
                Camiones += ' <label for="check' + numcamion + '">' + numcamion + '</label></div>';
                Camiones += ' <label for="check' + numcamion + '"> Salida: ' +  dia + ' de ' + meses[parseInt(mes) -1 ]  + ' del ' + ano + '</label></div>';
                $(Camiones).appendTo('#listado');
 			
 			});
		});
});

	function CargarLlenadoCampos() //llenado del combo de campos 
	{
        var campos ="";
		var refCampo = firebase.database().ref("temporada_campo/" + temporadaactual );
        refCampo.on("child_added", function (dataResponse) {
        	camposEsEspecial.push({campo: dataResponse.key,esEspecial : dataResponse.val()});
            campos = '<option value="' + dataResponse.key + '">' + dataResponse.key + '</option>';
            $(campos).appendTo('#campos');
            $(document).ready(function () {
                $('select').material_select();
            });
        });
	}

	var camposEsEspecial = new Array(); //vs 
	var camionConFecha = new Array(); //vs
	var temporadaactual = "";
	var sede = ""; 
    var AsignarCampo = document.getElementById("btn_asignar");
    AsignarCampo.addEventListener("click", AsignarTrabajadorACampo, false);
    var indicebd;

	function AsignarTrabajadorACampo()
	{
		var campo= "";
		var boolEsEspecial = false; //aqui recibir parametros del arrar o de innner
		var CamionDondeProviene=0;
        var checkboxes = document.getElementById("camion_espera");
        var Select = document.getElementById("campos");

        if (Select.value.length <= 0) {
        alert('Campo obligatorio');
            return;
        }
        var ListadoRefPushidremover = new Array();
        var datosdelosempleados = new Array();
        var pushidsasignar = new Array();
        var checkBoxesIds = [];
        var camposeleccionado = Select.value;
        
        var referIndice = firebase.database().ref('index'); //obtiene el indice actual
        referIndice.once("value", function (dataIndice) {
            indicebd = dataIndice.val();
            console.log(indicebd);
        });

        for (var e = 0; e < checkboxes.length; e++) {
            if (checkboxes[e].checked) { //traer unicamente los checkbox seleccionados
                checkBoxesIds.push(checkboxes[e].value);

                var fechasalidaYCamion = checkboxes[e].name + '/' +  checkboxes[e].value;
                var camion = checkboxes[e].value;
                var fechasalidacamion = checkboxes[e].name;

                var RefObtenerPushIds = firebase.database().ref('salidas/' + fechasalidaYCamion); 
                RefObtenerPushIds.on('child_added',function(dataPushIds){
                    var pushidtraido = dataPushIds.key;
                    var RefDatosEmpleado = firebase.database().ref('empleados/' + pushidtraido);
                    RefDatosEmpleado.once('value',function(dataDatosEmpleado){
                        indicebd = indicebd + 1;
                        var updates = {};
                        var updates2 = {};
                        var post = {
                            Actividad: dataDatosEmpleado.val().Actividad,
                            Apellido_Materno: dataDatosEmpleado.val().Apellido_Materno,
                            Apellido_Paterno: dataDatosEmpleado.val().Apellido_Paterno,
                            CURP: dataDatosEmpleado.val().CURP,
                            Camion: camion,
                            Contrato: dataDatosEmpleado.val().Contrato,
                            Enganche: dataDatosEmpleado.val().Enganche,
                            Fecha_Nacimiento: dataDatosEmpleado.val().Fecha_Nacimiento,
                            Fecha_Salida: dataDatosEmpleado.val().Fecha_Salida,
                            Lugar_Nacimiento: dataDatosEmpleado.val().Lugar_Nacimiento,
                            Nombre: dataDatosEmpleado.val().Nombre,
                            pushId: pushidtraido,
                            sede: sede
                        };
                        updates2['/asignacion_empleados_campo/' + sede  + '/' + temporadaactual + '/' + camposeleccionado + '/' + indicebd + '/campos/' + camposeleccionado] = true; //Insertar el arreglo de campos
                        updates['/asignacion_empleados_campo/' + sede  + '/' + temporadaactual + '/' + camposeleccionado + '/' + indicebd] = post ; //insertar los datos del empleado
                        firebase.database().ref().update(updates);
                        firebase.database().ref().update(updates2);
                        EliminarPushId(pushidtraido); //eliminar del nodo empleados por push id
                    });
                });
                
                var refOperar = firebase.database().ref('salidasCopia/' + fechasalidaYCamion).limitToFirst(1);
                refOperar.on('child_added',function(dataOper){
                    //
                    actualizarIndice(indicebd);
                    RefObtenerPushIds.remove(); //eliminar la salida del camion 
                    console.log('Termino camion...' + camion);
                });
            }
        }
        alert('Asignacion Realizada');
        location.reload(true);
	}

    var actualizarIndice = function (indice) {
        var refIndice = firebase.database().ref("index");
        refIndice.set(indice);
    };

    function ActualizarIndex(numero) //acctualizar el index
    {
        var updates = {};
        updates['index'] = numero;
        firebase.database().ref().update(updates);
    }

    function EliminarPushId(pushidtraido)
    {
        firebase.database().ref('empleados/' + pushidtraido).remove();   
    }

