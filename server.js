
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
    Ranks = require('./api/models/RanksModel'),
    Permissions = require('./api/models/PermissionsModel'),
    UserGroup = require("./api/models/UserGroupModel");


//connection a la BDD
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/PayDb');

app.use(require('forest-express-mongoose').init({
    modelsDir: __dirname + '/api/models',
    envSecret: "6bcbf7f384a0eb3871ec51f9a169cb89326c485e90eff43a7d1e62795e5c7fa5",
    authSecret: "9yGLmCHaMslu21NGftFLmaLL6E6Jh16A",
    mongoose: require('mongoose')
}));

//const moment = require('moment-timezone');
//moment.tz.setDefault("Europe/Paris");


app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

let routes = require('./api/routes/ApiRoute');
routes(app);

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
console.log("Auth Token activated : true");