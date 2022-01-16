
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors')

var http = require('http');
var util = require('util');
var mysql = require('mysql');
const url = require('url');
var formidable = require('formidable');

var app = express();

var haversine = require("haversine-distance");

//Gia na pairnw ti mera einai
function td(){
  switch (new Date().getDay()) {
  case 0:
    return "Sunday";
  case 1:
    return "Monday";
  case 2:
     return "Tuesday";
  case 3:
    return "Wednesday";
  case 4:
    return "Thursday";
  case 5:
    return "Friday";
  case 6:
    return "Saturday";
}
}

// view engine setup
app.set('views', path.join(__dirname, '/'));
app.set('view engine', 'ejs');
//app.use(express.json());

app.use(cors({
    credentials: true,
    preflightContinue: true,
    methods: "GET, POST, PUT, PATCH , DELETE, OPTIONS",
    origin: true
}));


var admin_message = {msg : "Έγινε."};
app.all('/adminload',async function (req, res) {
  console.log('Request received: ');
  util.inspect(req) // this line helps you inspect the request so you can see whether the data is in the url (GET) or the req body (POST)
  util.log('Request recieved: \nmethod: ' + req.method + '\nurl: ' + req.url) // this line logs just the method and url
  if(req.method==='OPTIONS'){
          res.writeHead(200);
          res.end();
    }else if(req.method==='POST'){
      //h katallhlh kefalida
      res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
      });
      var body = [];
      //diavase data
      req.on("data", (chunk) => {
        body.push(chunk);
      });
      //otan exeis diavasei olo to data
      req.on("end",async () => {
        var mdata = Buffer.concat(body).toString();
        mdata = JSON.parse(mdata);//parsing json
        //dhmiourgia connection me vash
        const con = mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "Den8aKsexasw",
          database: "projectweb",
          multipleStatements: true
        });
        //shndesh me vash

        console.log("Connected");
        var busert = [];         //vazw ta panta mesa se lista
        //dict gia days
        var mdayz = {};
        //lista gia types
        var mtypes = {};
        for(k in mdata){
          //gia na vazw hmeres
          for(j in mdata[k].populartimes){
            if( !(mdata[k].populartimes[j].name in mdayz)){
              //console.log(mdata[0]);
              mdayz[mdata[k].populartimes[j].name]=[];
              mdayz[mdata[k].populartimes[j].name].push([mdata[k].id].concat(mdata[k].populartimes[j].data));
            }//an den einai valto
            else{
              mdayz[mdata[k].populartimes[j].name].push([mdata[k].id].concat(mdata[k].populartimes[j].data));
            }
          }//end for populartimes
          //prepei na parw ta types
          for(type in mdata[k].types){
            if( mdata[k].types[type] == "point_of_interest" ){
              continue;//ayto to table yparxei hdh ke einai axriasto ws type
            }
            if( !(mdata[k].types[type] in mtypes)){
              //console.log(mdata[0]);
              mtypes[mdata[k].types[type]]=[];
              mtypes[mdata[k].types[type]].push([mdata[k].id]);
            }//an den einai valto
            else{
              mtypes[mdata[k].types[type]].push([mdata[k].id]);
            }
          }
          busert.push([mdata[k].id,mdata[k].name,mdata[k].address,mdata[k].coordinates.lat,mdata[k].coordinates.lng,mdata[k].rating,mdata[k].rating_n]);
        }//end for proetoimasias
        const connection_ended = await con.connect(async function(err) {

          //vazw point of interest info (id name address lat lon rating rating_n)
          //mdata[...]...
          //const query = util.promisify(con.query).bind(con);
          var sunexeia = true;
          var mquery = "INSERT INTO point_of_interest(id,name,address,lat,lon,rating,rating_n) VALUES ?";

          const dup_error = await con.query(mquery,[busert], async function (err, result, fields) {
            if (err){
              admin_message = {msg : "Υπάρχει ήδη.\nΠήγαινε Ενημέρωση"};
              sunexeia = false;
            }
            //throw err;
            if(sunexeia){
              console.log(sunexeia);
              //vazw ka8e eidos
              for(tp in mtypes){
                con.query("create table if not exists "+tp+"(pointid varchar(30));", function (err, result, fields) {
                  if (err){
                    //throw err;
                  }
                });//telos query_1
                //vazw to sxetiko id
                var tload = mtypes[tp];
                var mquery = "INSERT INTO "+tp+"(pointid) VALUES ?";
                con.query(mquery,[tload] ,function (err, result, fields) {
                  if (err){
                    //throw err;
                  }
                });//telos query_2
              }//endfor
              // vazw ka8e eidos
              //vazw se hmeres
              for(d in mdayz){
                console.log("den mphke");
                var mquery = "INSERT INTO "+d+"(id,i,ii,iii,iv,v,vi,vii,viii,ix,x,xi,xii,xiii,xiv,xv,xvi,xvii,xviii,xix,xx,xxi,xxii,xxiii,xxiv) VALUES ?";
                con.query(mquery,[mdayz[d]], function (err, result, fields) {
                  if (err){
                    //throw err;
                  }
                });//telos query gia mia hmera
              }//vazw hmeres
            }//endifsunexeia
            res.write(JSON.stringify(admin_message));
            return res.end();//telos sundeshs
          });//telos query gia info
        });//telos connect
      });
    }
});
//gia na vazw pointers se map
//exw 3000toules
var mymessage = {message1 : [],message2 : []};
app.all('/usrpointers',async function (req, res) {
  util.inspect(req) // this line helps you inspect the request so you can see whether the data is in the url (GET) or the req body (POST)
  util.log('Request recieved: \nmethod: ' + req.method + '\nurl: ' + req.url) // this line logs just the method and url
  var info = "";
  var body = [];
  if(req.method==='OPTIONS'){
          res.writeHead(200);
          res.end();
  }else if(req.method==='POST'){//gia post
    //diavazw data
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    //otan exeis diavasei olo to data
    req.on("end",async () => {

      res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
        //"Keep-Alive" : "timeout=80"
      });
      //lets query db
      const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Den8aKsexasw",
        database: "projectweb",
        multipleStatements: true
      });
      console.log(req.url);
      info = Buffer.concat(body).toString();
      info = JSON.parse(info);//parsing json
      info = info.message;
      body = info;
    //  console.log("edw eimai");
    //  console.log(body);
      if(!(body=="")){
        const mconnect = await con.connect(async function(err) {
          console.log("Connected edw!");
          var mquery = "select point_of_interest.name,t2.*,point_of_interest.address,point_of_interest.lon,point_of_interest.lat,point_of_interest.rating,point_of_interest.rating_n from point_of_interest inner join ((select (pointid) from "+ body+") as t1 inner join (select * from "+td()+") as t2 on t2.id=t1.pointid )on t1.pointid=point_of_interest.id";
          con.query(mquery, function (err, result, fields) {
            if (err){
              throw err;
            }
            info = result;
            mymessage.message1 = JSON.stringify(result);
          });//telos query gia info
          console.log("edw eimai");

            body = [];
          for (let i = 0; i < 2; i++) {
            var today = new Date();
            var time = ConvertNumberToTwoDigitString(today.getHours()-i);
            console.log(info);
            for(j in info){
              var mquery = "select num_of_people from visit where ekt=1 and tm like \'%:"+ time +":%\' and pname like \'%"+info[j].name+"%\';";
              con.query(mquery, function (err, result, fields) {
                if (err){
                  throw err;
                }
                //console.log(result);
                for(j in result){
                  body.push(result[j].num_of_people);
                }
              });//telos query gia visit
            }
          }//endfor
          var sm = 0;
          //console.log("edw" + body.length);
          for(i in body){sm+=body[i];}
          mymessage.message2 = sm/body.length;
          done = true;
        });//telos connect
        res.end();

      }//an to info einai tpt mhn kanei tpt
    });
    res.on('error', (err) => {
      console.error(err);
    });
    //end post
  }else if (req.method==='GET') {
    res.write(JSON.stringify(mymessage));
    res.end();
    mymessage = {message1 : [],message2 : []};
  }//end get
});
//gia na vazw pointers

//gia na vazei o user location
app.all('/userloc',function (req, res) {
  console.log('Request received: ');
  util.inspect(req) // this line helps you inspect the request so you can see whether the data is in the url (GET) or the req body (POST)
  util.log('Request recieved: \nmethod: ' + req.method + '\nurl: ' + req.url) // this line logs just the method and url
  if(req.method==='OPTIONS'){
    res.writeHead(200);
    res.end();
  }else if(req.method==='POST'){
    var body = [];
    //h katallhlh kefalida
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
    });
    //diavase data
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    //otan exeis diavasei olo to data
    req.on("end", () => {
      var mdata = Buffer.concat(body).toString();
      mdata = JSON.parse(mdata);//parsing json
      mdata = mdata.mssg;
      //dhmiourgia connection me vash
      var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Den8aKsexasw",
        database: "projectweb",
        multipleStatements: true
      });
      //shndesh me vash
      con.connect(function(err) {
        console.log("Connected");
        //vazw se poio shmeio eimai lon ke lat
        var mquery = "UPDATE user SET lat="+mdata[1]+",lon="+mdata[2]+" WHERE username like \'%"+mdata[0]+"%\'";
        con.query(mquery, function (err, result, fields) {
          if (err){
            throw err;
          }
        });//telos query gia lon ke lat
        //eimai se shmeia endiaferontos?
        mquery = "SELECT name,lat,lon FROM point_of_interest ;";
        con.query(mquery, function (err, result, fields) {
          if (err){
            throw err;
          }
          var to_ret = [];
          var point1 = {lat : 38.2496651 ,lng : 21.7390541};
          for(i in result){
            var point2 = {lat : result[i].lat , lng : result[i].lon};//pairnw to 2o point
            var haversine_m = haversine(point1, point2); //metraw apostash
            //var haversine_km = haversine_m /1000; //Results in kilometers
            if(haversine_m < 20){
              console.log("sunevh");
              to_ret.push(result[i]);
            }
          }
          to_ret = {tret : to_ret};
          res.write(JSON.stringify(to_ret));//grafw result sto telos
          res.end();//end of response
        });//telos query gia lon ke lat
      });//telos connect
    });//req on end
  }//end if
});//gia na vazei o user location

    //gia na vazei o user krousma
    app.all('/userkrousma',function (req, res) {
      console.log('Request received: ');
      util.inspect(req) // this line helps you inspect the request so you can see whether the data is in the url (GET) or the req body (POST)
      util.log('Request recieved: \nmethod: ' + req.method + '\nurl: ' + req.url) // this line logs just the method and url
      if(req.method==='OPTIONS'){
              res.writeHead(200);
              res.end();
        }else if(req.method==='POST'){
          var body = [];
          var mmsg = {};
          //h katallhlh kefalida
          res.writeHead(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
          });
          //diavase data
          req.on("data", (chunk) => {
            console.log(chunk);
            body.push(chunk);
          });
          //otan exeis diavasei olo to data
          req.on("end", () => {
            var mdata = Buffer.concat(body).toString();
            mdata = JSON.parse(mdata);//parsing json
            mdata = mdata.mssg;
            console.log(mdata);
            //dhmiourgia connection me vash
            var con = mysql.createConnection({
              host: "localhost",
              user: "root",
              password: "Den8aKsexasw",
              database: "projectweb",
              multipleStatements: true
            });
            //shndesh me vash
            con.connect(function(err) {
              var k = false;

              console.log("Connected");
              var mquery = "SELECT pote_ko FROM user WHERE username like \'%"+mdata[0]+"%\'";
              con.query(mquery, function (err, result, fields) {
                if (err){
                  throw err;
                }
                var d1 = mdata[2];
                d1 = new Date(d1);
                var d2 = String(result[0].pote_ko);
                d2 = new Date(d2);
                var Difference_In_Time = d1.getTime() - d2.getTime();
                // To calculate the no. of days between two dates
                var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
                if(Difference_In_Days >= 14){
                  k = true;
                }
              });//telos query gia na dw an exei dhlw8ei ws krousma
              if(k){
                //mdata[...]...
                var mquery = "UPDATE user SET krousma="+mdata[1]+",pote_ko=\'"+mdata[2]+"\' WHERE username like \'%"+mdata[0]+"%\'";
                con.query(mquery, function (err, result, fields) {
                  if (err){
                    throw err;
                  }
                });//telos query gia info
                mmsg = {msg : "Έγινε."};
              }else{
                console.log("den 8a graftei");
                mmsg = {msg : "Έχετε ήδη δηλωθεί ως κρούσμα."};
              }
              res.write(JSON.stringify(mmsg));
              res.end();//end of response
            });
          });//req on end
        }//end if
      });
      //vazw pou eimai
      app.all('/usermeros',function (req, res) {
        console.log('Request received: ');
        util.inspect(req) // this line helps you inspect the request so you can see whether the data is in the url (GET) or the req body (POST)
        util.log('Request recieved: \nmethod: ' + req.method + '\nurl: ' + req.url) // this line logs just the method and url
        if(req.method==='OPTIONS'){
                res.writeHead(200);
                res.end();
          }else if(req.method==='POST'){
            var body = [];
            //h katallhlh kefalida
            res.writeHead(200, {
              'Content-Type': 'text/plain',
              'Access-Control-Allow-Origin' : '*',
              'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
            });
            //diavase data
            req.on("data", (chunk) => {
              console.log(chunk);
              body.push(chunk);
            });
            //otan exeis diavasei olo to data
            req.on("end", () => {
              var mdata = Buffer.concat(body).toString();
              mdata = JSON.parse(mdata);//parsing json
              mdata = mdata.msg;
              console.log(mdata);
              //dhmiourgia connection me vash
              var con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "Den8aKsexasw",
                database: "projectweb",
                multipleStatements: true
              });
              //shndesh me vash
              con.connect(function(err) {
                console.log("Connected");
                //mdata[...]...
                var mquery = "INSERT INTO visit(username,pname) VALUES (\'"+mdata[0]+"\', \'"+ mdata[1]+"\');";
                con.query(mquery, function (err, result, fields) {
                  if (err){
                    throw err;
                  }
                });//telos query gia info
              });
              res.end();//end of response
            });//req on end
          }//end if
        });//vazw pou eimai
        //vazw ektimhsh
        app.all('/userektimhsh',function (req, res) {
          console.log('Request received: ');
          util.inspect(req) // this line helps you inspect the request so you can see whether the data is in the url (GET) or the req body (POST)
          util.log('Request recieved: \nmethod: ' + req.method + '\nurl: ' + req.url) // this line logs just the method and url
          if(req.method==='OPTIONS'){
                  res.writeHead(200);
                  res.end();
            }else if(req.method==='POST'){
              var body = [];
              //h katallhlh kefalida
              res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
              });
              //diavase data
              req.on("data", (chunk) => {
                console.log(chunk);
                body.push(chunk);
              });
              //otan exeis diavasei olo to data
              req.on("end", () => {
                var mdata = Buffer.concat(body).toString();
                mdata = JSON.parse(mdata);//parsing json
                mdata = mdata.msg;
                console.log(mdata);
                //dhmiourgia connection me vash
                var con = mysql.createConnection({
                  host: "localhost",
                  user: "root",
                  password: "Den8aKsexasw",
                  database: "projectweb",
                  multipleStatements: true
                });
                //shndesh me vash
                con.connect(function(err) {
                  console.log("Connected");
                  //mdata[...]...
                  var mquery = "UPDATE visit SET ekt="+1+",num_of_people="+ mdata[1]+" WHERE username like \'%"+mdata[0]+"%\' AND tm like \'%"+mdata[2]+"%\';";
                  console.log(mquery);
                  con.query(mquery, function (err, result, fields) {
                    if (err){
                      throw err;
                    }
                  });//telos query gia info
                });
                res.end();//end of response
              });//req on end
            }//end if
          });
          //vazw pou eimai
//gia login
app.all('/userlogin',function (req, res) {
  console.log('Request received: ');
  util.inspect(req) // this line helps you inspect the request so you can see whether the data is in the url (GET) or the req body (POST)
  util.log('Request recieved: \nmethod: ' + req.method + '\nurl: ' + req.url) // this line logs just the method and url
  if(req.method==='OPTIONS'){
    res.writeHead(200);
    res.end();
  }else if(req.method==='POST'){
    var body = [];
    //h katallhlh kefalida
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
    });
    //diavase data
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    //otan exeis diavasei olo to data
    req.on("end", () => {
      var mdata = Buffer.concat(body).toString();
      mdata = JSON.parse(mdata);//parsing json
      console.log(mdata);
      //dhmiourgia connection me vash
      var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Den8aKsexasw",
        database: "projectweb",
        multipleStatements: true
      });
      //shndesh me vash
      con.connect(function(err) {
        var mmsg = {mssg : true};
        console.log("Connected");
        //mdata[...]...
        var mquery = "SELECT username,password,email FROM user where username like \'%"+mdata.username+"%\' and email like \'%"+ mdata.email+"%\';";
        con.query(mquery, function (err, result, fields) {
          if (err){
            throw err;
          }
          if(result.length == 0){
            mmsg = {mssg : false, merror : "username"};
            res.write(JSON.stringify(mmsg));
            res.end();//end of response
            //la8os username h email
          }else{
            if(result[0].password.trim() == mdata.password){
              console.log(mmsg);
              res.write(JSON.stringify(mmsg));
              res.end();//end of response
            }else{
              mmsg = {mssg : false, merror : "password"};
              res.write(JSON.stringify(mmsg));
              res.end();//end of response
            }
          }
        });//telos query gia info
      });
    });//req on end
  }//end if
});
//gia login

//gia register
app.all('/userregister',function (req, res) {
  console.log('Request received: ');
  util.inspect(req) // this line helps you inspect the request so you can see whether the data is in the url (GET) or the req body (POST)
  util.log('Request recieved: \nmethod: ' + req.method + '\nurl: ' + req.url) // this line logs just the method and url
  if(req.method==='OPTIONS'){
    res.writeHead(200);
    res.end();
  }else if(req.method==='POST'){
    var body = [];
    //h katallhlh kefalida
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
    });
    //diavase data
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    //otan exeis diavasei olo to data
    req.on("end", () => {
      var mdata = Buffer.concat(body).toString();
      mdata = JSON.parse(mdata);//parsing json
      console.log(mdata);
      //dhmiourgia connection me vash
      var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Den8aKsexasw",
        database: "projectweb",
        multipleStatements: true
      });
      //shndesh me vash
      con.connect(function(err) {
        var mmsg = {mssg : true};
        console.log("Connected");
        //mdata[...]...
        var mquery = "INSERT INTO user(username,password,email) VALUES (\'"+mdata.username+"\',\'"+ mdata.password +"\' , \'"+ mdata.email+"\');";
        con.query(mquery, function (err, result, fields) {
          if (err){
            throw err;
          }
          if(result.length == 0){
            mmsg = {mssg : false, merror : "username"};
            res.write(JSON.stringify(mmsg));
            res.end();//end of response
            //la8os username h email
          }else{
            console.log(mmsg);
            res.write(JSON.stringify(mmsg));
            res.end();//end of response
          }
        });//telos query gia info
      });
    });//req on end
  }//end if
});
//gia register


app.listen(8080, function() {
console.log('Node app is running on port 8080');
});
module.exports = app;

function ConvertNumberToTwoDigitString(n) {
  return n > 9 ? "" + n : "0" + n;
}
