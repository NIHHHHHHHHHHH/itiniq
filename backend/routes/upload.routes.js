
import { Router } from 'express';
import protect from '../middleware/auth.middleware.js';
import upload from '../config/multer.js';
import { uploadFile } from '../controllers/upload.controller.js';

const router = Router();

router.post('/', protect, upload.single('file'), (err, req, res, next) => {
  if (err) return res.status(400).json({ success: false, data: null, message: err.message });
  next();
}, uploadFile);

export default router;