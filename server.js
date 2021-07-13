const express = require('express');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
 res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', (socket) => {
  console.log('made socket connection', socket.id);
  socket.on('join-room', (roomId, userId) => {
  console.log("room-joined")
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId)
      console.log("user-disconnected")
    })

  })



    // Handle chat event
    socket.on('chat', function(data){
        // console.log(data);
        io.sockets.emit('chat', data);
        
        
    });

    // Handle typing event
    socket.on('typing', function(data){
        socket.emit('typing', data);
    });
})

//server.listen(100)
const port = process.env.PORT || 100;
server.listen(port);
console.log("hiiii !! listening at port 100")