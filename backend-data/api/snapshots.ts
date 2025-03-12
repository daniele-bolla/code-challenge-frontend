import express from 'express';
import { getSnapshots } from '../services/SnapshotsService';
import { sendResponse } from '../utils/response';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { page } = req.query;
    if (!page) {
      return sendResponse(res, 400, null, 'page is required');
    }
  
    const snapshots = await getSnapshots(page)
    sendResponse(res, 200, snapshots);
  } catch (error) {
    next(error)
  }
});

export default router;