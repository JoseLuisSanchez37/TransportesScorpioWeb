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
                CargarEmpleados();
            });            
        });
    });

 });

 var sede ="";
 var temporadaactual ="";

    var arrarempleadosdata= new Array();
    function CargarPDF()
    {
     var columns = ["CURP","Nombre","Apellido Paterno","Apellido Materno","Lugar Nacimiento"];
     var doc = new jsPDF('p', 'pt');
     var logo = new Image();
     logo.src = 'ui/img/horizontalmarcaagua.jpg'.trim();
     doc.addImage(logo, 'JPEG', 140, 15,310,40);
     doc.setFontSize(14);
     doc.setFontStyle('bold');
     doc.text(250, 70, 'Listado De Bajas' );
     doc.autoTable(columns, arrarempleadosdata, {styles: {fontSize: 9}, margin: {top:85}  } );     
     doc.save('ListaEmpleadosBajas.pdf');   
    }

    function CargarEmpleados()
    {
        var IdsEmpleados = new Array();
        var numconsecutivo =1; 
        var refbajas = firebase.database().ref('bajas/' + sede + '/' + temporadaactual + '/'); 
        refbajas.on('child_added',function(dataBajas){
            var filaempleado = '<tr>' + 
                '<td>' + numconsecutivo + '</td>' +
                '<td>' + dataBajas.key +'</td>'+
                '<td>' + dataBajas.val().Nombre +'</td>'+
                '<td>' + dataBajas.val().Apellido_Paterno +'</td>' +
                '<td>' + dataBajas.val().Apellido_Materno +'</td>' +
                '<td>' + dataBajas.val().Lugar_Nacimiento +'</td>' +
                '<td>' + 
                '<button type="button" value="'+ dataBajas.key +'" onclick="MostrarPDF(value)" class="waves-effect waves-light btn light-blue darken-2 ">Ver Documento</button>' +
                '</td>' +
                '</tr>';
            var btn = document.createElement("TR");
            btn.innerHTML=filaempleado;
            document.getElementById("bodylistadoempleados").appendChild(btn);           
            var value = [dataBajas.key,dataBajas.val().Nombre ,dataBajas.val().Apellido_Paterno ,dataBajas.val().Apellido_Materno ,dataBajas.val().Lugar_Nacimiento ];
            arrarempleadosdata.push(value);
            numconsecutivo = numconsecutivo + 1;
        });
    }

    function MostrarPDF(curpRecibida)
    {
        var storage = firebase.storage();
        var starsRef = storage.ref('DocumentosBajas/' + curpRecibida + '.pdf');
        starsRef.getDownloadURL().then(function(url) {
        window.open(url);
        }).catch(function(error) {
          switch (error.code) {
            case 'storage/object_not_found':
            // File doesn't exist
            break;
            case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
            case 'storage/canceled':
            // User canceled the upload
            break;
            case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            break;
            }
        });
    }

   