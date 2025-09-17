const http = require('http');
const app = require('./app');
const prisma = require('./prismaClient');
const { Server } = require('socket.io');
require('dotenv').config();

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: ['http://localhost:5173'], methods: ['GET','POST'] }});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);

  socket.on('joinPoll', ({ pollId }) => {
    if (!pollId) return;
    socket.join(`poll:${pollId}`);
    console.log(`${socket.id} joined poll:${pollId}`);
  });

  socket.on('leavePoll', ({ pollId }) => {
    if (!pollId) return;
    socket.leave(`poll:${pollId}`);
    console.log(`${socket.id} left poll:${pollId}`);
  });

  socket.on('disconnect', () => console.log('Socket disconnected', socket.id));
});

process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
