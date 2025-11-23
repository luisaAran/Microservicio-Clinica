import { Router } from 'express';
import { PatientController } from '../../../domain/patient/controllers/PatientController.js';
import { PatientService } from '../../../domain/patient/services/PatientService.js';
import { PatientRepository } from '../../../domain/patient/repositories/PatientRepository.js';
import { CreatePatientSchema, UpdatePatientSchema } from '../../../domain/patient/dtos/PatientDTO.js';
import { PatientIdParamSchema } from '../../../domain/shared/paramSchemas.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { PatientListQuerySchema } from '../../../domain/shared/querySchemas.js';
import { cacheMiddleware } from '../../../utils/cacheMiddleware.js';
import { buildDetailCacheKey, buildListCacheKey } from '../../../utils/cacheKeyBuilder.js';
import type { PaginatedResponse, SuccessResponse } from '../responses/apiResponse.js';
import type { Patient } from '../../../domain/patient/entities/Patient.js';

const PATIENT_LIST_CACHE_PREFIX = 'patients:list';
const PATIENT_DETAIL_CACHE_PREFIX = 'patients:detail';

const router: Router = Router();
const repository = new PatientRepository();
const service = new PatientService(repository);
const controller = new PatientController(service);

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: List all patients. By default, it only returns the active and monitoring patients.
 *     tags: [Patients]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página (1-indexado)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Cantidad de registros por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filtra por coincidencia en nombres o apellidos
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Activo, Seguimiento, Inactivo]
 *         description: Filtra por estado clínico (por defecto se incluyen solo pacientes Activo y Seguimiento)
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [MASCULINO, FEMENINO, OTRO, NO_ESPECIFICADO]
 *         description: Filtra por género
 *     responses:
 *       200:
 *         description: Lista paginada de pacientes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedPatients'
 */
router.get(
	'/',
	validateRequest({ query: PatientListQuerySchema }),
	cacheMiddleware<PaginatedResponse<Patient>>(600, {
		keyBuilder: (req) => buildListCacheKey(PATIENT_LIST_CACHE_PREFIX, req.query),
	}),
	controller.list
);

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePatient'
 *     responses:
 *       201:
 *         description: The patient was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PatientResponse'
 */
router.post('/', validateRequest({ body: CreatePatientSchema }), controller.create);

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get a patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The patient ID
 *     responses:
 *       200:
 *         description: The patient description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PatientResponse'
 *       404:
 *         description: The patient was not found
 */
router.get(
	'/:id',
	validateRequest({ params: PatientIdParamSchema }),
	cacheMiddleware<SuccessResponse<Patient>>(3600, {
		keyBuilder: (req) => buildDetailCacheKey(PATIENT_DETAIL_CACHE_PREFIX, req.params.id),
	}),
	controller.getById
);

/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Update a patient
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePatient'
 *     responses:
 *       200:
 *         description: The patient was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PatientResponse'
 *       404:
 *         description: The patient was not found
 */
router.put(
	'/:id',
	validateRequest({ params: PatientIdParamSchema, body: UpdatePatientSchema }),
	controller.update
);

/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Disable a patient (Soft Delete)
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The patient ID
 *     responses:
 *       200:
 *         description: The patient was successfully disabled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: The patient was not found
 *       400:
 *         description: Patient already disabled
 */
router.delete('/:id', validateRequest({ params: PatientIdParamSchema }), controller.delete);

export const patientRoutes = router;
export default router;
