import { GoogleGenerativeAI } from '@google/generative-ai';

const getModel = () => {
   // re-instantiated per call so API key is read at runtime, not module load
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
};


export const extractBookingData = async (fileType, content) => {
  try {
    let result;
    const model = getModel();

    if (fileType === 'pdf') {
      const prompt = `Extract travel booking information from the following text.
Return ONLY a valid JSON object. No markdown. No backticks. No explanation.
JSON format:
{
  "passengerName": "",
  "origin": "",
  "destination": "",
  "departureDate": "",
  "returnDate": "",
  "flightNumber": "",
  "airline": "",
  "hotel": "",
  "hotelCheckIn": "",
  "hotelCheckOut": "",
  "bookingReference": "",
  "totalDays": 0
}
If a field is not found, set it to null.
Text: ${content}`;

      result = await model.generateContent(prompt);
    } else {
      const prompt = `Extract travel booking information from this image.
Return ONLY a valid JSON object. No markdown. No backticks. No explanation.
JSON format:
{
  "passengerName": "",
  "origin": "",
  "destination": "",
  "departureDate": "",
  "returnDate": "",
  "flightNumber": "",
  "airline": "",
  "hotel": "",
  "hotelCheckIn": "",
  "hotelCheckOut": "",
  "bookingReference": "",
  "totalDays": 0
}
If a field is not found, set it to null.`;

      result = await model.generateContent([
        prompt,
        { inlineData: { mimeType: 'image/jpeg', data: content } },
      ]);
    }

    const text = result.response.text().trim();
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Gemini extraction failed: ${err.message}`);
  }
};


export const generateItinerary = async (extractedData) => {
  try {
    const model = getModel();

    const prompt = `Generate a detailed day-by-day travel itinerary based on this booking data.
Return ONLY a valid JSON object. No markdown. No backticks. No explanation.
JSON format:
{
  "title": "",
  "destination": "",
  "startDate": "",
  "endDate": "",
  "summary": "",
  "days": [
    {
      "day": 1,
      "date": "",
      "title": "",
      "activities": [
        {
          "time": "",
          "title": "",
          "description": "",
          "type": "",
          "location": ""
        }
      ]
    }
  ]
}
Activity types must be one of: travel, accommodation, sightseeing, dining, leisure.
Generate at least 3 activities per day. Make descriptions vivid and helpful.
Booking data: ${JSON.stringify(extractedData)}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/```json|```/g, '').trim();   // Gemini sometimes wraps response in markdown fences despite prompt instructions
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Gemini itinerary generation failed: ${err.message}`);
  }
};