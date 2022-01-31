const wres_meras = [
"I",
"II",
"III",
"IV",
"V",
"VI",
"VII",
"VIII",
"IX",
"X",
"XI",
"XII",
"XIII",
"XIV",
"XV",
"XVI",
"XVII",
"XVIII",
"XIX",
"XX",
"XXI",
"XXII",
"XXIII",
"XXIV"
];
var map = "";
var pos_center = "";
var greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
var redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
var orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

$('#sform').submit(function (e) {
     var dtransfered = "";
     var usrestimation = "";
     e.preventDefault();
     var val = document.getElementById("usrsearch").value;
     if(val){//an yparxei timh entos tu search bar
       var mmsg = {message : val};
       console.log(mmsg.message);//emfoliasmos ?
     const post_ajax = $.ajax({
       url: 'http://localhost:8080/usrpointers',
       data: JSON.stringify(mmsg),//to kanw stringify
       type: 'POST',
       processData: false,
       timeout:3000, //3 second timeout
       headers: {
          "Access-Control-Allow-Origin" : "*"
      },
       success: function (data, stat,xhr) {
         console.log('Success: ' + data);
       },
       error: function (xhr, status, error) {
         console.log('Error: ' + error.message);
         $('#lblResponse').html('Error connecting to the server.');
       }
     });//prwto ajax
     post_ajax.done(function (){
       $.ajax({
       url: 'http://localhost:8080/usrpointers',
       data: JSON.stringify(mmsg),
       type: 'GET',
       processData: false,
       headers: {
          "Access-Control-Allow-Origin" : "*"
      },
       success: function (data, stat,xhr) {
         console.log('Success: ' + data);
         dtransfered = JSON.parse(data);//pairnw data se morfh json
         usrestimation = dtransfered.message2;
         dtransfered = dtransfered.message1;
         dtransfered=JSON.parse(dtransfered);
       },
       error: function (xhr, status, error) {
         console.log('Error: ' + error.message);
         $('#lblResponse').html('Error connecting to the server.');
       }
     });//2o ajax
   });
     $(document).ajaxComplete(function () {
       var inRange = [], latlng_a = new L.LatLng(pos_center[0],pos_center[1]), latlng_b;
       for(d in dtransfered){
         latlng_b = new L.LatLng(dtransfered[d].lat ,dtransfered[d].lon);
        // if ( (latlng_a.distanceTo(latlng_b)/1000).toFixed(0) < 5000) {
           inRange.push(dtransfered[d]);
        // }
       }
       dtransfered = inRange;
       console.log("egine");
       for(d in dtransfered){
         //console.log(dtransfered[d].i);
         var b = [dtransfered[d].i,dtransfered[d].ii,dtransfered[d].iii
         ,dtransfered[d].iv,dtransfered[d].v,dtransfered[d].vi,
         dtransfered[d].vii,dtransfered[d].viii,dtransfered[d].ix,
         dtransfered[d].x,dtransfered[d].xi,
         dtransfered[d].xii,dtransfered[d].xiii,dtransfered[d].xiv,
         dtransfered[d].xv,dtransfered[d].xvi,dtransfered[d].xvii,
         dtransfered[d].xviii,dtransfered[d].xix,dtransfered[d].xx,
         dtransfered[d].xxi,dtransfered[d].xxii,dtransfered[d].xxiii,dtransfered[d].xxiv];
         //pairnw sum
         var sum = 0;
         for(i in b){
           sum+=parseInt(i);
         }
         //console.log(sum);
         sum =( parseInt(b[hour-1])/sum )*100;
         var hour = new Date().getHours();
         //console.log(sum);
         var marker;
         if(sum > 66){
           marker = L.marker([dtransfered[d].lat,dtransfered[d].lon], {icon: redIcon}).addTo(map)
           .bindPopup(dtransfered[d].name+'\n'+dtransfered[d].address+'\n'+"Estimation : "+b[hour-1]+"\nhour : "+hour+"\nEstimation : "+b[hour]+"\nhour : "+(parseInt(hour)+1)+"\nEstimation : "+b[hour+1]+"\nhour : "+(parseInt(hour)+2) +"\n User Estimation : " + usrestimation )
           .openPopup();
         }else if (sum > 65) {
           marker = L.marker([dtransfered[d].lat,dtransfered[d].lon], {icon: orangeIcon}).addTo(map)
           .bindPopup(dtransfered[d].name+'\n'+dtransfered[d].address+'\n'+"Estimation : "+b[hour-1]+"\nhour : "+hour+"\nEstimation : "+b[hour]+"\nhour : "+(parseInt(hour)+1)+"\nEstimation : "+b[hour+1]+"\nhour : "+(parseInt(hour)+2 )+"\n User Estimation : " + usrestimation )
           .openPopup();
         }else {
           marker = L.marker([dtransfered[d].lat,dtransfered[d].lon], {icon: greenIcon}).addTo(map)
           .bindPopup(dtransfered[d].name+'\n'+dtransfered[d].address+'\n'+"Estimation : "+b[hour-1]+"\nhour : "+hour+"\nEstimation : "+b[hour]+"\nhour : "+(parseInt(hour)+1)+"\nEstimation : "+b[hour+1]+"\nhour : "+(parseInt(hour)+2)+"\n User Estimation : " + usrestimation )
           .openPopup();
         }
       }
     });
     //topo8ethsh se selida
     $.ajax({
       async: false,
       url: this.href,
       success: function (result) {
         console.log('success');
       },
       error: function (xhr, ajax, err) {
         console.error('error: ' + JSON.stringify(xhr));
         console.error(JSON.stringify(err));
       }
     });
   }
   return false;
 });
 //vriskw topo8esia
 function getLocation() {
   if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(retPos,showError);
   }
 }
 //epistrefw 8esh
 function retPos(pos) {
   var mmsg = {mssg : ['zirdas', pos.coords.latitude, pos.coords.longitude]};
   //var mmsg = "";
   $.ajax({
     url: 'http://localhost:8080/userloc',
     data: JSON.stringify(mmsg),
     type: 'POST',
     processData: false,
     headers: {
        "Access-Control-Allow-Origin" : "*"
    },
     success: function (data, stat,xhr) {
       console.log('Success: ' + data);
       dtransfered = JSON.parse(data);//pairnw data se morfh json
       console.log(dtransfered);
       for(i in dtransfered.tret){
         const episkepseis = document.getElementById('episkepseis');
         // creating the span element, then add a class attribute
         var kappa = dtransfered.tret[i].name.split(' ');//to prwto akronhmio einai to id
         const btt = document.createElement(kappa[0]);
         btt.setAttribute('class','btn btn-light col-md-4');//ti eidous button
         btt.style.marginRight="5px";
         btt.style.width= "25%";
         btt.innerHTML = dtransfered.tret[i].name; // some text to improve visualization
         btt.addEventListener('click', clickPoint, true);
         btt.myParam = dtransfered.tret[i].name;
         episkepseis.appendChild(btt);
       }//vazw koumbia
       alert("Βρίσκεστε σε κάποιο σημείο ;");
     },
     error: function (xhr, status, error) {
       console.log('Error: ' + error.message);
       $('#lblResponse').html('Error connecting to the server.');
     }
   });//ajax gia na vazw lat lon
   map = L.map('map',{minZoom:13.25}).setView([pos.coords.latitude,pos.coords.longitude], 18);
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
   }).addTo(map);
   pos_center = [pos.coords.latitude, pos.coords.longitude];
   //var points = [
   //  [pos_center[0]+(0.00461 * 5), pos_center[1]] ,[pos_center[0],pos_center[1]+(0.00981*5)] ,
   //  [pos_center[0]-(0.00461 * 5), pos_center[1]] ,[pos_center[0],pos_center[1]-(0.00981*5)]
   //];
   //let polygon = L.polygon(points).addTo(map);
   let ex = L.circle(pos_center,5000).addTo(map);
   //diastaseis shmeiwn mou :
   //38.25424  (0.00461), 21.73744(0.00981) *2.5
   //38.25886, 21.74725
   // apokliseis pos.coords.latitude - 0.00103, pos.coords.longitude - 0.00721
   L.marker([pos.coords.latitude, pos.coords.longitude]).addTo(map)
   .bindPopup('You Are Here !')
   .openPopup();
 }
 //an yparksei error
 function showError(error) {
   switch(error.code) {
     case error.PERMISSION_DENIED:
       alert("User denied the request for Geolocation.");
       break;
     case error.POSITION_UNAVAILABLE:
       alert("Location information is unavailable.");
       break;
     case error.TIMEOUT:
       alert("The request to get user location timed out.");
       break;
     case error.UNKNOWN_ERROR:
       alert("An unknown error occurred.");
       break;
     }
   }

   $('#krousmaform').submit(function (e) {
        var dtransfered = "";
        e.preventDefault();
        var datval = document.getElementById("krousmadate").value;
        var timval = document.getElementById("krousmatime").value;
        if( timval == "" && datval == ""){
          alert("Δεν έχετε βάλει ώρα ή ημέρα.")
        }else{
          //epikoinwnia me webserver
          console.log(datval + " " + timval);
          var usrname = document.getElementById('exw_username').innerHTML;
          console.log(usrname);
          usrname = usrname.split(' ');
          var mmsg = {mssg : [usrname[2], 1, datval + " " + timval]};
          //var mmsg = "";
          $.ajax({
            url: 'http://localhost:8080/userkrousma',
            data: JSON.stringify(mmsg),
            type: 'POST',
            processData: false,
            headers: {
               "Access-Control-Allow-Origin" : "*"
           },
            success: function (data, stat,xhr) {
              console.log('Success: ' + data);
              dtransfered = JSON.parse(data);//pairnw data se morfh json
              alert(dtransfered);
            },
            error: function (xhr, status, error) {
              console.log('Error: ' + error.message);
              $('#lblResponse').html('Error connecting to the server.');
            }
          });//ajax gia na vazw timestamp gia krousma
        }
      });
//se poio point eimai
function clickPoint(ev){
  console.log(ev.currentTarget.myParam);
  var usrname = document.getElementById('exw_username').innerHTML;
  usrname = usrname.split(' ');
  var mmsg = {msg : [usrname[2], ev.currentTarget.myParam]};
  $.ajax({
    url: 'http://localhost:8080/usermeros',
    data: JSON.stringify(mmsg),
    type: 'POST',
    processData: false,
    headers: {
      "Access-Control-Allow-Origin" : "*"
    },
    success: function (data, stat,xhr) {
      console.log('Success: ' + data);
      dtransfered = JSON.parse(data);//pairnw data se morfh json
      console.log(dtransfered);
    },
    error: function (xhr, status, error) {
      console.log('Error: ' + error.message);
      $('#lblResponse').html('Error connecting to the server.');
    }
  });//ajax gia na vazw pou eimai
  const myNode = document.getElementById("episkepseis");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.lastChild);
  }//vgazw ola ta merh pou mporei na eimai
  // koumpi gia ektimhsh
  const btt = document.createElement("ektimish");
  btt.setAttribute('class','btn btn-light col-md-4');//ti eidous button
  btt.innerHTML = 'Εκτίμηση'; // some text to improve visualization
  btt.style.marginRight="5px";
  var today = new Date();
  console.log("ginetai");
  var date = today.getFullYear()+'-'+ConvertNumberToTwoDigitString(today.getMonth()+1)+'-'+ConvertNumberToTwoDigitString(today.getDate());
  var time = ConvertNumberToTwoDigitString(today.getHours()) + ":" + ConvertNumberToTwoDigitString(today.getMinutes());
  btt.myParam = date+ ' ' + time;//etsi mporw na anagnwrisw to visit entos ths vashs(username ke timestamp)
  btt.addEventListener('click', clickEktimish, true);
  //btt.addEventListener('click', clickPoint, true);
  //input ektimhshs
  const inp = document.createElement("input");
  inp.setAttribute('type',"text");//gia input
  inp.setAttribute('id',"ektimhsh_input");//gia input
  inp.setAttribute('class','form-control col-md-4 input');//ti eidous input
  inp.style.width = '50px';
  inp.setAttribute('placeholder','Εκτίμηση');//ti eidous input
  //ta vazw
  myNode.appendChild(btt);
  myNode.appendChild(inp);
}
//se poio point eimai
//ektimhsh apo user
function clickEktimish(ev){
  console.log(ev.currentTarget.myParam);
  if( isNaN( parseInt(document.getElementById("ektimhsh_input").value) )){//an den einai int mhn synexeis
    alert("Η Εκτίμηση είναι ακέραιος αριθμός.");
  }else{
    var usrname = document.getElementById('exw_username').innerHTML;
    usrname = usrname.split(' ');
    var mmsg = {msg : [usrname[2], document.getElementById("ektimhsh_input").value ,ev.currentTarget.myParam]};
    $.ajax({
      url: 'http://localhost:8080/userektimhsh',
      data: JSON.stringify(mmsg),
      type: 'POST',
      processData: false,
      headers: {
        "Access-Control-Allow-Origin" : "*"
      },
      success: function (data, stat,xhr) {
        console.log('Success: ' + data);
        dtransfered = JSON.parse(data);//pairnw data se morfh json
        console.log(dtransfered);
      },
      error: function (xhr, status, error) {
        console.log('Error: ' + error.message);
        $('#lblResponse').html('Error connecting to the server.');
      }
    });//ajax gia na vazw pou eimai
    const myNode = document.getElementById("episkepseis");
    while (myNode.firstChild) {
      myNode.removeChild(myNode.lastChild);
    }//vgazw ola ta merh pou mporei na eimai
  }//telos else
}//telos ektimhshs

function ConvertNumberToTwoDigitString(n) {
  return n > 9 ? "" + n : "0" + n;
}

//to storage me info gia user
$( document).ready(function() {
  console.log( "ready!" );
  alert(localStorage.getItem("storageName"));
  const usinfo = document.getElementById('user_info');
  // creating the span element, then add a class attribute
  var kappa = JSON.parse(localStorage.getItem("storageName"));//to prwto akronhmio einai to id
  const btt = document.createElement("usrinfo");
  btt.setAttribute('id','exw_username');
  btt.innerHTML =  "Username : "+kappa.username + " E-mail : " + kappa.email ; // some text to improve visualization
  usinfo.appendChild(btt);
});
//to storage me info gia user

$('#nav-profile-tab').on('click', function (e) {
  var dtransfered = "";
  var mvisits , mkrousma;
  e.preventDefault();
  var usrname = document.getElementById('exw_username').innerHTML;
  console.log(usrname[2]);
  usrname = usrname.split(' ');
  mmsg = {name: usrname[2]};

  post_ajax = $.ajax({
    url: 'http://localhost:8080/uservisitcontent',
    data: JSON.stringify(mmsg),
    type: 'POST',
    processData: false,
    headers: {
      "Access-Control-Allow-Origin" : "*"
    },
    success: function (data, stat,xhr) {
      console.log('Success: ' + data);
      dtransfered = JSON.parse(data);//pairnw data se morfh json
      console.log(dtransfered);
      mvisits = dtransfered.message1;
      mkrousma = dtransfered.message2;
    },
    error: function (xhr, status, error) {
      console.log('Error: ' + error.message);
      $('#lblResponse').html('Error connecting to the server.');
    }
  });//ajax gia na pairnw info gia visits
  post_ajax.done( function (){
    for(i in mvisits){
      console.log(new Date(mvisits[i].tm).toISOString().replace("T", " ").slice(0, 19));
      console.log("edw");
      $("<tr><td>" + i + "</td><td>" +  mvisits[i].pname + "</td><td>" +  mvisits[i].num_of_people + "</td><td>" + new Date(mvisits[i].tm).toISOString().replace("T", " ").slice(0, 19)+ "</td></tr>").appendTo("#myvisits");
    }
    for(i in mkrousma){
      console.log(new Date(mkrousma[i].pote).toISOString().replace("T", " ").slice(0, 19));
      console.log("edw");
      $("<tr><td>" + i + "</td><td>" +  mkrousma[i].username + "</td><td>" + new Date(mkrousma[i].pote).toISOString().replace("T", " ").slice(0, 19)+ "</td></tr>").appendTo("#mykrousma");
    }
  });
  $(this).tab('show');
})//telos gia nav tab

   function username_corr(){
     var p = document.getElementById("username").value,errors = [];;

     if(p.length > 7){//apla panw apo 7 grammata,ola epitrepontai
       return true;
     }else{
       errors.push("Username must be further that 7 digits.");
       alert(errors.join("\n"));
       return false;
     }
   }


   function email_corr(){
     var p = document.getElementById("email").value,errors = [];
     console.log(p.includes(".com"));
     if (p.search(/[@]/) > 0 && p.includes(".com")) {
       return true;
     }else{
       errors.push("Your email is wrong.");
       alert(errors.join("\n"));
       return false;
     }
   }

   function password_corr() {
       var p = document.getElementById("password").value,
           errors = [];
       if (p.length < 8) {
           errors.push("Your password must be at least 8 characters");
       }
       if (p.search(/[A-Z]/i) < 0) {
           errors.push("Your password must contain at least one letter.");
       }
       if (p.search(/[0-9]/) < 0) {
           errors.push("Your password must contain at least one digit.");
       }
       if (p.search(/[!@#$%^&*]/) < 0) {
           errors.push("Your password must contain at least one symbol.");
       }
       if (errors.length > 0) {
           alert(errors.join("\n"));
           return false;
       }
       return true;
       /*var regularExpression = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;
       return regularExpression.test(str);*/
   }

$('#new_username').on('click',async function (e) {
  e.preventDefault();
  var mmsg = {
    current_username : "zirdas",
    username : "",
    password : "",
    email : ""
  };

  if (username_corr()) {
    //ayto prepei na phgainei eite se admin eite se user
    mmsg.username = document.getElementById("username").value;
  }//endif
  if (password_corr()) {
    mmsg.password=document.getElementById("password").value;
  }
  if(email_corr()){
    mmsg.email = document.getElementById("email").value;
  }
  console.log(mmsg);
       $.ajax({
         url: 'http://localhost:8080/userchange',
         data: JSON.stringify(mmsg),
         type: 'POST',
         processData: false,
         headers: {
           "Access-Control-Allow-Origin" : "*"
         },
         success: function (data, stat,xhr) {
           console.log('success' + data);
           data = JSON.parse(data);
           if(data.mssg){
           console.log("done");
           }else{
             console.log(data.error)
             if(data.merror == "password"){
               alert("Λάθος password.");
             }else{
               alert("Λάθος username η e-mail.\nΉ νέα εγγραφή.");
             }
           }
         },
         error: function (xhr, ajax, err) {
           console.error('error: ' + JSON.stringify(xhr));
           console.error(JSON.stringify(err));
         }
       });//end ajax
});

   getLocation();
