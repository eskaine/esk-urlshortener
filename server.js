const express = require('express');
const app = express();
const port = 3000;

//Modules
const error = require('./js/error');
const db = require('./js/database');
const urlchecker = require('./js/urlchecker');

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


//filter invalid url without http/https
app.get('/new/:url', function(req, res) {
    res.send(error.invalid);
});

app.get([
    '/new/https:\//:url', '/new/http:\//:url'
], function(req, res) {

    let url = req.params.url;

    //validate url format, return a Promise
    let check_p = urlchecker.inputurl(url);

    check_p.then(function fulfilled() {

        //add url to database
        db.addurl(res, url);

    }, function rejected(err) {

        //respond with invalid url
        res.send(error.invalid);
    });
});

//redirect shortened url
app.get('/:url', function(req, res) {

    let url = req.params.url;

    //validate url format
    let check_p = urlchecker.outputurl(url);

    check_p.then(function fulfilled() {

        //redirect url
        db.redirect(res, url);

    }, function rejected(err) {

        //respond with unavailable url
        res.send(error.unavailable);
    });
});

app.listen(port);
