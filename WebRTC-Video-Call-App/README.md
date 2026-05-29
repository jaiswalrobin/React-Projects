# WebRTC Video Call App - Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Edge, Safari)

## Project Structure
```
WebRTC-Video-Call-App/
├── client/          # React frontend
├── server/          # Node.js signaling server
├── RESEARCH.md      # Detailed research document
└── README.md        # This file
```

## Quick Setup (Development)

### 1. Clone/Navigate to Project
```bash
cd WebRTC-Video-Call-App
```

### 2. Setup Server
```bash
cd server
npm install
npm run dev
# Server runs on http://localhost:3001
```

### 3. Setup Client (in new terminal)
```bash
cd client
npm install
npm run dev
# Client runs on http://localhost:5173
```

### 4. Test the Application
1. Open two browser tabs/windows
2. Navigate to `http://localhost:5173`
3. Enter a room name (e.g., "test-room") in both tabs
4. Join the room
5. Video call should establish between the two tabs

## Key Technologies

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Socket.IO** - WebSocket library for signaling

### WebRTC
- **RTCPeerConnection** - Peer-to-peer connections
- **MediaStream API** - Camera/microphone access
- **STUN** - NAT traversal (Google's free servers)
- **TURN** - Relay server (for production)

## Core Concepts

### WebRTC Connection Flow
1. **Get Media**: Access user's camera and microphone
2. **Create Offer**: Initiating peer creates an SDP offer
3. **Signal Offer**: Send offer through signaling server
4. **Create Answer**: Receiving peer creates SDP answer
5. **Signal Answer**: Send answer back through signaling server
6. **Exchange ICE Candidates**: Share network connection info
7. **P2P Connection**: Direct connection established

### Signaling Server Role
- Routes messages between peers (offer, answer, ICE candidates)
- Manages room membership
- Does NOT handle media streams (pure P2P)

## Configuration

### Environment Variables

#### Client (.env)
```bash
VITE_SIGNALING_SERVER_URL=ws://localhost:3001
```

#### Server (.env)
```bash
PORT=3001
CLIENT_URL=http://localhost:5173
```

## Common Issues & Solutions

### Issue: Camera/Mic Permission Denied
**Solution**: Ensure you're running on localhost or HTTPS. WebRTC requires secure contexts.

### Issue: Connection Fails Between Different Networks
**Solution**: Add TURN servers to ICE configuration for production.

### Issue: One-Way Audio/Video
**Solution**: Check that both peers are sending ICE candidates and properly adding tracks.

### Issue: Black Screen
**Solution**: 
- Verify camera permissions granted
- Check if video track is enabled
- Ensure proper stream attachment to video element

## Production Checklist

- [ ] Set up HTTPS/WSS
- [ ] Configure TURN servers (Twilio or Coturn)
- [ ] Add authentication (JWT)
- [ ] Implement rate limiting
- [ ] Add monitoring and logging
- [ ] Set up proper error handling
- [ ] Test across different browsers and networks
- [ ] Optimize video quality/bandwidth

## Next Steps

After reviewing this guide and RESEARCH.md:

1. **Start Implementation**: Begin with Phase 1 of the roadmap
2. **Build MVP**: Focus on one-on-one calls first
3. **Test Early**: Test with real devices and networks
4. **Iterate**: Add features based on testing feedback

## Resources

- [RESEARCH.md](./RESEARCH.md) - Detailed planning document
- [WebRTC Official Docs](https://webrtc.org/)
- [MDN WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Socket.IO Docs](https://socket.io/docs/)

## License

MIT

---

*Ready to build? Let's get started!* 🚀
