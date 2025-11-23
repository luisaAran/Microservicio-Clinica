import { Router } from 'express';
import { TumorTypeController } from '../../../domain/tumor-type/controllers/TumorTypeController.js';
import { TumorTypeService } from '../../../domain/tumor-type/services/TumorTypeService.js';
import { TumorTypeRepository } from '../../../domain/tumor-type/repositories/TumorTypeRepository.js';
import { CreateTumorTypeSchema, UpdateTumorTypeSchema } from '../../../domain/tumor-type/dtos/TumorTypeDTO.js';
import { TumorTypeIdParamSchema } from '../../../domain/shared/paramSchemas.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router:Router = Router();
const repository = new TumorTypeRepository();
const service = new TumorTypeService(repository);
const controller = new TumorTypeController(service);

/**
 * @swagger
 * /tumor-types:
 *   post:
 *     summary: Create a new tumor type
 *     tags: [TumorTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTumorType'
 *     responses:
 *       201:
 *         description: The tumor type was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TumorType'
 */
router.post('/', validateRequest({ body: CreateTumorTypeSchema }), controller.create);

/**
 * @swagger
 * /tumor-types:
 *   get:
 *     summary: List all tumor types
 *     tags: [TumorTypes]
 *     responses:
 *       200:
 *         description: The list of tumor types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TumorType'
 */
router.get('/', controller.list);

/**
 * @swagger
 * /tumor-types/{id}:
 *   put:
 *     summary: Update a tumor type
 *     tags: [TumorTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The tumor type ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTumorType'
 *     responses:
 *       200:
 *         description: The tumor type was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TumorType'
 *       404:
 *         description: The tumor type was not found
 */
router.put(
	'/:id',
	validateRequest({ params: TumorTypeIdParamSchema, body: UpdateTumorTypeSchema }),
	controller.update
);

export default router;
