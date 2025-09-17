const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/users');
const pollRoutes = require('./routes/polls');
const voteRoutes = require('./routes/votes');
const authRoutes = require('./routes/auth');
const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.use('/users', userRoutes);
app.use('/polls', pollRoutes);
// vote endpoint lives under /polls/:pollId/vote
app.use('/polls', voteRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

module.exports = app;
