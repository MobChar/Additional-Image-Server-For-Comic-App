express = require('express');
const fs = require('fs');
const multipleUpload = require('./rabbitSetup').multipleUpload;//Already setup

//Set up app server
const app = express();
app.use(function (err, req, res, next) {
    console.error(err)
    res.status(500).send('Something broke!')
});
// app.use(express.urlencoded({extended: true}));

app.get('/image/:fileName', function (req, res) {
    var fileName = req.params.fileName;
    var readStream = fs.createReadStream(__dirname + '/uploadImage/' + fileName);
    readStream.on('open', function () {
        readStream.pipe(res);
    });
    readStream.on('error', function (err) {
        res.status(400);
        res.end('Cannot find the image');
    });
});
app.get('*', function (req, res) {
    res.status(404);
    res.end("404 not found!");
})



//Start server
app.listen(process.env.PORT || 3000);




