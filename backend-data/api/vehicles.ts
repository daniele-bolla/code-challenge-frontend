import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const vehicles ={}
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;