"use strict";
var UserCurrent = null; 
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBNEXuoem6yNWknaQieXsJPSF2rksBMyCg",
    authDomain: "admin-personal.firebaseapp.com",
    databaseURL: "https://admin-personal.firebaseio.com",
    projectId: "admin-personal",
    storageBucket: "admin-personal.appspot.com",
    messagingSenderId: "401180139931"
  };
  firebase.initializeApp(config);


function initApp() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
        console.log(user)
        } else {
            window.location = 'login.html';
        }
    });
}

window.onload = function () {
    initApp();
};
$(document).ready(function(){
    $(".dropdown-button").dropdown();
    $(".button-collapse").sideNav();
})

