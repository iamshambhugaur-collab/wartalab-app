import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc';

const RTC_CONFIG = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

export class OfflinePeerService {
  constructor() {
    this.pc = null;
    this.channel = null;
    this.onMessage = () => {};
    this.onSignal = () => {};
  }

  async initAsInitiator() {
    this.pc = new RTCPeerConnection(RTC_CONFIG);
    this.channel = this.pc.createDataChannel('wartalab-chat');
    this.attachChannelHandlers(this.channel);
    this.attachPeerHandlers();

    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    return JSON.stringify(offer);
  }

  async initAsReceiver(remoteOfferString) {
    this.pc = new RTCPeerConnection(RTC_CONFIG);
    this.pc.ondatachannel = (event) => {
      this.channel = event.channel;
      this.attachChannelHandlers(this.channel);
    };
    this.attachPeerHandlers();

    await this.pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(remoteOfferString)));

    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    return JSON.stringify(answer);
  }

  async acceptAnswer(remoteAnswerString) {
    await this.pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(remoteAnswerString)));
  }

  async addIceCandidate(candidateString) {
    await this.pc.addIceCandidate(new RTCIceCandidate(JSON.parse(candidateString)));
  }

  send(message) {
    if (this.channel?.readyState === 'open') {
      this.channel.send(JSON.stringify(message));
    }
  }

  attachPeerHandlers() {
    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.onSignal({ type: 'ice', payload: JSON.stringify(event.candidate) });
      }
    };
  }

  attachChannelHandlers(channel) {
    channel.onmessage = (event) => {
      this.onMessage(JSON.parse(event.data));
    };
  }

  close() {
    this.channel?.close();
    this.pc?.close();
    this.channel = null;
    this.pc = null;
  }
}
