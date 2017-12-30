window.onload = function () {
    escucha();
};
function escucha()
{
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
        var es_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if(es_firefox){
            window.location = 'index.html'; 
        }
        else
        {
            alert('El Sistema Unicamente Es Compatible Con Firefox');
        }
    }
    });
}
//Login
function login() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
        alert('Ingresa tu correo electronico.');
        return;
    }
    if (password.length < 4) {
        alert('Ingresa tu contraseña.');
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(confirmationResult){
        var es_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if(es_firefox){
            window.location = 'index.html'; 
        }
        else
        {
            alert('El Sistema Unicamente Es Compatible Con Firefox');
        }
    })
    .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            alert('Contraseña no valida.');
        } else {
            alert('Opps ocurrio lo siguiente: ' + errorMessage);
        }
    });
}

 var config = {
    apiKey: "AIzaSyBNEXuoem6yNWknaQieXsJPSF2rksBMyCg",
    authDomain: "admin-personal.firebaseapp.com",
    databaseURL: "https://admin-personal.firebaseio.com",
    projectId: "admin-personal",
    storageBucket: "admin-personal.appspot.com",
    messagingSenderId: "401180139931"
  };
  firebase.initializeApp(config);

document.getElementById('logear').addEventListener('click', login, false);