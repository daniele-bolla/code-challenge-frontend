import express from 'express';
import { getSnapshots } from '../services/SnapshotsService';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page } = req.query;
    if (!page) {
      return res.status(400).json({ error: 'page is required' });
    }
  
    const snapshots = await getSnapshots(page)
    res.json(snapshots);
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;