"use strict";
$(document).ready(function(){


	var sede ="";
	var useremail = "";
    var emailsinarroba ="";
    firebase.auth().onAuthStateChanged(function (user) {
        useremail = user.email;
        emailsinarroba  =  useremail.substr(0,useremail.indexOf("@"));

        var informacionusuario = firebase.database().ref('usuarios/' + emailsinarroba  ); 
        informacionusuario.once('value',function(data){
            sede = data.val().sede;
			var temporada = firebase.database().ref('temporadas_sedes/' + sede +"/Temporada_Actual/" );
			temporada.on('value',function(data){
				cajaTempo.setAttribute("value",data.val());            
		    });          

        });

    });


    var cajaTempo = document.getElementById("temp");
    
    var btnAddCampo = document.getElementById("btn_addcamp");
    btnAddCampo.addEventListener("click",addCampo,false);
    
    function addCampo(){
        var NomCampo=document.getElementById("addcamp");
        var NomTemp = document.getElementById("temp");
        var TipoDeCampo = "";
        
          $("input[type=radio]:checked").each(function(){
            TipoDeCampo = ($(this).val());
            //alert("sede" + sede);
          });


        if(NomCampo.value.length < 3){
            alert("Nombre del Campo obligatorio");
            return;
        }
        else{

        //var temporada_campo = new Object();
 	    //temporada_campo[NomCampo.value] = TipoDeCampo; //TipoDeCampo es boleano, NomCampo es el nombre del nueveo campo 
 	  	// firebase.database().ref('/temporada_campo/' + cajaTempo.value + '/').set(temporada_campo); //cajatempo es la temporada 

 	   	  firebase.database().ref('/temporada_campo/' + cajaTempo.value + '/' + NomCampo.value).set(TipoDeCampo);
    
        	  alert("insertado");
        	  return;

        	  /*

      	    var updates = {};

			updates['/temporada_campo/' + cajaTempo.value + '/'] = temporada_campo;
		    if(updates != null){
		        alert('Registrado');
		       return firebase.database().ref().child(updates);   
		    }
		    else{
		        alert('Error al Registrar');
		    }

		    */

        	///////

        	/*

            var RefTemCampo = firebase.database().ref("temporada_campo").child(NomTemp.value);
            RefTemCampo.push(NomCampo.value);
            alert("Campo Registrado");
            formReset();
            function formReset()
            {
                document.getElementById("AddCampo").reset();
            }

*/
            //var formu = document.getElementById("AddCampo").reset();
            /*var post = {
            Temporada: NomCampo.value};

            console.log(RefTemCampo);
            var updates = {};
            updates['/temporada_campo/' + RefTemCampo] = post;
            if(updates != null){
                alert('Registrado');
                return firebase.database().ref().child().update(updates);
            }*/
        }    
    }
});
    

    

    