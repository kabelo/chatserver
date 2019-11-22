var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var DBHost=process.env["DBHOST"] || "test";


app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.Promise = Promise

//nevermind thiese comments, they are for my local dev setup
//var HOST = process.env.MONGO_SERVICE_HOST;
//var PORT = process.env.MONGO_SERVICE_PORT;
//var DB_NAME = 'test'

//var DB_URI = 'mongodb://$(HOST):$(PORT)/$(DB_NAME)'
//var dbUrl = 'mongodb://user:user@ds155424.mlab.com:55424/learning-node'
//var DB_URI = 'mongodb://mongo:27017/test'
//var DB_URI = 'mongodb://localhost:27017/test'
//var DB_URI = 'mongodb://'+process.env.MONGO_PORT_27017_TCP_ADDR+':'+process.env.MONGO_PORT_27017_TCP_PORT+'/test'


var Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.get('/messages/:user', (req, res) => {
    var user = req.params.user
    Message.find({ name: user }, (err, messages) => {
        res.send(messages)
    })
})

app.post('/messages', async (req, res) => {

    try {
        var message = new Message(req.body)

        var savedMessage = await message.save()

        console.log('saved')

        var censored = await Message.findOne({ message: 'badword' })

        if (censored)
            await Message.remove({ _id: censored.id })
        else
            io.emit('message', req.body)

        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
        return console.error(error)
    } finally {
        console.log('message post called')
    }
})



io.on('connection', (socket) => {
    console.log('a user connected')
})

//mongoose.connect(dbUrl, { useMongoClient: true }, (err) => {
//    console.log('mongo db connection', err)
//})

mongoose.connect(DBHost+'test', { useMongoClient: true }, (err) => {
//mongoose.connect(DB_URI, { useMongoClient: true }, (err) => {
    if (!err) { console.log('MongoDB connection success') }
    else { console.log('Error in DB connection') }
})

var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})