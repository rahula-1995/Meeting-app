// Importing all Middleware
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const meetRoutes = require("./routes/meetRoutes");
const cors = require("cors");
const mongoose = require("mongoose");


//Constructing Express app
const app=express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//error handling Middleware
app.use(( error, req, res, next ) => 
{
    return res.status( error.status || 500 ).send( error.message ); 
});

//Logging every request and response
/*app.use( '/', ( req, res, next ) => {
    console.log( 'Received req at', (new Date()).toTimeString() );
    
    next();

    console.log( 'Response sent at', (new Date()).toTimeString() );
    
});*/

//Setting ejs as view engine
/*app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
*/
//Connecting Mongodb

var MongoClient = require('mongodb').MongoClient;

var uri = "mongodb://rahul:rahul@cluster0-shard-00-00.iksda.mongodb.net:27017,cluster0-shard-00-01.iksda.mongodb.net:27017,cluster0-shard-00-02.iksda.mongodb.net:27017/MEET?ssl=true&replicaSet=atlas-6mix2o-shard-0&authSource=admin&retryWrites=true&w=majority";
/*MongoClient.connect(uri, function(err, client) {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});*/





/*const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://rahul:rahul@cluster0.iksda.mongodb.net/MEET?retryWrites=true&w=majority&ssl=true";*/
/*const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});*/

//const mongoUrl = 'mongodb://localhost/MEET'
const mongo=mongoose.connect(uri,
{
    useNewUrlParser:true , 
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
});
mongo.then(() => 
{
    console.log('connected');
}, 
error => 
{
    console.log(error, 'error');
})
console.log(mongo)
//Setting routes
app.use('/Meets', meetRoutes.protected)
app.use('/Users', meetRoutes.unprotected)

//Starting the server
var port = process.env.PORT || 8080;
app.listen(port, function() 
{
    console.log("Running Meeting Scheduler on Port "+ port)
})