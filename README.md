# Wartalab - Hybrid Chat Application

Wartalab is a hybrid chat app with:

- Signup and login
- One-to-one chat
- Text messages
- Image messages
- Chat background customization
- Chat font style customization
- Emoji/sticker sending
- Online real-time messaging via Socket.io
- Offline local WiFi peer-to-peer messaging (WebRTC data channel, manual signaling)

## Project Structure

```bash
wartalab-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── socket/
│   │   └── server.js
│   ├── uploads/
│   ├── .env.example
│   └── package.json
├── mobile/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── navigation/
│   │   ├── screens/
│   │   ├── services/
│   │   └── types/
│   ├── App.js
│   ├── babel.config.js
│   └── package.json
├── package.json
├── server.js
└── README.md
```

## Tech Stack

- **Frontend:** React Native (Expo)
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Realtime:** Socket.io
- **Offline P2P:** WebRTC data channel (`react-native-webrtc`)

## 1) Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs by default on `http://localhost:5000`.

### Required env variables

- `PORT` - default `5000`
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - secret for auth token signing

## 2) Mobile Setup

```bash
cd mobile
npm install
```

Update API URL in `mobile/src/services/api.js`:

```js
const API_BASE_URL = 'http://YOUR_BACKEND_IP:5000/api';
```

Run app:

```bash
npm start
```

> For real devices, use your machine LAN IP, not `localhost`.

## Offline P2P (Local WiFi) Notes

The app includes an **Offline WiFi P2P** screen that uses WebRTC data channel:

1. Device A generates offer.
2. Device B pastes offer and generates answer.
3. Device A pastes answer.
4. Exchange ICE candidates manually (copy/QR).
5. Send offline messages directly peer-to-peer.

This mode does not depend on backend message relay after connection establishment.

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Users
- `GET /api/users`

### Chat
- `GET /api/chat/:peerId` (conversation history)
- `POST /api/chat/send` (supports `multipart/form-data` for image)

## Socket Events

- Client -> Server:
  - `presence:online`
  - `chat:send`
- Server -> Client:
  - `presence:update`
  - `chat:message`
  - `chat:delivered`
  - `chat:error`

## Root Scripts

From repository root:

```bash
npm run dev:backend
npm run start:mobile
```

## Production Considerations

- Add message status (sent/delivered/read)
- Add secure file storage (S3/GCS)
- Add E2E encryption for both online and offline channels
- Add robust offline queue/sync conflict handling
- Replace manual P2P signaling with BLE/local QR bootstrap
