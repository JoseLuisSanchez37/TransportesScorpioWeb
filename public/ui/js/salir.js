"use strict";

function CerrarSesion()
{
	firebase.auth().signOut().then(function() {
		console.log('Sesion Cerrada')
	}).catch(function(error) {
  		alert('Ocurrio Un Error Al Cerrar Sesion');
	});
}


