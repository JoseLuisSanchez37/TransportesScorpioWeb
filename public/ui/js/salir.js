"use strict";

document.getElementById('salir').addEventListener('click', function () {
    event.preventDefault();
    firebase.auth().signOut();
}, false);
document.getElementById('salir2').addEventListener('click', function () {
    event.preventDefault();
    firebase.auth().signOut();
}, false);