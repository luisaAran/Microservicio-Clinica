import { Router } from 'express';
import { TumorTypeController } from '../../../domain/tumor-type/controllers/TumorTypeController.js';
import { TumorTypeService } from '../../../domain/tumor-type/services/TumorTypeService.js';
import { TumorTypeRepository } from '../../../domain/tumor-type/repositories/TumorTypeRepository.js';
import { CreateTumorTypeSchema, UpdateTumorTypeSchema } from '../../../domain/tumor-type/dtos/TumorTypeDTO.js';
import { TumorTypeIdParamSchema } from '../../../domain/shared/paramSchemas.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { TumorTypeListQuerySchema } from '../../../domain/shared/querySchemas.js';

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
 *               $ref: '#/components/schemas/TumorTypeResponse'
 */
router.post('/', validateRequest({ body: CreateTumorTypeSchema }), controller.create);

/**
 * @swagger
 * /tumor-types:
 *   get:
 *     summary: List tumor types with optional filters
 *     tags: [TumorTypes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Numero de pagina (1-indexado)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Cantidad de registros por pagina
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filtra por nombre de tumor
 *       - in: query
 *         name: systemAffected
 *         schema:
 *           type: string
 *         description: Filtra por sistema afectado
 *     responses:
 *       200:
 *         description: Lista paginada de tipos de tumor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedTumorTypes'
 */
router.get('/', validateRequest({ query: TumorTypeListQuerySchema }), controller.list);

/**
 * @swagger
 * /tumor-types/{id}:
 *   get:
 *     summary: Get tumor type by id
 *     tags: [TumorTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tumor type ID
 *     responses:
 *       200:
 *         description: Tumor type found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TumorTypeResponse'
 *       404:
 *         description: The tumor type was not found
 */
router.get('/:id', validateRequest({ params: TumorTypeIdParamSchema }), controller.getById);

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
 *               $ref: '#/components/schemas/TumorTypeResponse'
 *       404:
 *         description: The tumor type was not found
 */
router.put(
	'/:id',
	validateRequest({ params: TumorTypeIdParamSchema, body: UpdateTumorTypeSchema }),
	controller.update
);

/**
 * @swagger
 * /tumor-types/{id}:
 *   delete:
 *     summary: Soft delete a tumor type
 *     tags: [TumorTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The tumor type ID
 *     responses:
 *       200:
 *         description: The tumor type was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: The tumor type was not found
 */
router.delete('/:id', validateRequest({ params: TumorTypeIdParamSchema }), controller.delete);

export const tumorTypeRoutes = router;
export default router;
