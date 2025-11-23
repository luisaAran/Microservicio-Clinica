import { Router } from 'express';
import { ClinicalRecordController } from '../../../domain/clinical-record/controllers/ClinicalRecordController.js';
import { ClinicalRecordService } from '../../../domain/clinical-record/services/ClinicalRecordService.js';
import { ClinicalRecordRepository } from '../../../domain/clinical-record/repositories/ClinicalRecordRepository.js';
import { CreateClinicalRecordSchema } from '../../../domain/clinical-record/dtos/ClinicalRecordDTO.js';
import { PatientIdParamSchema } from '../../../domain/shared/paramSchemas.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router:Router = Router();
const repository = new ClinicalRecordRepository();
const service = new ClinicalRecordService(repository);
const controller = new ClinicalRecordController(service);

/**
 * @swagger
 * /clinical-records:
 *   post:
 *     summary: Create a new clinical record
 *     tags: [ClinicalRecords]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateClinicalRecord'
 *     responses:
 *       201:
 *         description: The clinical record was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClinicalRecord'
 */
router.post('/', validateRequest({ body: CreateClinicalRecordSchema }), controller.create);

/**
 * @swagger
 * /patients/{id}/clinical-records:
 *   get:
 *     summary: List clinical records by patient ID
 *     tags: [ClinicalRecords]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The patient ID
 *     responses:
 *       200:
 *         description: The list of clinical records for the patient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClinicalRecord'
 */
router.get(
	'/patients/:id/clinical-records',
	validateRequest({ params: PatientIdParamSchema }),
	controller.listByPatient
);

export default router;
