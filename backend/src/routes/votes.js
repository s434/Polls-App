const express = require('express');
const prisma = require('../prismaClient');
const router = express.Router();

router.post('/:pollId/vote', async (req, res) => {
  try {
    const { userId, pollOptionId } = req.body;
    const { pollId } = req.params;
    if (!userId || !pollOptionId) return res.status(400).json({ error: 'userId and pollOptionId required' });

    const option = await prisma.pollOption.findUnique({ where: { id: pollOptionId }});
    if (!option || option.pollId !== pollId) return res.status(400).json({ error: 'Option does not belong to poll' });

    try {
      const vote = await prisma.vote.create({ data: { userId, pollId, pollOptionId } });

      const io = req.app.get('io');
      if (io) {
        const counts = await prisma.vote.groupBy({ by: ['pollOptionId'], where: { pollId }, _count: { pollOptionId: true }});
        const map = {};
        counts.forEach(c => { map[c.pollOptionId] = c._count.pollOptionId; });
        const options = await prisma.pollOption.findMany({ where: { pollId }, select: { id: true, text: true }});
        const payload = options.map(o => ({ id: o.id, text: o.text, count: map[o.id] || 0 }));
        io.to(`poll:${pollId}`).emit('pollUpdate', { pollId, options: payload });
      }

      res.status(201).json({ success: true, voteId: vote.id });
    } catch (err) {
      if (err.code === 'P2002' || (err.meta && err.meta.target && err.meta.target.includes('one_vote_per_user_per_poll'))) {
        return res.status(409).json({ error: 'You has already voted on this poll' });
      }
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
