import express from 'express';
import { getFleets } from '../services/FleetService';
import { sendResponse } from '../utils/response';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const fleets = await getFleets()
    sendResponse(res, 200, fleets);
  } catch (error) {
    next(error)
  }
});

export default router;