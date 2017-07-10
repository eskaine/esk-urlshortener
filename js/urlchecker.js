var urlchecker = {

    outputurl: function(url) {

        if (url.length == 2)
            return Promise.resolve();
        else
            return Promise.reject();

        }
    ,

    inputurl: function(url) {

        const dot = url.includes(".");

        if (dot)
            return Promise.resolve();
        else
            return Promise.reject();

        }
}

module.exports = urlchecker;
