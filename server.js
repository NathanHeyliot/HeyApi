
//includes
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    HttpPort = 3100,
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
    UserGroup = require("./api/models/UserGroupModel"),
    Sales = require('./api/models/SalesModel'),
    Logs = require('./api/models/LogsModel'),
    https = require("https"),
    fs = require("fs"),
    helmet = require("helmet");

//setup HTTPS PROTOCOL
app.use(helmet()); // Setuping the helmet middleware (is a protection system)

const options = {
    key: fs.readFileSync("/etc/letsencrypt/live/api.heyliot.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/api.heyliot.com/fullchain.pem")
};

//connection a la BDD
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/PayDb');

app.use(require('forest-express-mongoose').init({
    modelsDir: __dirname + '/api/models',
    envSecret: "6bcbf7f384a0eb3871ec51f9a169cb89326c485e90eff43a7d1e62795e5c7fa5",
    authSecret: "9yGLmCHaMslu21NGftFLmaLL6E6Jh16A",
    mongoose: require('mongoose')
}));

const moment = require('moment-timezone');
moment.tz.setDefault("Europe/Paris");
moment.locale('fr');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

let routes = require('./api/routes/ApiRoute');
routes(app);

app.listen(HttpPort); //HTTP PORT used for local connect <3
https.createServer(options, app).listen(port); //HTTPS PROTOCOL


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


let Reset = "\x1b[0m",
    Bright = "\x1b[1m",
    Dim = "\x1b[2m",
    Underscore = "\x1b[4m",
    Blink = "\x1b[5m",
    Reverse = "\x1b[7m",
    Hidden = "\x1b[8m",

    FgBlack = "\x1b[30m",
    FgRed = "\x1b[31m",
    FgGreen = "\x1b[32m",
    FgYellow = "\x1b[33m",
    FgBlue = "\x1b[34m",
    FgMagenta = "\x1b[35m",
    FgCyan = "\x1b[36m",
    FgWhite = "\x1b[37m",

    BgBlack = "\x1b[40m",
    BgRed = "\x1b[41m",
    BgGreen = "\x1b[42m",
    BgYellow = "\x1b[43m",
    BgBlue = "\x1b[44m",
    BgMagenta = "\x1b[45m",
    BgCyan = "\x1b[46m",
    BgWhite = "\x1b[47m";


console.log(FgGreen + 'Server started on: ' + port);
console.log(FgCyan + "Auth Token activated : true");