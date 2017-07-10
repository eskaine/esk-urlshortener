var error = {
    log: function(err) {
        if (err)
            console.error(err);
        }
    ,

    unavailable: JSON.stringify({"error": "This url is not in the database."}),

    invalid: JSON.stringify({"error": "Wrong url format, make sure you have a valid protocol and real site."})

}

module.exports = error;
