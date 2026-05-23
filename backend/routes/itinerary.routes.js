
import { Router } from 'express';
import protect from '../middleware/auth.middleware.js';
import { generate, getAll, getOne, deleteOne, getByShareToken } from '../controllers/itinerary.controller.js';

const router = Router();

router.get('/share/:shareToken', getByShareToken);

router.post('/generate', protect, generate);
router.get('/', protect, getAll);
router.get('/:id', protect, getOne);
router.delete('/:id', protect, deleteOne);

export default router;