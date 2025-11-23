import type { Application } from 'express';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import { patientRoutes } from './interface/http/routes/patientRoutes.js';
import { tumorTypeRoutes } from './interface/http/routes/tumorTypeRoutes.js';
import { clinicalRecordRoutes } from './interface/http/routes/clinicalRecordRoutes.js';
import { errorHandler } from './interface/http/middleware/errorHandler.js';

const app: Application = express();

app.use(express.json());

// Docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/patients', patientRoutes);
app.use('/tumor-types', tumorTypeRoutes);
app.use('/', clinicalRecordRoutes); // For /patients/:id/clinical-records and /clinical-records

// Error Handler
app.use(errorHandler);

export default app;
