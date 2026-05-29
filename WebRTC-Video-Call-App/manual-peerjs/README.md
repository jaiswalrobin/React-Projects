# Manual WebRTC Video Call with PeerJS (No Backend)

A pure frontend-only video calling application using **PeerJS** for WebRTC abstraction and **manual signaling** via copy-paste. Zero backend, zero cost, 100% client-side.

## 🎯 How It Works

Instead of a signaling server, users manually exchange connection data:

1. **Caller** generates an offer → Copies the ID
2. **Callee** pastes the ID → Generates answer
3. **Connection established** → Video call begins

## 🚀 Quick Start

### Option 1: Use the Demo
Visit the deployed version (if available) or run locally:

```bash
npm install
npm run dev
```

Open two browser windows/tabs and follow the manual connection flow.

### Option 2: Single HTML File
No build step required! Just open `index.html` in your browser.

## 📋 Features

✅ **Core Functionality**
- One-on-one HD video calls
- Audio/Video mute controls
- Camera selection (switch between devices)
- Real-time connection status
- Local & remote video streams

✅ **Zero Infrastructure**
- No backend server needed
- No database
- No authentication
- No hosting costs
- Works entirely in the browser

✅ **Privacy First**
- Media never touches any server
- Peer-to-peer encrypted (DTLS-SRTP)
- No data stored
- Session ends when tab closes

## ⚠️ Limitations (Important!)

| Limitation | Impact | Workaround |
|------------|--------|------------|
| **Manual Signaling** | Users must copy/paste IDs | Share via WhatsApp, email, etc. |
| **No Call Notifications** | Callee won't know someone's calling | Coordinate externally |
| **One-Way Initiation** | Only one person can initiate | Decide who calls whom beforehand |
| **No Room Concept** | Direct peer-to-peer only | Use unique PeerJS IDs |
| **NAT/Firewall Issues** | May fail on strict networks | Requires STUN/TURN (included) |
| **Not Mobile-Friendly** | Copy/paste is clunky on mobile | Use desktop for best experience |

## 🛠️ Technical Stack

- **Framework**: Vanilla JavaScript (no framework required)
- **WebRTC Library**: PeerJS (v1.5+)
- **STUN Server**: Google's public STUN (`stun:stun.l.google.com:19302`)
- **TURN Server**: Optional (add your own for production)
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Heroicons (via CDN)

## 📖 Usage Guide

### Step 1: Generate Your ID (Caller)
1. Open the app in your browser
2. Click **"Generate My ID"**
3. Wait for your unique PeerJS ID to appear
4. Click **"Copy ID"** and share it with the callee (via WhatsApp, email, etc.)
5. Wait for them to connect

### Step 2: Connect to Caller (Callee)
1. Open the app in your browser
2. Paste the caller's ID into the **"Enter Partner's ID"** field
3. Click **"Connect"**
4. Accept camera/microphone permissions
5. Video call starts automatically!

### Step 3: During the Call
- 🎤 **Mute/Unmute**: Toggle your microphone
- 📹 **Video On/Off**: Toggle your camera
- 🔄 **Switch Camera**: Choose between available cameras
- ❌ **End Call**: Disconnect and reset

## 🔧 Configuration

### Using Custom STUN/TURN Servers

Edit the `peerjsConfig` in `app.js`:

```javascript
const peerjsConfig = {
  debug: 2,
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      {
        urls: 'turn:your-turn-server.com',
        username: 'your-username',
        credential: 'your-password'
      }
    ]
  }
};
```

**Free TURN Options:**
- Twilio Network Traversal Service (free trial, then paid)
- Self-hosted Coturn (free, requires server)
- OpenRelay (limited free tier)

## 🏗️ Architecture

```
┌─────────────┐                    ┌─────────────┐
│   Caller    │                    │   Callee    │
│   Browser   │                    │   Browser   │
│             │                    │             │
│  [PeerJS]   │◄── Manual Copy ───►│  [PeerJS]   │
│     ID:     │     /Paste ID      │     ID:     │
│   abc123    │                    │   xyz789    │
│             │                    │             │
│  [WebRTC]   │◄──── P2P Media ───►│  [WebRTC]   │
│   (SRTP)    │     Encrypted      │   (SRTP)    │
└─────────────┘                    └─────────────┘
       ▲                                  ▲
       │                                  │
       └────────── No Server ─────────────┘
```

**Key Points:**
- PeerJS cloud handles initial peer discovery (free)
- All media is direct peer-to-peer
- Signaling data exchanged manually by users
- No persistent connections or state

## 🔒 Security Considerations

### What's Secure ✅
- Media streams encrypted with SRTP
- DTLS for key exchange
- No server can intercept media
- Sessions are ephemeral

### What's Not Secure ⚠️
- PeerJS IDs can be guessed (use long random IDs)
- No authentication (anyone with ID can connect)
- Man-in-the-middle possible if ID intercepted
- No encryption for signaling data (copy/paste channel dependent)

### Best Practices
1. Share IDs over secure channels (Signal, WhatsApp, etc.)
2. Use long, random PeerJS IDs (default behavior)
3. Verify partner identity before accepting
4. Don't reuse IDs across sessions
5. Close tab after call ends

## 🌐 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 80+ | ✅ Full Support |
| Firefox | 75+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 80+ | ✅ Full Support |
| Opera | 67+ | ✅ Full Support |

**Mobile Support:**
- iOS Safari: ⚠️ Limited (copy/paste difficult)
- Chrome Android: ⚠️ Limited (copy/paste clunky)
- Desktop: ✅ Recommended

## 🧪 Testing Checklist

- [ ] Generate ID successfully
- [ ] Copy ID to clipboard
- [ ] Paste ID in second browser
- [ ] Establish video connection
- [ ] Test audio mute/unmute
- [ ] Test video on/off
- [ ] Switch between cameras
- [ ] End call and reset
- [ ] Test on different browsers
- [ ] Test on different networks (WiFi, 4G)
- [ ] Test reconnection after network drop

## 📦 Deployment Options

### Option 1: GitHub Pages (Free)
```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# Enable GitHub Pages in repo settings
```

### Option 2: Netlify Drop (Free)
1. Drag & drop folder to [Netlify Drop](https://app.netlify.com/drop)
2. Get instant HTTPS URL
3. Share link with users

### Option 3: Vercel (Free)
```bash
npm i -g vercel
vercel --prod
```

### Option 4: Local Network
Just open `index.html` in browser - no server needed!

## 🐛 Troubleshooting

### "Failed to get camera/microphone"
- Check browser permissions
- Ensure HTTPS (or localhost)
- Try different browser

### "Connection failed" or "Ice connection failed"
- Check firewall settings
- Try different network
- Add TURN server configuration
- Ensure both users have internet

### "ID not found"
- PeerJS ID expired (generate new one)
- Typo in ID (copy/paste carefully)
- PeerJS cloud temporarily down

### "Black screen" or "No video"
- Check camera permissions
- Ensure camera not used by another app
- Try switching cameras

### "Echo or feedback"
- Both users using speakers (use headphones)
- Microphone too close to speakers
- Enable echo cancellation in OS settings

## 💡 Advanced Usage

### Custom PeerJS Server (Optional)
For better reliability, host your own PeerJS server:

```bash
npm install -g peer
npx peerjs --port 9000
```

Update config:
```javascript
const peerjsConfig = {
  host: 'your-server.com',
  port: 9000,
  path: '/myapp'
};
```

### Adding Data Channels
Send text messages during call:

```javascript
// Send message
conn.send({ type: 'chat', message: 'Hello!' });

// Receive message
conn.on('data', (data) => {
  console.log('Received:', data);
});
```

### Screen Sharing
```javascript
navigator.mediaDevices.getDisplayMedia({ video: true })
  .then(stream => {
    // Replace video track
    const videoTrack = stream.getVideoTracks()[0];
    sender.replaceTrack(videoTrack);
  });
```

## 📚 Resources

- [PeerJS Documentation](https://peerjs.com/docs/)
- [WebRTC Basics](https://webrtc.org/getting-started/overview)
- [MDN WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Google STUN/TURN Servers](https://github.com/prism-media/webrtc-stun-turn-list)
- [Self-hosted Coturn](https://github.com/coturn/coturn)

## 📄 License

MIT License - Free to use, modify, and distribute.

## 🙏 Credits

- [PeerJS](https://github.com/peers/peerjs) - WebRTC abstraction
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Heroicons](https://heroicons.com/) - Icons
- Google - Public STUN servers

---

**Built with ❤️ for education and experimentation**

*Note: This is a learning project. For production applications, use a proper backend or managed service like Daily.co, Agora, or Twilio Video.*
