const mongo = require('mongodb').MongoClient;
const Hashids = require('hashids');
const error = require('./error');

const collectionName = process.env.COLL;
const dburl = 'mongodb://' + process.env.USER + ':' + process.env.PASS + '@' + process.env.IP + ':' + process.env.DB_PORT + '/' + process.env.DB;
const hashids = new Hashids(collectionName);
const siteurl = "https://esk-urlshortener.glitch.me/";

var database = {
    redirect: redirect,
    addurl: addurl
};

module.exports = database;

//Functions

//redirect url
function redirect(res, url) {

    //connect to database
    mongo.connect(dburl, function(err, db) {

        //search for shortened url
        db.collection(collectionName).find({
            short_url: siteurl + url
        }).toArray(function(err, data) {

            error.log(err);

            //redirect if found
            if (data[0] !== undefined)
                res.redirect("https://" + data[0]['original_url']); //else respond with unavailable
            else
                res.send(error.unavailable);

            db.close();
        });

    });

}

//add url to database
function addurl(res, url) {

    //connect to database
    mongo.connect(dburl, function(err, db) {
        error.log(err);

        var collection = db.collection(collectionName);

        //search for input url
        collection.find({original_url: url}).toArray(function(err, data) {
            error.log(err);

            //add url if not found
            if (data[0] === undefined) {

                //generate shortcode for shortened url
                var p1 = collection.count().then(function fulfilled(data) {

                    let dataArr = [];
                    dataArr.push(data);
                    dataArr.push(siteurl + hashids.encode(data));

                    return Promise.resolve(dataArr);
                });

                //insert shortened url into database and respond
                p1.then(function fulfilled(data) {
                    collection.insert(doc(url, data[1], data[0]), function(err) {
                        error.log(err);

                        db.close();
                        res.send(JSON.stringify(doc(url, data[1])));
                    });
                });

            } else {
                db.close();
                res.send(JSON.stringify(doc(url, data[0]['short_url'])));
            }

        });

    });
}

//database document format
function doc(url, shorturl, id) {
    return {id: id, original_url: url, short_url: shorturl}
}
