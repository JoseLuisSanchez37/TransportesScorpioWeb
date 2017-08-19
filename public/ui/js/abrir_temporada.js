"use strict";

$(document).ready(function(){

    var useremail = "";
    var emailsinarroba ="";
    firebase.auth().onAuthStateChanged(function (user) {
        useremail = user.email;
        emailsinarroba  =  useremail.substr(0,useremail.indexOf("@"));

        var informacionusuario = firebase.database().ref('usuarios/' + emailsinarroba  ); 
        informacionusuario.once('value',function(data){
            //alert(data.val().sede);
            CrearCajasSueldoSedes(data.val().sede);
            sede = data.val().sede;
        });
    });


    
 });


 var sede ="";

var arrayperfiles = [];
function CrearCajasSueldoSedes(nombresede){
        arrayperfiles = [];
        var ConcatCajasPerfil='<strong>Sueldos De '+nombresede+':</strong>';        
        var perfiltrabajadores = firebase.database().ref('perfilTrabajadores/');
        perfiltrabajadores.on('child_added',function(data){
            var NombrePerfil = data.val();
            arrayperfiles.push(NombrePerfil);
            ConcatCajasPerfil += '<div class="row"> <div class="input-field col s4"> <input type="number"  name="'+NombrePerfil+'" id="txt'+nombresede +'_'+NombrePerfil+'" class="validate" > <label>Sueldo '+ NombrePerfil +':</label> </div> </div>'
            document.getElementById('CajasTextoSalario').innerHTML =ConcatCajasPerfil;
        });
    }

    document.getElementById('btn_temporada').addEventListener('click',RegistrarTemporada);

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

  
    //esto ya estaba programado

/*
var temporada = document.getElementById('temporada'); 

function abrirTemporada() {
    if (temporada.value.length < 3)
    {
        alert('Temporada obligatorio');
        return;
    }    
    var post = {
        Temporada: temporada.value
    };

    var resultado = firebase.database().ref('temporada').push().key;
    console.log(resultado);
    var updates = {};
    updates['/temporada/' + resultado] = post;
    
    if(updates != null){
        alert('Registrado');
         temporada.value="";
        return firebase.database().ref().update(updates); 
        
    }
    else{
        alert('Error al Registrar');
    }
    
}

//document.getElementById('btn_temporada').addEventListener('click', abrirTemporada,false);

window.onload = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var database = firebase.database();
            console.log(database);
        }
    });   
}; */