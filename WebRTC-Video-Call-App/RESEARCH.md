# WebRTC Video Calling Web App - Research & Planning Document

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [WebRTC Fundamentals](#webrtc-fundamentals)
3. [Architecture Overview](#architecture-overview)
4. [Technology Stack](#technology-stack)
5. [Core Components](#core-components)
6. [Signaling Server Options](#signaling-server-options)
7. [STUN/TURN Servers](#stunturn-servers)
8. [Security Considerations](#security-considerations)
9. [Implementation Roadmap](#implementation-roadmap)
10. [Code Structure Plan](#code-structure-plan)
11. [Testing Strategy](#testing-strategy)
12. [Deployment Considerations](#deployment-considerations)

---

## Executive Summary

This document outlines the planning and research for building a peer-to-peer video calling web application using WebRTC (Web Real-Time Communication). The app will enable real-time audio/video communication between users directly in their browsers without requiring plugins or downloads.

### Key Features (MVP)
- One-on-one video calls
- Audio/video mute controls
- Camera selection
- Call initiation and acceptance
- Connection status indicators
- Error handling and reconnection logic

### Advanced Features (Future)
- Multi-party calls (mesh or SFU architecture)
- Screen sharing
- Chat messaging
- Call recording
- Virtual backgrounds
- Noise cancellation

---

## WebRTC Fundamentals

### What is WebRTC?
WebRTC is an open-source project that enables real-time communication (RTC) directly between web browsers and mobile applications through simple APIs. It supports:
- **Peer-to-peer connections**: Direct browser-to-browser communication
- **Low latency**: Optimized for real-time communication
- **No plugins required**: Built into modern browsers
- **Encrypted by default**: All data is encrypted (DTLS/SRTP)

### Core WebRTC APIs

#### 1. MediaStream API
```javascript
// Access user's camera and microphone
const stream = await navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
});
```

#### 2. RTCPeerConnection
- Manages the peer-to-peer connection
- Handles connection establishment, maintenance, and termination
- Manages media streams and data channels

#### 3. RTCDataChannel
- Enables bidirectional data transfer between peers
- Can be used for chat, file transfer, gaming, etc.

### WebRTC Connection Flow

```
User A                           Signaling Server                      User B
   |                                   |                                  |
   |-- Create Offer ----------------->|                                  |
   |                                   |-- Forward Offer -------------->|
   |                                   |                                  |
   |                                   |<-- Send Answer -----------------|
   |<-- Receive Answer --------------|                                  |
   |                                   |                                  |
   |-- Exchange ICE Candidates ------->|-- Forward ICE Candidates ------>|
   |                                   |                                  |
   |================== P2P Connection Established =======================|
```

### Key Concepts

#### SDP (Session Description Protocol)
- Text-based format describing multimedia communication sessions
- Contains media capabilities, network information, and session parameters
- Two types: **Offer** (initiator) and **Answer** (receiver)

#### ICE (Interactive Connectivity Establishment)
- Protocol for finding the best path to connect peers
- Discovers all possible network addresses (candidates)
- Tests connectivity and selects the best route

#### NAT Traversal
- **STUN**: Helps discover public IP address behind NAT
- **TURN**: Relays traffic when direct connection fails (fallback)

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Side                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   React UI   │  │  WebRTC API  │  │ Media Stream │          │
│  │  Components  │◄─►│  Management │◄─►│   Handler    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                │                    │                  │
│         └────────────────┼────────────────────┘                  │
│                          │                                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                    WebSocket
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                   Signaling Server                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              WebSocket Handler                          │    │
│  │  - Room management                                      │    │
│  │  - Message routing (offer/answer/ICE)                   │    │
│  │  - User presence tracking                               │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │
              ┌────────────┴────────────┐
              │                         │
         ┌────▼────┐             ┌─────▼─────┐
         │  STUN   │             │   TURN    │
         │ Server  │             │  Server   │
         │(Public) │             │ (Coturn)  │
         └─────────┘             └───────────┘
```

### Component Architecture (React)

```
App
├── RoomSelector
│   ├── JoinRoomForm
│   └── ActiveRoomsList
├── VideoCall
│   ├── LocalVideo
│   ├── RemoteVideo
│   ├── Controls
│   │   ├── MuteToggle
│   │   ├── VideoToggle
│   │   ├── CameraSelect
│   │   └── EndCall
│   └── ConnectionState
├── Chat (optional)
└── Settings
```

---

## Technology Stack

### Frontend
| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **React 18+** | UI Framework | Component-based, large ecosystem |
| **TypeScript** | Type Safety | Better DX, fewer runtime errors |
| **Vite** | Build Tool | Fast HMR, modern bundling |
| **Tailwind CSS** | Styling | Rapid UI development |
| **Zustand/Context** | State Management | Simple global state |

### Backend (Signaling Server)
| Option | Pros | Cons |
|--------|------|------|
| **Node.js + Socket.IO** | Easy setup, great WS support | Additional dependency |
| **Node.js + ws** | Lightweight, native WS | More manual work |
| **Express + Socket.IO** | Full-featured, middleware support | Heavier footprint |
| **Python + FastAPI** | Async support, modern | Less common for signaling |

### Recommended Stack
```
Frontend: React + TypeScript + Vite + Tailwind CSS
Backend: Node.js + Express + Socket.IO
STUN: Google's public STUN servers (free)
TURN: Coturn (self-hosted) or Twilio (paid)
```

---

## Core Components

### 1. Media Handler Module
```typescript
class MediaHandler {
  private stream: MediaStream | null = null;
  
  async getMediaStream(constraints?: MediaStreamConstraints): Promise<MediaStream> {
    this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    return this.stream;
  }
  
  toggleAudio(enabled: boolean): void {
    this.stream?.getAudioTracks().forEach(track => {
      track.enabled = enabled;
    });
  }
  
  toggleVideo(enabled: boolean): void {
    this.stream?.getVideoTracks().forEach(track => {
      track.enabled = enabled;
    });
  }
  
  async switchCamera(deviceId: string): Promise<void> {
    // Stop current stream and get new one with selected camera
  }
  
  stop(): void {
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = null;
  }
}
```

### 2. Peer Connection Manager
```typescript
class PeerConnectionManager {
  private peerConnection: RTCPeerConnection | null = null;
  private signalingSocket: WebSocket | null = null;
  
  constructor(config: RTCConfiguration) {
    this.peerConnection = new RTCPeerConnection(config);
    this.setupPeerConnectionHandlers();
  }
  
  private setupPeerConnectionHandlers(): void {
    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignal({ type: 'ice-candidate', candidate: event.candidate });
      }
    };
    
    // Handle remote tracks
    this.peerConnection.ontrack = (event) => {
      // Add remote stream to UI
    };
    
    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      // Update UI based on connection state
    };
  }
  
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    const offer = await this.peerConnection!.createOffer();
    await this.peerConnection!.setLocalDescription(offer);
    return offer;
  }
  
  async createAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peerConnection!.createAnswer();
    await this.peerConnection!.setLocalDescription(answer);
    return answer;
  }
  
  async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(answer));
  }
  
  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    await this.peerConnection!.addIceCandidate(new RTCIceCandidate(candidate));
  }
  
  addTrack(stream: MediaStream): void {
    stream.getTracks().forEach(track => {
      this.peerConnection!.addTrack(track, stream);
    });
  }
  
  close(): void {
    this.peerConnection?.close();
    this.peerConnection = null;
  }
}
```

### 3. Signaling Client
```typescript
class SignalingClient {
  private socket: WebSocket | null = null;
  private roomId: string | null = null;
  
  connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(url);
      
      this.socket.onopen = () => resolve();
      this.socket.onerror = (error) => reject(error);
    });
  }
  
  joinRoom(roomId: string): void {
    this.roomId = roomId;
    this.send({ type: 'join-room', roomId });
  }
  
  sendOffer(offer: RTCSessionDescriptionInit): void {
    this.send({ type: 'offer', offer, roomId: this.roomId });
  }
  
  sendAnswer(answer: RTCSessionDescriptionInit): void {
    this.send({ type: 'answer', answer, roomId: this.roomId });
  }
  
  sendIceCandidate(candidate: RTCIceCandidateInit): void {
    this.send({ type: 'ice-candidate', candidate, roomId: this.roomId });
  }
  
  private send(message: object): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }
  
  onMessage(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.onmessage = (event) => callback(JSON.parse(event.data));
    }
  }
}
```

---

## Signaling Server Options

### Option 1: Socket.IO (Recommended for MVP)

**Server Setup:**
```javascript
// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const rooms = new Map(); // roomId -> Set of socketIds

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on('join-room', ({ roomId }) => {
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socket.id);
    
    // Notify others in room
    socket.to(roomId).emit('user-joined', { userId: socket.id });
    
    // Send existing users to new user
    const users = Array.from(rooms.get(roomId)).filter(id => id !== socket.id);
    socket.emit('existing-users', { users });
  });
  
  socket.on('offer', ({ offer, roomId }) => {
    socket.to(roomId).emit('offer', { offer, from: socket.id });
  });
  
  socket.on('answer', ({ answer, roomId }) => {
    socket.to(roomId).emit('answer', { answer, from: socket.id });
  });
  
  socket.on('ice-candidate', ({ candidate, roomId }) => {
    socket.to(roomId).emit('ice-candidate', { candidate, from: socket.id });
  });
  
  socket.on('disconnect', () => {
    rooms.forEach((users, roomId) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        socket.to(roomId).emit('user-left', { userId: socket.id });
        
        if (users.size === 0) {
          rooms.delete(roomId);
        }
      }
    });
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log('Signaling server running on port 3001');
});
```

### Option 2: Pure WebSocket (ws library)

Lighter weight but requires more manual room management.

---

## STUN/TURN Servers

### STUN Servers (Free)

Google provides free public STUN servers:
```javascript
const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ]
};
```

### TURN Servers

#### Self-Hosted (Coturn)
- Open-source TURN server
- Requires server infrastructure
- More control and cost-effective at scale

**Docker Setup:**
```yaml
# docker-compose.yml
version: '3'
services:
  coturn:
    image: coturn/coturn
    ports:
      - "3478:3478"
      - "3478:3478/udp"
      - "5349:5349"
      - "5349:5349/udp"
      - "49152-65535:49152-65535/udp"
    environment:
      - LT_USERNAME=myuser
      - LT_PASSWORD=mypassword
      - LT_REALM=myrealm
    command: -n --log-file=stdout --listening-port=3478 --tls-listening-port=5349
```

#### Managed Services (Paid)
| Provider | Pricing | Notes |
|----------|---------|-------|
| **Twilio** | $0.004/GB | Reliable, easy integration |
| **Xirsys** | Custom pricing | Enterprise-focused |
| **Metered.ca** | Free tier available | Good for testing |

### Recommended Approach
- **Development**: Use Google's free STUN servers
- **Production**: Start with Twilio TURN, migrate to Coturn at scale

---

## Security Considerations

### 1. Encryption
- ✅ WebRTC encrypts all media by default (SRTP)
- ✅ Data channels use DTLS encryption
- ⚠️ Signaling channel needs HTTPS/WSS

### 2. Authentication & Authorization
```javascript
// JWT-based room access
const jwt = require('jsonwebtoken');

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication required'));
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Invalid token'));
    }
    socket.userId = decoded.userId;
    next();
  });
});
```

### 3. Input Validation
- Validate all signaling messages
- Sanitize room IDs
- Rate limiting to prevent abuse

### 4. Privacy
- Request only necessary permissions
- Clear indication when camera/mic is active
- Option to blur/virtual background

### 5. Best Practices
```javascript
// Secure RTC configuration
const secureConfig = {
  iceServers: [/* ... */],
  iceTransportPolicy: 'all', // or 'relay' for TURN-only
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require',
  sdpSemantics: 'unified-plan'
};

// Content Security Policy headers
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "media-src 'self' blob: mediastream:; " +
    "connect-src 'self' wss: ws:;");
  next();
});
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup (React + TypeScript + Vite)
- [ ] Basic UI components
- [ ] Media stream acquisition
- [ ] Local video preview

### Phase 2: Core WebRTC (Week 2-3)
- [ ] Signaling server setup
- [ ] Peer connection establishment
- [ ] Offer/Answer exchange
- [ ] ICE candidate handling
- [ ] Remote video display

### Phase 3: Call Controls (Week 3-4)
- [ ] Mute/unmute audio
- [ ] Enable/disable video
- [ ] Camera selection
- [ ] Call end functionality
- [ ] Connection status indicators

### Phase 4: Polish & Testing (Week 4-5)
- [ ] Error handling
- [ ] Reconnection logic
- [ ] Responsive design
- [ ] Cross-browser testing
- [ ] Performance optimization

### Phase 5: Deployment (Week 5-6)
- [ ] Production build
- [ ] Server deployment
- [ ] TURN server setup
- [ ] SSL/TLS configuration
- [ ] Monitoring & logging

---

## Code Structure Plan

```
video-call-app/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── VideoCall/
│   │   │   │   ├── VideoCall.tsx
│   │   │   │   ├── LocalVideo.tsx
│   │   │   │   ├── RemoteVideo.tsx
│   │   │   │   └── Controls/
│   │   │   │       ├── MuteButton.tsx
│   │   │   │       ├── VideoButton.tsx
│   │   │   │       ├── CameraSelect.tsx
│   │   │   │       └── EndCallButton.tsx
│   │   │   ├── RoomSelector/
│   │   │   │   ├── RoomSelector.tsx
│   │   │   │   └── JoinRoomForm.tsx
│   │   │   └── UI/
│   │   │       ├── Button.tsx
│   │   │       ├── Modal.tsx
│   │   │       └── StatusIndicator.tsx
│   │   ├── hooks/
│   │   │   ├── useMediaStream.ts
│   │   │   ├── usePeerConnection.ts
│   │   │   ├── useSignaling.ts
│   │   │   └── useRoom.ts
│   │   ├── services/
│   │   │   ├── mediaHandler.ts
│   │   │   ├── peerConnection.ts
│   │   │   └── signalingClient.ts
│   │   ├── store/
│   │   │   └── callStore.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── helpers.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/
│   ├── src/
│   │   ├── index.ts
│   │   ├── signaling.ts
│   │   └── rooms.ts
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml (for TURN server)
├── README.md
└── .env.example
```

---

## Testing Strategy

### Unit Tests
```typescript
// __tests__/mediaHandler.test.ts
import { MediaHandler } from '../services/mediaHandler';

describe('MediaHandler', () => {
  it('should get user media stream', async () => {
    // Mock navigator.mediaDevices.getUserMedia
  });
  
  it('should toggle audio track', () => {
    // Test audio toggle functionality
  });
});
```

### Integration Tests
- Test complete call flow between two clients
- Test reconnection scenarios
- Test various network conditions

### Manual Testing Checklist
- [ ] Chrome to Chrome
- [ ] Firefox to Firefox
- [ ] Safari to Safari
- [ ] Cross-browser calls
- [ ] Mobile browsers
- [ ] Network switching (WiFi to cellular)
- [ ] Firewall/NAT scenarios

---

## Deployment Considerations

### Frontend Deployment
- **Vercel/Netlify**: Easy React deployment
- **AWS S3 + CloudFront**: Custom CDN setup
- **Docker**: Containerized deployment

### Backend Deployment
- **Heroku/Railway**: Quick deployment
- **AWS EC2/ECS**: Full control
- **DigitalOcean**: Cost-effective VPS

### Environment Variables
```bash
# .env.example
# Client
VITE_SIGNALING_SERVER_URL=wss://your-domain.com
VITE_TURN_USERNAME=your-turn-username
VITE_TURN_PASSWORD=your-turn-password

# Server
PORT=3001
CLIENT_URL=https://your-domain.com
JWT_SECRET=your-secret-key
TURN_SERVER_URL=turn:your-turn-server:3478
TURN_USERNAME=myuser
TURN_PASSWORD=mypassword
```

### SSL/TLS Requirements
WebRTC requires secure contexts (HTTPS/WSS) except for localhost:
```nginx
# Nginx configuration example
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

---

## Browser Compatibility

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | 70+ | ✅ Full |
| Firefox | 70+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 79+ | ✅ Full |
| Opera | 60+ | ✅ Full |
| iOS Safari | 14+ | ✅ Full |
| Android Chrome | 70+ | ✅ Full |

---

## Potential Challenges & Solutions

### Challenge 1: NAT/Firewall Traversal
**Solution**: Implement proper ICE with STUN/TURN servers

### Challenge 2: Multiple Participants
**Solution**: 
- Mesh topology (2-4 participants)
- SFU (Selective Forwarding Unit) for larger calls
- Consider mediasoup or Janus for SFU

### Challenge 3: Network Quality
**Solution**:
- Implement adaptive bitrate
- Monitor connection quality (getStats API)
- Graceful degradation

### Challenge 4: Mobile Battery Drain
**Solution**:
- Optimize video resolution
- Implement video pause when not visible
- Use efficient codecs (VP8/VP9, H.264)

---

## Resources & References

### Documentation
- [WebRTC Official Docs](https://webrtc.org/)
- [MDN WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Socket.IO Documentation](https://socket.io/docs/)

### Tutorials
- [WebRTC for the Curious](https://webrtcforthecurious.com/)
- [MDN WebRTC Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Tutorial)

### Libraries
- [simple-peer](https://github.com/feross/simple-peer): Simplified WebRTC
- [mediasoup](https://mediasoup.org/): SFU for multi-party
- [Janus Gateway](https://janus.conf.meetecho.com/): WebRTC server

### Tools
- [WebRTC Internals](chrome://webrtc-internals): Chrome debugging
- [about:webrtc](about:webrtc): Firefox debugging

---

## Next Steps

1. **Create project structure** following the code organization plan
2. **Set up development environment** with React + TypeScript
3. **Implement basic signaling server** with Socket.IO
4. **Build media handler** for local stream acquisition
5. **Implement peer connection** logic
6. **Add call controls** and UI polish
7. **Test across browsers** and network conditions
8. **Deploy** with proper SSL/TLS and TURN servers

---

*Document created for WebRTC Video Calling Web App planning and research*
