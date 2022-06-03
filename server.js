//console.log('Hold on to your butts...')
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const req = require('express/lib/request')
const app = express()
const MongoClient = require('mongodb').MongoClient

const connectionString = process.env.MONGODB_URL
// MongoClient.connect('mongodb+srv://allena:dinosaur@cluster0.jmwtr.mongodb.net/?retryWrites=true&w=majority', (err, client) => {
//     if (err) console.error(err)
//     console.log("I think we're back in business")
//     const db = client.db('jurassic-quotes')
// })

MongoClient.connect(connectionString, {useUnifiedTopology: true})
    .then(client => {
        console.log("I think we're back in business")
        const db = client.db('jurassic-quotes')
        const quotesCollection = db.collection('quotes')

        //embedded js egin for template and dynamic html
        app.set('view engine', 'ejs')

        //put body parser before crud handlers
        app.use(bodyParser.urlencoded({ extended: true}))
        app.use(express.static('public'))
        app.use(bodyParser.json())

        //app.get(endpoint, callback) request and response are often shortened to req, res
        app.get('/', (request, response) => {
            //const cursor = db.collection('quotes').find()
            db.collection('quotes').find().toArray()
                .then(results => {
                    response.render('index.ejs', { quotes: results })
                    //console.log(results)
                })
                .catch(err => console.error(err))
            
            //console.log(cursor)
            //response.send('Welcome, to Jurassic World')
            //response.sendFile(__dirname + '/index.html')
            //__dirname is current directory you're in
        })

        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
            .then(result => {
                res.redirect('/')
                console.log(result)
            })
            .catch(err => console.error(err))
            //console.log(req.body)
            //console.log('Run!!!!')
        })
        
        app.put('/quotes', (request, response) => {
            quotesCollection.findOneAndUpdate(
                //query - filter's collection with key value pairs
                {name: ''},
                //update - tells mongodb what to change(uses update operators like $set, $inc and $push)
                {
                    $set: {
                        name: request.body.name,
                        quote: request.body.quote
                    }
                },
                //options - defines additional options for this update request
                {
                    upsert: true
                }
            )
            .then(result => {
                //console.log(result)
                response.json('Success')
            })
            .catch(error => console.error(error))
        })

        app.delete('/quotes', (request, response) =>{
            quotesCollection.deleteOne(
                //query
                {name: request.body.name},
                //options - not needed here
            )
            .then(result => {
                if(result.deletedCount === 0) {
                    return response.json('no roar to delete')
                }else{
                    return response.json('Deleted a roar')
                }
            })
            .catch(error => console.error(error))
        })

        app.listen(3000, function() {
            console.log('Stay absolutely still on 3000')
        })
    })
    .catch(err => console.error(err))




