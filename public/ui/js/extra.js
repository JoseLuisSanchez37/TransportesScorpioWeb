  // var frame = document.getElementById('frame_empl');
//$("#frame_empl").contents().find("#btn_nuevotrabajador");
  //frames.frame_empl.document.getElementById('btn_nuevotrabajador').innerHTML;
      //var porId=window.frames["frame_empl"].document.getElementById("btn_nuevotrabajador");
    //var porElementos=window.frames["frame_empl"].document.forms["empl"];

    /*
  var employers=[];
    
    var RefSAL;
    var RefSalidas = firebase.database().ref("salidas");
    RefSalidas.on("child_added",function(valor){
        var Refsalidas = firebase.database().ref("salidas").child(valor.key);
        vari1=valor.key;
        Refsalidas.on("child_added",function(valor2){
            RefSAL = firebase.database().ref("salidas"+'/'+valor.key+'/'+valor2.key);
            vari2=valor2.key;
            
            var userId="7";
            var pos=0;
            RefSAL.once("value", function(snapshot) {
                snapshot.forEach(function(child) {
                    
                        employers[pos]=child.val();
            pos++;
                    });
                });                  
           });
                
      });*/
   
       // });
  
        
       /*   var userId="7";
  checkIfUserExists(userId);




function userExistsCallback(userId, exists) {
  if (exists) {
    alert('user ' + userId + ' exists!');
  } else {
    alert('user ' + userId + ' does not exist!');
  }
}

// Tests to see if /users/<userId> has any data. 
function checkIfUserExists(userId) {
 
  RefSAL2.child(userId).once('value', function(data) {
     
    
    var exists = (data.val() !== null);
      
    userExistsCallback(userId, exists);
  });
}   */    
                  
/* var btn = document.empl.btn_nuevotrabajador.value;
    btn.addEventListener("click",mostrar,false);
    function mostrar(){
        alert("hola");
    }
    */
    
    