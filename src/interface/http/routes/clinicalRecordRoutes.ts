import { Router } from 'express';
import { ClinicalRecordController } from '../../../domain/clinical-record/controllers/ClinicalRecordController.js';
import { ClinicalRecordService } from '../../../domain/clinical-record/services/ClinicalRecordService.js';
import { ClinicalRecordRepository } from '../../../domain/clinical-record/repositories/ClinicalRecordRepository.js';
import { CreateClinicalRecordSchema, UpdateClinicalRecordSchema } from '../../../domain/clinical-record/dtos/ClinicalRecordDTO.js';
import { ClinicalRecordIdParamSchema, PatientIdParamSchema } from '../../../domain/shared/paramSchemas.js';
import {
	ClinicalRecordByPatientQuerySchema,
	ClinicalRecordListQuerySchema,
} from '../../../domain/shared/querySchemas.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { PatientRepository } from '../../../domain/patient/repositories/PatientRepository.js';
import { TumorTypeRepository } from '../../../domain/tumor-type/repositories/TumorTypeRepository.js';
import { PatientService } from '../../../domain/patient/services/PatientService.js';
import { TumorTypeService } from '../../../domain/tumor-type/services/TumorTypeService.js';

const router:Router = Router();
const repository = new ClinicalRecordRepository();
const patientRepository = new PatientRepository();
const tumorTypeRepository = new TumorTypeRepository();
const patientService = new PatientService(patientRepository);
const tumorTypeService = new TumorTypeService(tumorTypeRepository);
const service = new ClinicalRecordService(repository, patientService, tumorTypeService);
const controller = new ClinicalRecordController(service);

/**
 * @swagger
 * /clinical-records:
 *   get:
 *     summary: List all clinical records
 *     tags: [ClinicalRecords]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Número de página (1-indexado)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Cantidad de registros por página
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtra por identificador de paciente
 *       - in: query
 *         name: tumorTypeId
 *         schema:
 *           type: integer
 *         description: Filtra por identificador de tipo de tumor
 *       - in: query
 *         name: stage
 *         schema:
 *           type: string
 *         description: Filtra por etapa clinica
 *       - in: query
 *         name: diagnosisFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha mínima de diagnóstico (YYYY-MM-DD)
 *       - in: query
 *         name: diagnosisTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha máxima de diagnóstico (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista paginada de historias clínicas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedClinicalRecords'
 */
router.get(
	'/clinical-records',
	validateRequest({ query: ClinicalRecordListQuerySchema }),
	controller.list
);

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
 *               $ref: '#/components/schemas/ClinicalRecordResponse'
 */
router.post('/clinical-records', validateRequest({ body: CreateClinicalRecordSchema }), controller.create);

/**
 * @swagger
 * /clinical-records/{id}:
 *   get:
 *     summary: Get a clinical record by ID
 *     tags: [ClinicalRecords]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The clinical record ID
 *     responses:
 *       200:
 *         description: The clinical record information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClinicalRecordResponse'
 *       404:
 *         description: Clinical record not found
 */
router.get(
	'/clinical-records/:id',
	validateRequest({ params: ClinicalRecordIdParamSchema }),
	controller.getById
);

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
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *       - in: query
 *         name: tumorTypeId
 *         schema:
 *           type: integer
 *         description: Filtra por tipo de tumor
 *       - in: query
 *         name: stage
 *         schema:
 *           type: string
 *         description: Filtra por estadio clínico
 *       - in: query
 *         name: diagnosisFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: diagnosisTo
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lista paginada de historias clínicas del paciente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedClinicalRecords'
 */
router.get(
	'/patients/:id/clinical-records',
	validateRequest({ params: PatientIdParamSchema, query: ClinicalRecordByPatientQuerySchema }),
	controller.listByPatient
);

/**
 * @swagger
 * /clinical-records/{id}:
 *   put:
 *     summary: Update a clinical record
 *     tags: [ClinicalRecords]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The clinical record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateClinicalRecord'
 *     responses:
 *       200:
 *         description: The clinical record was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClinicalRecordResponse'
 *       404:
 *         description: Clinical record not found
 */
router.put(
	'/clinical-records/:id',
	validateRequest({ params: ClinicalRecordIdParamSchema, body: UpdateClinicalRecordSchema }),
	controller.update
);

/**
 * @swagger
 * /clinical-records/{id}:
 *   delete:
 *     summary: Soft delete a clinical record
 *     tags: [ClinicalRecords]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The clinical record ID
 *     responses:
 *       200:
 *         description: The clinical record was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: Clinical record not found
 */
router.delete(
	'/clinical-records/:id',
	validateRequest({ params: ClinicalRecordIdParamSchema }),
	controller.delete
);

export const clinicalRecordRoutes = router;
export default router;
