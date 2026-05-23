# Itiniq 

Upload a flight ticket or hotel booking — get a beautiful day-by-day travel itinerary in seconds, powered by AI.

**[Live Demo](https://itiniq.vercel.app/)** · **[API](https://travel-itinerary-server.onrender.com/)**

---

## What it does

You upload a PDF or image of your booking confirmation. Itiniq reads it, extracts your destination, dates, and flight details, then builds a complete itinerary with activities, dining recommendations, and sightseeing — all structured day by day. You can share any itinerary with a public link, no login required for the viewer.

## Stack

| | |
|---|---|
| Frontend | React + Vite, Tailwind CSS |
| Backend | Node.js, Express (MVC) |
| Database | MongoDB Atlas |
| Auth | JWT + bcrypt |
| AI | Google Gemini 1.5 Flash |
| File handling | Multer |

## Running locally

You'll need Node 18+, a MongoDB Atlas cluster, and a free Gemini API key from [aistudio.google.com](https://aistudio.google.com).

**Backend**
```bash
cd backend
npm install
cp .env.example .env
# fill in MONGODB_URI, JWT_SECRET, GEMINI_API_KEY
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
# create .env.local → VITE_API_URL=http://localhost:5000
npm run dev
```

## Environment variables

```env
PORT=5000
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=
CLIENT_URL=http://localhost:5173
```

```env
VITE_API_URL=http://localhost:5000
```

## API

| Method | Endpoint | Auth | |
|--------|----------|------|-|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login |
| POST | `/api/uploads` | ✓ | Upload document |
| POST | `/api/itinerary/generate` | ✓ | Generate itinerary |
| GET | `/api/itinerary` | ✓ | All user itineraries |
| GET | `/api/itinerary/:id` | ✓ | Single itinerary |
| DELETE | `/api/itinerary/:id` | ✓ | Delete itinerary |
| GET | `/api/itinerary/share/:token` | — | Public shared view |
