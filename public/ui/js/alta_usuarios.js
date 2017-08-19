"use strict";

$(document).ready(function(){
  var ConcatRadios ='';
  var sedes = firebase.database().ref('sedes/');
    sedes.on('child_added', function (data) {
        var NombreSede = [data.val()];
        ConcatRadios +='<input name="groupsedes" type="radio" value="'+NombreSede+'" id="radio'+NombreSede+'" checked="checked" /> <label for="radio'+NombreSede+'">'+NombreSede+'</label>' 
        document.getElementById('radiosSedes').innerHTML = ConcatRadios;
    });

 });


//var starCountRef = firebase.database().ref('posts/' + postId + '/starCount');
//starCountRef.on('value', function(snapshot) {
 // updateStarCount(postElement, snapshot.val());
//});

    function LimpiarChexbox()
    {
        document.getElementById('CheckBoxCampos').innerHTML = "";
    }
    function CrearChexboxCampos()
    {
        var radiobtn = document.getElementById('encargadocampo').checked;

        var sedeselect ="";
        $("input[name=groupsedes]:checked").each(function(){
            sedeselect = $(this).val();
        });

        var temporadaactual="";
        var temporada = firebase.database().ref('temporadas_sedes/' + sedeselect +'/Temporada_Actual');
            temporada.on('value',function(datarec){
            temporadaactual = datarec.val();
            
            var concatCheboxCampos="Campos A Su Cargo <br> ";
            var temporada = firebase.database().ref('temporada_campo/' + temporadaactual  );
            temporada.on('child_added',function(data){
                var nomcampo = data.key;
                concatCheboxCampos +='<input type="checkbox" name="checkboxcampos" value="'+nomcampo+'" id="checkbox'+nomcampo+'" /> <label for="checkbox'+nomcampo+'">'+nomcampo+'</label>' 
                document.getElementById('CheckBoxCampos').innerHTML = concatCheboxCampos;
            });


        });
    }

    document.getElementById('btn_usuarios').addEventListener('click',RegistrarTemporada);

    function RegistrarTemporada(){

       var inp = document.getElementsByTagName('input');
        for(var i in inp){
        if(inp[i].type == "text"){
            if(inp[i].value <1){
                alert('Campos Vacios');
                inp[i].focus();
                return;
            }         
        }
        }
        var sede = "";
          $("input[name=groupsedes]:checked").each(function(){
            sede = ($(this).val());
            //alert("sede" + sede);
          });

          var TipoUsuario ="";
          $("input[name=tipodeusuario]:checked").each(function(){
            TipoUsuario = ($(this).val());
            //alert("sede" + sede);
          });

        var Contrasena = document.getElementById('contrasenausuario');
        var Email = document.getElementById('usuariocorreo');
        var Nombre = document.getElementById('usuario');

        var EmailSinArroba = Email.value.substr(0, Email.value.indexOf("@"));

        firebase.auth().createUserWithEmailAndPassword(Email.value,Contrasena.value).catch(function(error) {
            alert('Ocurrio Un Error Al Crear Usuario' + error.code + "---" + error.message);
        });

/*
        var user = {
              email: Email.value,
              password: Contrasena.value
        };

        firebase.auth().ref().createUser(user,function(error){
            if(error){
                alert('Ocurrio un error al crear usuario ');
                return;
            }else{
                console.log('se creo el usario en users');
            }
        });
*/

        var updates = {};
    

        if(TipoUsuario == "Admin"){  
            var post = {
                contrasena: Contrasena.value,
                email: Email.value,
                nombre: Nombre.value,
                rol : TipoUsuario,
                sede: sede
            };
            updates['/usuarios/' + EmailSinArroba] = post ;
        }else{
            var objectcampos =  new Array();
              $("input[name=checkboxcampos]:checked").each(function(){
                objectcampos.push($(this).val());
                //alert("sede" + sede);
              });

            //recorrer los chexbos y llenar un object 
            var post2 = {
                campos : objectcampos,
                contrasena: Contrasena.value,
                email: Email.value,
                nombre: Nombre.value,
                rol : TipoUsuario,
                sede: sede
            };
            updates['/usuarios/' + EmailSinArroba] = post2 ;
            //guardara el post con los campos
        }


    
    
    if(updates != null){
        alert('Registrado');
        firebase.database().ref().update(updates); 
        location.reload(true);
    }
    else{
        alert('Error al Registrar');
    } 





/*
        var user = {
              email: Email.value,
              password: Contrasena.value
        };

        firebase.auth().ref().createUser(user,function(error){
            if(error){
                alert('Ocurrio un error al crear usuario ');
                return;
            }else{
                console.log('se creo el usario en users');
            }
        });

*/

    


}
