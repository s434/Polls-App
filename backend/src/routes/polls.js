const express = require('express');
const prisma = require('../prismaClient');
const router = express.Router();

// Create a poll with options
router.post('/', async (req, res) => {
  try {
    const { question, options, creatorId, isPublished } = req.body;
    if (!question || !Array.isArray(options) || options.length < 2 || !creatorId) return res.status(400).json({ error: 'question, options (>=2), creatorId required' });
    const poll = await prisma.poll.create({
      data: {
        question,
        isPublished: !!isPublished,
        creatorId,
        options: { create: options.map(t => ({ text: t })) }
      },
      include: { options: true }
    });
    res.status(201).json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// List polls
router.get('/', async (req, res) => {
  const polls = await prisma.poll.findMany({ take: 50, orderBy: { createdAt: 'desc' }, select: { id: true, question: true, isPublished: true, createdAt: true }});
  res.json(polls);
});

// Get poll with options & vote counts
router.get('/:id', async (req, res) => {
  try {
    const pollId = req.params.id;
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: true, creator: { select: { id: true, name: true } } }
    });
    if (!poll) return res.status(404).json({ error: 'Poll not found' });

    // counts per option
    const counts = await prisma.vote.groupBy({ by: ['pollOptionId'], where: { pollId }, _count: { pollOptionId: true }});
    const map = {};
    counts.forEach(c => { map[c.pollOptionId] = c._count.pollOptionId; });

    const optionsWithCount = poll.options.map(o => ({ id: o.id, text: o.text, count: map[o.id] || 0 }));
    res.json({ id: poll.id, question: poll.question, isPublished: poll.isPublished, creator: poll.creator, createdAt: poll.createdAt, updatedAt: poll.updatedAt, options: optionsWithCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
