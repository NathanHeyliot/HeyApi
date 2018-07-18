
//includes
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Payload = require('./api/models/PayloadsModel'),
    Device = require('./api/models/DeviceModel'),
    bodyParser = require('body-parser'),
    Group = require('./api/models/GroupModel'),
    Organisation = require('./api/models/OrganisationModel'),
    User = require("./api/models/UserModel");
    DeviceTypes = require('./api/models/TypeModel'),
    UserGroup = require("./api/models/UserGroupModel");


//connection a la BDD
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/PayDb');

app.use(require('forest-express-mongoose').init({
    modelsDir: __dirname + '/api/models',
    envSecret: "bff3b926857a3d9ee993bbbe1228e5875be68a36e0949c16b94c1226171d9b58",
    authSecret: "9yGLmCHaMslu21NGftFLmaLL6E6Jh16A",
    mongoose: require('mongoose')
}));


app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


/*
* SET ROUTER IN DEV MODE
 */

let route_dev = true;

/*
* SET AUTH TOKEN TO ON
 */
let auth_activated = false;

let routes = require('./api/routes/ApiRoute');
routes(app, route_dev, auth_activated);

app.listen(port);


//error management
app.use(function(req, res)
{
    res.status(404).send({url: req.originalUrl + ' not found !'})
});

app.use(function (req, res)
{
   res.status(400).send({url: req.originalUrl + ' Bad Request !'})
});

app.use(function (req, res)
{
   res.status(401).send({url: req.originalUrl + ' Unauthorized! Please tell me who you are !'})
});

app.use(function (req, res)
{
    res.status(403).send({url: req.originalUrl + " you don't have the right to do that !"})
});

app.use(function(req, res)
{
    res.status(405).send({url: req.originalUrl + " Is not allowed here !"})
});

app.use(function (req, res)
{
    res.status(406).send({url: req.originalUrl + "Can't be accepted !"})
});

console.log('Server started on: ' + port);
console.log("Route loaded in developpement mode : " + route_dev);
console.log("Auth Token activated : " + auth_activated);