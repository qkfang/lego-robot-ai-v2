const express = require('express');
const cors = require('cors')
var multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const legoApi = require('./lego_robot/api');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Pusher = require('pusher');

const pusher = new Pusher({
    appId: "1821462",
    key: "f1586bf9908b2073cda6",
    secret: "a3d4276606cc1d157ce8",
    cluster: "us2",
    encrypted: true,
});
const channel = 'legowebchats';


const app = express();
app.use(express.json());
app.use(cors()); // enable all CORS requests
app.use(multer({ dest: __dirname + '\\uploads\\' }).any());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', legoApi);


// parse out hosting port from cmd arguments if passed in
// otherwise default to port 4242
var port = (() => {
    const { argv } = require('node:process');
    var port = 4242; // default
    if (argv) {
        argv.forEach((v, i) => {
            if (v && (v.toLowerCase().startsWith('port='))) {
                port = v.substring(5);
            }
        });
    }
    return port;
})();

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


mongoose.connect(process.env.AZURE_COSMOSDB_RU_CONNECTION_STRING);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {

    const webchatCollection = db.collection('legowebchats');
    const changeStream = webchatCollection.watch(
        [
            {
                $match: {
                    $and: [
                        { "operationType": { $in: ["insert", "update", "replace"] } }
                    ]
                }
            },
            { $project: { "_id": 1, "fullDocument": 1, "ns": 1, "documentKey": 1 } }
        ],
        { fullDocument: "updateLookup" });


    changeStream.on('change', (change) => {
        // console.log(change);
        // if(change.operationType === 'insert') {
        console.log('push insert');
        const webchat = change.fullDocument;
        pusher.trigger(
            channel,
            'inserted',
            {
                id: webchat._id,
                message: webchat.message,
            }
        );
        // } else if(change.operationType === 'delete') {
        //   console.log('push change');
        //   pusher.trigger(
        //     channel,
        //     'deleted', 
        //     change.documentKey._id
        //   );
        // }
    });
})

module.exports = app;