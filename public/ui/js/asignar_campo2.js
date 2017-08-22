"use strict";
$(document).ready(function () {

    var database = firebase.database();
    var referencia = database.ref("salidas");
    var i = 0;


    var ID_Empleado = 1;
    var RefAsigEmpCampo = firebase.database().ref("asignacion_empleados_campo");
    RefAsigEmpCampo.on("child_added", function (dato) {
        var RefAsigEmpCampo2 = firebase.database().ref("asignacion_empleados_campo").child(dato.key);
        RefAsigEmpCampo2.on("child_added", function (dato2) {
            var RefAsigEmpCampo3 = firebase.database().ref("asignacion_empleados_campo").child(dato.key).child(dato2.key);
            RefAsigEmpCampo3.on("child_added", function (dato3) {
                ID_Empleado++;
            });
        });
    });


    var camionConFecha = [];

    var cargarCamiones = function() {
        referencia.on("child_added", function (data) {
            camionConFecha = [];

            var Camiones;
            var ref = firebase.database().ref("salidas").child(data.key);

            ref.on("child_added", function (datos) {

                camionConFecha.push({ 'idCamion': datos.key, "fecha": data.key });



                Camiones = '<div name="sel" class="row"><div class="col-md-3 ">';
                Camiones += ' <input type="checkbox"  id="check' + i + '"  name="cami[]" value="' + datos.key + '" />';
                Camiones += ' <label for="check' + i + '">' + datos.key + '</label></div>';

                i++;
                $(Camiones).appendTo('#listado');

            });
        });
        referencia.on("child_removed", function (data) {
            //falta remover las asalidas asignadas a un campo
            //location.reload();
        });
    };
    cargarCamiones();


    // var btnaddempl = $('iframe[name=frame_empleado]').contents().find('#btn_nuevotrabajador');//.val();
    //btnaddempl.addEventListener("click",lista);

    var refTemCampo = firebase.database().ref("temporada_campo").orderByKey().limitToLast(1);
    var incre = 1;
    var campos;
    refTemCampo.on("child_added", function (valor) {
        var Ref = firebase.database().ref("temporada_campo").child(valor.key);
        Ref.on("child_added", function (datosT) {
            campos = '<option value="' + datosT.key + '">' + datosT.key + '</option>';
            incre++;
            $(campos).appendTo('#campos');
        });

        $(document).ready(function () {
            $('select').material_select();
        });
    });

    var checkboxes = document.getElementById("camion_espera");
    var AsignarCampo = document.getElementById("btn_asignar");
    AsignarCampo.addEventListener("click", AddCampo, false);
    var Select = document.getElementById("campos");
    //var salir = firebase.database().ref('asignacion_empleados_campo');
    function AddCampo() {




        if (Select.value.length <= 0) {
            alert('Campo obligatorio');
            return;
        }
        var checkBoxesIds = [];
        for (var e = 0; e < checkboxes.length; e++) {
            if (checkboxes[e].checked) {
                checkBoxesIds.push(checkboxes[e].value);
            }
        }
        asignarCampoEmpleado(Select.value, checkBoxesIds);
        return;
        var Clave = [];
        var t = 0;
        var Referencia = firebase.database().ref("salidas");
        Referencia.on("child_added", function (data) {
            var Referen = firebase.database().ref("salidas").child(data.key);
            Referen.on("child_added", function (data2) {
                var REF = firebase.database().ref("salidas").child(data.key).child(data2.key);
                REF.on("child_added", function (data3) {
                    Clave[t] = data3.key;
                    t++;
                    console.log(Clave);
                });
            });
        });








        var re = firebase.database().ref("temporada_campo").orderByKey().limitToLast(1);
        re.on("child_added", function (data) {
            var n = 0;
            var ElimCamion = [];
            var i = 0;
            for (var e = 0; e < checkboxes.length; e++) {

                if (checkboxes[e].checked) {

                    var Referencia = firebase.database().ref("salidas");
                    Referencia.on("child_added", function (data2) {

                        var Referen = firebase.database().ref("salidas").child(data2.key);

                        Referen.on("child_added", function (dta) {

                            if (checkboxes[e].value == dta.key) {

                                var Ref = firebase.database().ref("salidas").child(data2.key).child(dta.key);
                                Ref.on("child_added", function (datos) {

                                    var pushid = datos.key;


                                    var RefEmpleados = firebase.database().ref("empleados").child(pushid);

                                    RefEmpleados.update({ ID: ID_Empleado });

                                    var RefInser = firebase.database().ref("asignacion_empleados_campo").child(data.key).child(Select.value);//.child(NomCampo.value);
                                    var empl_id = {};
                                    empl_id[pushid] = { ID: ID_Empleado };
                                    RefInser.update(empl_id);
                                    var RefNodeID = firebase.database().ref("Asignacion_ID");
                                    RefNodeID.update(empl_id);
                                    ElimCamion[e] = checkboxes[e].value;
                                    var eliminacion = {};
                                    eliminacion[ElimCamion[e]] = { id: null };
                                    //var RefEmpleados= firebase.database().ref("empleados").child(pushid);
                                    //RefEmpleados.on("child_added",function(emple){
                                    //  var refe_empleados = firebase.database().ref("empleados").child(pushid);

                                    //      RefEmpleados.update({ID:ID_Empleado});
                                    //});

                                    var refSalidasCopia = firebase.database().ref("salidas/" + data2.key).child(dta.key);
                                    refSalidasCopia.remove();
                                    i++;

                                    //}
                                });





                            }

                        });
                    });
                }
                else {
                    n++;
                }
            }
            if (n == checkboxes.length) {
                alert("Seleccione una opcion");
            }
            else {
                alert("Salida Registrada");
                formReset();
                function formReset() {
                    //document.getElementById("form_camion_espera").reset();
                    window.location.reload();
                    //parent.document.getElementById("frame_asig_camion").contentWindow.location.reload();
                    //$("#listado div.row").remove();
                }
            }

        });
    }

    var useremail = "";
    var emailsinarroba = "";
    var obtenerSedeDeUsuarioLogueado = function (callback) {
        firebase.auth().onAuthStateChanged(function (user) {
            useremail = user.email;
            emailsinarroba = useremail.substr(0, useremail.indexOf("@"));
            var informacionusuario = firebase.database().ref('usuarios/' + emailsinarroba);
            informacionusuario.once('value', function (data) {
                if (callback) callback(data.val().sede);
                //sede = data.val().sede;

            });

        });
    };
    var obtenerTemporadaPorSede = function (sede, callback) {
        var refTemporadaSedes = firebase.database().ref("temporadas_sedes/" + sede);
        refTemporadaSedes.on("child_added", function (data) {
            if (callback) callback(data.val());
        });
    };
    var obtenerCampoPorTemporada = function (temporada, callback) {
        var refCompoPorTem = firebase.database().ref("temporada_campo/" + temporada);
        refCompoPorTem.on("child_added",
            function (data) {
                if (callback) callback(data.key);
                //console.log(data.val(), data.key);
            });
    };
    var elminarEmpleadoPorPushId = function (id) {
        var refSalidasCopia = firebase.database().ref("empleados/" + id);
        refSalidasCopia.remove();
    };

    var eliminarCamion = function (camion) {
        console.debug(camion, "salidas/" + camion.fecha + "/" + camion.idCamion);
        var refSalidasCopia = firebase.database().ref("salidas/" + camion.fecha + "/" + camion.idCamion);
        refSalidasCopia.remove();

        //var refSalidasCopia = firebase.database().ref("salidas");

        //refSalidasCopia.once("value",
        //    function(data) {
        //        //console.debug(data.val(),data.key);
        //        var nodoFecha = Object.keys(data.val());
        //        nodoFecha.forEach(function(d) {
        //            console.debug(d);
        //            var refSalidasCopia2 = firebase.database().ref("salidas/" + d + "/" + camion + "/" + empleado);
        //            refSalidasCopia2.remove();
        //        });


        //        // refSalidasCopia2.remove();

        //    });

    };


    var obtenerEmpleadosPorPushId = function (pushIds, callback) {
        console.log(pushIds, "pushIds");
        for (var key in pushIds) {

            var referEmpleado = firebase.database().ref("empleados/" + key);
            referEmpleado.once("value").then(function (data) {
                console.log(data.val(), data.key);
                var o = {};
                o = data.val();
                o.pushId = data.key;
                if (callback) callback(o);
            });

        }
    };
    var obtenerIdsDeEmpleadosPorCamion = function (idCamion, callback) {
        var refSalidas = firebase.database().ref('salidas');
        refSalidas.on("child_added", function (data) {
            data.forEach(function (data) {
                if (idCamion === data.key) {
                    if (callback) callback(data.val());
                    var camion = camionConFecha.find(c=>c.idCamion == idCamion);
                    eliminarCamion(camion);
                    //console.log("The Key", data.key, " Val ", data.val());
                }

            });
        });
    };

    var obtenerIndice = function (callback) {
        var referIndice = firebase.database().ref('index');
        referIndice.once("value", function (data) {
            if (callback) callback(data.val());
        });
    };

    var actualizarIndice = function (indice) {
        var refIndice = firebase.database().ref("index");
        refIndice.set(indice);
    };

    var asignarCampoEmpleado = function (camposaAsignar, idsCamiones) {
        var nodo = "Test/";//Cambiar por el nodo real que es asignacion_empleados_campo



        obtenerSedeDeUsuarioLogueado(function (sede) {
            nodo = nodo + sede;
            obtenerTemporadaPorSede(sede, function (temporada) {
                nodo = nodo + "/" + temporada + "/" + camposaAsignar;

                var referenciaEmpleadoAsignado = firebase.database().ref(nodo);
                obtenerIndice(function (indice) {
                    for (var j = 0; j < idsCamiones.length; j++) {
                        obtenerIdsDeEmpleadosPorCamion(idsCamiones[j], function (objectIds) {
                            //console.log(objectIds,'keys');
                            obtenerEmpleadosPorPushId(objectIds, function (empleadoAsignados) {
                                //console.log(empleadoAsignados, "empleadoAsignados");
                                indice++;

                                empleadoAsignados.campos = {};
                                empleadoAsignados.sede = sede;
                                empleadoAsignados.campos[camposaAsignar] = true;
                                referenciaEmpleadoAsignado.child(indice).set(empleadoAsignados, function (error) {
                                    if (!error) {
                                        actualizarIndice(indice);
                                        elminarEmpleadoPorPushId(empleadoAsignados.pushId);
                                    } else {
                                        alert("Data could not be saved." + error);
                                    }
                                });
                            });
                        });
                    }
                });
            });

        });
    };
});
