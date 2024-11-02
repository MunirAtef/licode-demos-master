const express = require('express');
const publicFolder = require('./routes/public');
const admin = require('./routes/admin');
const rest = require('./routes/rest');
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require("fs");
const config = require('./config');

const app = express();

// all environments
app.set('port', config.http_port || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

console.log(app.get("views"))
console.log("============================================")

// app.use(function (req, res, next) {
//     "use strict";
//     res.header('Access-Control-Allow-Origin','*');
//     res.header('Access-Control-Allow-Methods', 'HEAD, PUT, POST, GET, OPTIONS, DELETE');
//     res.header('Access-Control-Allow-Headers', 'origin, content-type');
//     if (req.method === 'OPTIONS') {
//         console.log("CORS request");
//         res.statusCode = 200;
//         res.header('Content-Length', '0');
//         res.send();
//         res.end();
//     }
//     else {
//         next();
//     }
// });

// app.use(express.cookieParser('asdaggftyuoplfgd'));
// app.use(express.cookieSession());
// app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
// app.use(express.urlencoded());
// app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

app.get('/', publicFolder.index);
app.get('/room', publicFolder.room);
app.get('/roomtype', publicFolder.room_type);
app.post('/token', rest.createToken);


app.get('/admin/login', admin.login);
app.post('/admin/login', admin.login);
app.get('/admin', admin.auth, admin.admin);
app.post('/admin/rooms', admin.auth, rest.createRoom);
// Fake delete
app.get('/admin/rooms/:room', admin.auth, rest.deleteRoom);
app.get('/admin/logout', admin.logout);

app.get('/room_spy', admin.auth, publicFolder.spy_room);


if (config.https) {

    const options = {
        key: fs.readFileSync('cert/key.pem').toString(),
        cert: fs.readFileSync('cert/cert.pem').toString()
    };

    if (config.ca_certs) {
        options.ca = [];
        for (const ca in config.ca_certs) {
            options.ca.push(fs.readFileSync('cert/' + config.ca_certs[ca]).toString());
        }
    }
    const server = https.createServer(options, app);
    server.listen(config.https_port || 443);
}

// app.get('port')
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
