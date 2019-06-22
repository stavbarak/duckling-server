const express = require('express');
const fs = require('fs');
const mongo = require('mongodb').MongoClient;

const port = process.env['PORT'];
const mongo_host = process.env['MONGO__HOST'];

const url = process.env['MONGODB_URI'];

console.log("DEBUG: mongodb url is:", url)
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

function getMongoClient() {
    return new Promise((resolve, reject) => {
        mongo.connect(url, (err, client) => {
            if (err) {
              console.error(err)
              return
            }
            resolve(client);
        })
    }) 
}

async function init() {
    console.log('starting...')
    console.log(port)
    const mongoClient = await getMongoClient();
    const db = mongoClient.db('duckling');
    const collection = db.collection('snippets');

    app.post('/snippet/:title', (req, res) => {
        console.log(req.params.title);
        console.log(req.body)
        collection.insertOne({
            title: req.params.title,
            content: req.body.content
        }, (err, response) => {
            if(err) {
                console.log("error while trying to write to mongo:", err)
                res.status(500).send("error while trying to write to database")
                return;
            }
            res.send('done\n')
        })
    })

    app.get('/', (req, res) => {
        collection.find().toArray(function(err, items) {
            if (err) {
                console.log("error while trying to query db", err)
                res.status(500).send("error while trying to query db")
                return;
            }
            res.json(items)
        })
    })
    console.log('ready to listen')
    app.listen(port)
}

init();