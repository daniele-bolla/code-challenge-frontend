import express from 'express';
import { getVehicles } from '../services/VehicleService';
import { sendResponse } from '../utils/response';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { fleetId } = req.query;
    if (!fleetId) {
      return sendResponse(res, 400, null, 'fleetId is required');
    }

    const vehicles = await getVehicles()
    sendResponse(res, 200, vehicles);
  }catch (error) {
    next(error);
  }
});

export default router;