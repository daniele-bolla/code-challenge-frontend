import express from 'express';
import { getVehicles } from '../services/VehicleService';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const vehicles = await getVehicles()
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;