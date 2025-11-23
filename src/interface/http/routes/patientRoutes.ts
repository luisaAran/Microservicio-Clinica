import { Router } from 'express';
import { PatientController } from '../../../domain/patient/controllers/PatientController.js';
import { PatientService } from '../../../domain/patient/services/PatientService.js';
import { PatientRepository } from '../../../domain/patient/repositories/PatientRepository.js';
import { CreatePatientSchema, UpdatePatientSchema } from '../../../domain/patient/dtos/PatientDTO.js';
import { PatientIdParamSchema } from '../../../domain/shared/paramSchemas.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router:Router = Router();
const repository = new PatientRepository();
const service = new PatientService(repository);
const controller = new PatientController(service);

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
 *               $ref: '#/components/schemas/Patient'
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
 *               $ref: '#/components/schemas/Patient'
 *       404:
 *         description: The patient was not found
 */
router.get('/:id', validateRequest({ params: PatientIdParamSchema }), controller.getById);

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
 *               $ref: '#/components/schemas/Patient'
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
 *       204:
 *         description: The patient was successfully disabled
 *       404:
 *         description: The patient was not found
 */
router.delete('/:id', validateRequest({ params: PatientIdParamSchema }), controller.delete);

export default router;
