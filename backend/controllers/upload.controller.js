
import Upload from '../models/Upload.model.js';

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, data: null, message: 'No file uploaded' });
    }

    const { originalname, mimetype, size, path: filePath, filename } = req.file;

    const fileType = mimetype === 'application/pdf' ? 'pdf' : 'image';

    const upload = await Upload.create({
      userId: req.user._id,
      originalName: originalname,
      fileType,
      mimeType: mimetype,
      filePath,
      fileSize: size,
      status: 'uploaded',
    });

    res.status(201).json({
      success: true,
      data: { upload },
      message: 'File uploaded successfully',
    });
  } catch (err) {
    next(err);
  }
};