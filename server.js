const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 3000

app.use(express.static(__dirname + "/public"))
let clients = 0

io.on('connection', function (socket) {
    console.log(clients)
    if (clients == 0) {
        this.emit('PeerName', true)
    }
    else{
        this.emit('PeerName', false)
    }
    socket.on("NewClient", function () {
        if (clients < 3) {
            if (clients == 1 || clients == 2) {
                this.emit('CreatePeer')
            }
        }
        else{
            this.emit('SessionActive')
        }
        clients++;
        
    })
    socket.on('Offer', SendOffer)
    socket.on('Answer', SendAnswer)
    socket.on('disconnect', Disconnect)
    socket.on('ConnectedDevice', ConnectedDevice)
})

function Disconnect() {
    if (clients > 0) {
        if (clients <= 2){
            this.broadcast.emit("Disconnect")
        }
        clients--
    }
}

function SendOffer(offer) {
    this.broadcast.emit("BackOffer", offer)
}

function SendAnswer(data) {
    this.broadcast.emit("BackAnswer", data)
}

function ConnectedDevice() {
    this.broadcast.emit("ConnectedDevice")
}

http.listen(port, () => console.log(`Active on ${port} port`))
