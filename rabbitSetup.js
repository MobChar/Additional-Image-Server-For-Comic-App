
const util = require("util");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

var serverId='B';
let debug = console.log.bind(console);
var rabbitChannel;

async function setUpRabbit() {
    const setUpRabbit = require('./rabbitMQService');
    await setUpRabbit.then(
        result => {
            rabbitChannel = result;

            rabbitChannel.consume('image-server-new-image', function (payload) {
                let data = JSON.parse(payload.content);
                if (!fs.existsSync(__dirname+'/uploadImage/')){
                    fs.mkdirSync(__dirname+'/uploadImage/');
                }
                fs.writeFile(__dirname+'/uploadImage/' + data.fileName, Buffer.from(data.fileBuffer),{ flag: 'w' }, (err) => {
                    if (err) console.log(err);
                });

                var sqlServerData = {
                    fileName: data.fileName,
                    chapterId: data.chapterId,
                    serverId: serverId
                }
                rabbitChannel.sendToQueue('sql-server-new-image', Buffer.from(JSON.stringify(sqlServerData)));
            }, {
                noAck: true
            });
        }
        , error => {
            console.log(error);
            throw error;
        });
}

setUpRabbit();
