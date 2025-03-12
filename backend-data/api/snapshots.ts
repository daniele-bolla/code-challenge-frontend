import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const snapshots ={}
    res.json(snapshots);
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;