import express from 'express';
import cors from 'cors';
import fleetRoutes from './api/vehicles';
import vehicleRoutes from './api/vehicles';
import dataRoutes from './api/snapshots';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/fleets', fleetRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/data', dataRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});