import express from 'express';
import cors from 'cors';
import fleetRoutes from './api/fleets';
import vehicleRoutes from './api/vehicles';
import snapshotRoutes from './api/snapshots';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { errorHandler } from './middlewares/errorHandler';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));

// Routes
app.use('/fleets', fleetRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/snapshots', snapshotRoutes);

// Error handling middleware
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});