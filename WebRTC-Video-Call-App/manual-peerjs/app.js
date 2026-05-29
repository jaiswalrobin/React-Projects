// Manual WebRTC Video Call App with PeerJS
// Zero backend - uses manual copy/paste signaling

class VideoCallApp {
    constructor() {
        this.peer = null;
        this.localStream = null;
        this.remoteStream = null;
        this.currentCall = null;
        this.isInitiator = false;
        this.devices = [];
        
        // DOM Elements
        this.elements = {
            generateBtn: document.getElementById('generate-btn'),
            copyBtn: document.getElementById('copy-btn'),
            connectBtn: document.getElementById('connect-btn'),
            myIdDisplay: document.getElementById('my-id-display'),
            myId: document.getElementById('my-id'),
            partnerIdInput: document.getElementById('partner-id-input'),
            localVideo: document.getElementById('local-video'),
            remoteVideo: document.getElementById('remote-video'),
            videoPlaceholder: document.getElementById('video-placeholder'),
            mediaControls: document.getElementById('media-controls'),
            muteBtn: document.getElementById('mute-btn'),
            videoBtn: document.getElementById('video-btn'),
            switchCameraBtn: document.getElementById('switch-camera-btn'),
            endCallBtn: document.getElementById('end-call-btn'),
            statusIndicator: document.getElementById('status-indicator'),
            statusText: document.getElementById('status-text'),
            partnerInfo: document.getElementById('partner-info'),
            partnerId: document.getElementById('partner-id')
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateStatus('disconnected', 'Ready to start');
    }
    
    setupEventListeners() {
        this.elements.generateBtn.addEventListener('click', () => this.generateId());
        this.elements.copyBtn.addEventListener('click', () => this.copyId());
        this.elements.connectBtn.addEventListener('click', () => this.connectToPeer());
        this.elements.muteBtn.addEventListener('click', () => this.toggleMute());
        this.elements.videoBtn.addEventListener('click', () => this.toggleVideo());
        this.elements.switchCameraBtn.addEventListener('click', () => this.switchCamera());
        this.elements.endCallBtn.addEventListener('click', () => this.endCall());
    }
    
    async generateId() {
        try {
            this.updateStatus('connecting', 'Initializing...');
            this.elements.generateBtn.disabled = true;
            this.elements.generateBtn.innerHTML = '<div class="spinner inline-block"></div> Generating...';
            
            // Get local media first
            await this.getLocalMedia();
            
            // Create PeerJS instance with random ID
            this.peer = new Peer(null, {
                debug: 2,
                config: {
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:stun1.l.google.com:19302' }
                    ]
                }
            });
            
            this.peer.on('open', (id) => {
                console.log('My peer ID is: ' + id);
                this.elements.myId.textContent = id;
                this.elements.myIdDisplay.classList.remove('hidden');
                this.elements.copyBtn.disabled = false;
                this.updateStatus('ready', 'Waiting for connection...');
                this.elements.generateBtn.innerHTML = '✓ ID Generated';
                this.elements.generateBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                
                // Listen for incoming connections
                this.peer.on('call', (call) => this.handleIncomingCall(call));
            });
            
            this.peer.on('error', (err) => {
                console.error('PeerJS error:', err);
                this.showError('Failed to generate ID: ' + err.type);
                this.resetGenerateButton();
            });
            
        } catch (error) {
            console.error('Error generating ID:', error);
            this.showError('Failed to access camera/microphone: ' + error.message);
            this.resetGenerateButton();
        }
    }
    
    resetGenerateButton() {
        this.elements.generateBtn.disabled = false;
        this.elements.generateBtn.innerHTML = 'Generate My ID';
        this.elements.generateBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
    }
    
    async getLocalMedia() {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            
            this.elements.localVideo.srcObject = this.localStream;
            this.elements.videoPlaceholder.classList.add('hidden');
            
            // Get available devices
            await this.enumerateDevices();
            
        } catch (error) {
            throw new Error(`Media access denied: ${error.message}`);
        }
    }
    
    async enumerateDevices() {
        const devices = await navigator.mediaDevices.enumerateDevices();
        this.devices = devices.filter(device => device.kind === 'videoinput');
        console.log('Available cameras:', this.devices);
    }
    
    copyId() {
        const id = this.elements.myId.textContent;
        navigator.clipboard.writeText(id).then(() => {
            const originalText = this.elements.copyBtn.innerHTML;
            this.elements.copyBtn.innerHTML = '✓ Copied!';
            setTimeout(() => {
                this.elements.copyBtn.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            this.showError('Failed to copy ID: ' + err);
        });
    }
    
    connectToPeer() {
        const partnerId = this.elements.partnerIdInput.value.trim();
        
        if (!partnerId) {
            this.showError('Please enter a partner ID');
            return;
        }
        
        if (!this.localStream) {
            this.showError('Please generate your ID first');
            return;
        }
        
        this.isInitiator = true;
        this.updateStatus('connecting', 'Connecting to ' + partnerId + '...');
        
        const call = this.peer.call(partnerId, this.localStream);
        this.setupCall(call);
    }
    
    handleIncomingCall(call) {
        console.log('Incoming call from:', call.peer);
        
        // Auto-answer the call
        call.answer(this.localStream);
        this.setupCall(call);
        
        this.updateStatus('connected', 'Connected with ' + call.peer);
        this.showPartnerInfo(call.peer);
    }
    
    setupCall(call) {
        this.currentCall = call;
        
        call.on('stream', (remoteStream) => {
            console.log('Received remote stream');
            this.remoteStream = remoteStream;
            this.elements.remoteVideo.srcObject = remoteStream;
            this.elements.mediaControls.classList.remove('opacity-50', 'pointer-events-none');
            this.updateStatus('connected', 'In call');
            
            if (this.isInitiator) {
                this.showPartnerInfo(call.peer);
            }
        });
        
        call.on('close', () => {
            console.log('Call ended');
            this.endCall();
        });
        
        call.on('error', (err) => {
            console.error('Call error:', err);
            this.showError('Call error: ' + err.type);
            this.endCall();
        });
    }
    
    toggleMute() {
        if (!this.localStream) return;
        
        const audioTrack = this.localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            const icon = this.elements.muteBtn.querySelector('svg');
            
            if (audioTrack.enabled) {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>';
                this.elements.muteBtn.classList.remove('active');
            } else {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>';
                this.elements.muteBtn.classList.add('active');
            }
        }
    }
    
    toggleVideo() {
        if (!this.localStream) return;
        
        const videoTrack = this.localStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            const icon = this.elements.videoBtn.querySelector('svg');
            
            if (videoTrack.enabled) {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>';
                this.elements.videoBtn.classList.remove('active');
            } else {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>';
                this.elements.videoBtn.classList.add('active');
            }
        }
    }
    
    async switchCamera() {
        if (!this.localStream || this.devices.length < 2) {
            this.showError('Only one camera available');
            return;
        }
        
        const currentDeviceId = this.localStream.getVideoTracks()[0].getSettings().deviceId;
        const currentIndex = this.devices.findIndex(d => d.deviceId === currentDeviceId);
        const nextIndex = (currentIndex + 1) % this.devices.length;
        const nextDevice = this.devices[nextIndex];
        
        try {
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: nextDevice.deviceId } },
                audio: true
            });
            
            // Stop old video track
            this.localStream.getVideoTracks().forEach(track => track.stop());
            
            // Replace with new track
            const newVideoTrack = newStream.getVideoTracks()[0];
            this.localStream.removeTrack(newVideoTrack);
            this.localStream.addTrack(newVideoTrack);
            this.elements.localVideo.srcObject = this.localStream;
            
            // Update remote peer if connected
            if (this.currentCall) {
                const sender = this.currentCall.pc.getSenders().find(s => s.track.kind === 'video');
                if (sender) {
                    sender.replaceTrack(newVideoTrack);
                }
            }
            
        } catch (error) {
            this.showError('Failed to switch camera: ' + error.message);
        }
    }
    
    endCall() {
        if (this.currentCall) {
            this.currentCall.close();
            this.currentCall = null;
        }
        
        if (this.remoteStream) {
            this.remoteStream.getTracks().forEach(track => track.stop());
            this.remoteStream = null;
        }
        
        this.elements.remoteVideo.srcObject = null;
        this.elements.mediaControls.classList.add('opacity-50', 'pointer-events-none');
        this.elements.partnerInfo.classList.add('hidden');
        this.elements.videoPlaceholder.classList.remove('hidden');
        
        this.updateStatus('disconnected', 'Call ended');
        this.isInitiator = false;
    }
    
    updateStatus(status, text) {
        const colors = {
            disconnected: 'bg-gray-500',
            connecting: 'bg-yellow-500',
            ready: 'bg-green-500',
            connected: 'bg-blue-500',
            error: 'bg-red-500'
        };
        
        this.elements.statusIndicator.className = `w-3 h-3 rounded-full ${colors[status] || colors.disconnected}`;
        this.elements.statusText.textContent = text;
    }
    
    showPartnerInfo(partnerId) {
        this.elements.partnerId.textContent = partnerId;
        this.elements.partnerInfo.classList.remove('hidden');
    }
    
    showError(message) {
        alert('❌ Error: ' + message);
        console.error(message);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new VideoCallApp();
});
