var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Payload = require('./api/models/ApiModel'),
    Device = require('./api/models/DeviceModel'),
    bodyParser = require('body-parser'),
    Group = require('./api/models/GroupModel'),
    Organisation = require('./api/models/OrganisationModel'),
    DeviceTypes = require('./api/models/TypeModel');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/PayDb');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('views', __dirname + '/views');

        console.log(__dirname+ '/api/models');
app.use(require('forest-express-mongoose').init({
     modelsDir: __dirname+ '/api/models',
     envSecret: "9843fddf5534e1c8024522285fcdc0be3281ffdd24a0bd66aee24193b3e56d0d",
    authSecret: "ta29HHDJExGoIrv7c0IGdm6z23CM1lbE",
}));

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