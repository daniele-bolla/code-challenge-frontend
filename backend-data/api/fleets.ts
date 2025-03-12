import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const fleets ={}
    res.json(fleets);
  } catch (error) {
    console.error('Error fetching fleets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;