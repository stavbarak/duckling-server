const express = require('express');
const fs = require('fs');
const mongo = require('mongodb').MongoClient;

const port = process.env['PORT']
const mongo_host = process.env['MONGO__HOST']


const url = process.env['MONGODB_URI'];

const app = express();
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
    const mongoClient = await getMongoClient();
    const db = mongoClient.db('duckling');
    const collection = db.collection('snippets');

    app.post('/snippet/:title', (req, res) => {
        console.log(req.params.title);
        console.log(req.body.content)
        res.send('not implemented')
    })

    app.get('/', (req, res) => {
        fs.readFile('mock.json', 'utf8', (err, data) => {
            res.send(data)
        })
    })

    app.listen(port)
}

init();