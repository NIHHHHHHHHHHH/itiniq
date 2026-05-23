
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);  // pdfjs needs CJS require in ESM context
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'; // legacy build avoids canvas/worker issues in Node
import Upload from '../models/Upload.model.js';
import Itinerary from '../models/Itinerary.model.js';
import { extractBookingData, generateItinerary } from '../services/gemini.service.js';

export const generate = async (req, res, next) => {
  try {
    const { uploadId } = req.body;
    if (!uploadId) {
      return res.status(400).json({ success: false, data: null, message: 'uploadId is required' });
    }

    const upload = await Upload.findOne({ _id: uploadId, userId: req.user._id });
    if (!upload) {
      return res.status(404).json({ success: false, data: null, message: 'Upload not found' });
    }

    upload.status = 'processing';
    await upload.save();

    let content;
    if (upload.fileType === 'pdf') {
        const buffer = fs.readFileSync(upload.filePath);
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
        const pdf = await loadingTask.promise;

        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const tokenizedText = await page.getTextContent();
          text += tokenizedText.items.map(item => item.str).join(' ') + '\n';
        }
        content = text
    } else {
      content = fs.readFileSync(upload.filePath).toString('base64');
    }

    
    const extractedData = await extractBookingData(upload.fileType, content);
    console.log('Extracted data:', JSON.stringify(extractedData, null, 2));

    upload.extractedData = extractedData;
    upload.status = 'completed';
    await upload.save();

    const itineraryData = await generateItinerary(extractedData);
    console.log('Itinerary generated for:', itineraryData.destination);

    const itinerary = await Itinerary.create({
      userId: req.user._id,
      uploadId: upload._id,
      title: itineraryData.title || `Trip to ${itineraryData.destination}`,
      destination: itineraryData.destination,
      startDate: itineraryData.startDate ? new Date(itineraryData.startDate) : null,
      endDate: itineraryData.endDate ? new Date(itineraryData.endDate) : null,
      summary: itineraryData.summary,
      days: itineraryData.days || [],
    });

    res.status(201).json({
      success: true,
      data: { itinerary },
      message: 'Itinerary generated successfully',
    });
  } catch (err) {
    // status update in catch so polling clients don't hang on 'processing'
    await Upload.findByIdAndUpdate(req.body.uploadId, { status: 'failed' });
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const itineraries = await Itinerary.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { itineraries }, message: 'Itineraries fetched' });
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findOne({ _id: req.params.id, userId: req.user._id });
    if (!itinerary) {
      return res.status(404).json({ success: false, data: null, message: 'Itinerary not found' });
    }
    res.status(200).json({ success: true, data: { itinerary }, message: 'Itinerary fetched' });
  } catch (err) {
    next(err);
  }
};

export const deleteOne = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!itinerary) {
      return res.status(404).json({ success: false, data: null, message: 'Itinerary not found' });
    }
    res.status(200).json({ success: true, data: null, message: 'Itinerary deleted' });
  } catch (err) {
    next(err);
  }
};

export const getByShareToken = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findOne({ shareToken: req.params.shareToken, isPublic: true });
    if (!itinerary) {
      return res.status(404).json({ success: false, data: null, message: 'Shared itinerary not found' });
    }
    res.status(200).json({ success: true, data: { itinerary }, message: 'Shared itinerary fetched' });
  } catch (err) {
    next(err);
  }
};