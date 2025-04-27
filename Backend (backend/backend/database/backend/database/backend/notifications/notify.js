const { Server } = require('socket.io');
const redis = require('redis');
const io = new Server(3001);
const redisClient = redis.createClient();

redisClient.subscribe('orders', (message) => {
  io.emit('newOrder', JSON.parse(message));
});

io.on('connection', (socket) => {
  console.log('Kitchen connected');
});

redisClient.on('message', (channel, message) => {
  io.emit('newOrder', JSON.parse(message));
});
