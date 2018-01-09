import { Injectable } from '@angular/core';
import {WebsocketService} from './websocket.service';
import * as SimplePeer from 'simple-peer';
import {UUID} from 'angular2-uuid';

@Injectable()
export class AudioChatService {

  private socket;
  private peerz: Map<string, any>;
  peers = {};
  uuid = UUID.UUID(); // *myCoolUUIDGeneratorFunction()*/
  private audioContext: AudioContext;
  private navigator: Navigator;

  constructor(private webSocket: WebsocketService) {
    this.peerz = new Map<string, any>();
    this.setUpAudioEquipments();
  }

  private setUpAudioEquipments(): void {
    this.audioContext = new AudioContext();
  }

  public setUpAudioService ( teamName: string): void {
    console.log(`Audio Set Up Team Name : => ${teamName}`);
    this.socket = this.webSocket.socket;
    this.registerConnectedEvent( teamName);
    this.registerNewPeerEvent();
    this.registerSignalEvent();
    this.setUpAudioEquipments();
  }

  public registerConnectedEvent ( audioRoom: string): void {
    this.socket.on('connected', (data) => {
      console.log(`SOCK: Peer is connected`);
      for ( let i = 0; i < data.allClientIds.length; ++i ) {
        const clientId = data.allClientIds[ i ];
        if ( clientId === this.uuid ) {
          continue;
        }


        navigator.mediaDevices.getUserMedia({audio: true})
          .then(stream => {
            const p  = new SimplePeer({
              initiator: true,
              trickle: false,
              channelName: audioRoom,
              stream: stream
            });
            console.log(` A new peer initiator is created : ${JSON.stringify(p)}`);
            this.peerz.set(clientId, p);
            this.addPeerListeners( p, clientId );
          });
      }

      // send my uuid to the signaling server
      this.socket.emit( 'uuid', {uuid: this.uuid} );
      console.log(`SOCK: Peer just emitted its uuid ... that's really cool -_-)`);
    });
  }

  public registerNewPeerEvent (): void {
    this.socket.on('new_peer', (data) => {
      console.log(`SOCK: Peer just received new new peer alert`);
      if ( data.newPeerId === this. uuid ) {
        return;
      }
      navigator.mediaDevices.getUserMedia({audio: true})
        .then(stream => {
          const p  = new SimplePeer({
            trickle: false,
            channelName: 'my_cool_channel_name',
            stream: stream
          });
          this.peerz.set(data.newPeerId, p);
          this.addPeerListeners( p, data.newPeerId );
        });
    });
  }

  public registerSignalEvent (): void {
    this.socket.on('signal', (data) => {
      console.log( 'SOCK: got signal from signaling server: Happy Nigger' );
      console.log( data );
      console.log(` All connections -> ${JSON.stringify(Array.from(this.peerz.keys()))}`);
      console.log(` Received Data-> ${JSON.stringify(data)}`);
      console.log(  `sender is - ${JSON.stringify(data.senderId)}
      \nsender data - ${JSON.stringify(this.peerz.get(data.senderId))}`);
      if ( this.peerz.get(data.senderId)) {
        console.log( 'SOCK: respond to a new peer' );
        this.peerz.get(data.senderId).signal( JSON.stringify(data) );
      }
    });
  }

  private  addPeerListeners( p, peerId ) {
    p.on('error',  (err) => { console.error('PEER: ', err); });

    p.on('signal',  (data) =>  {
      data.senderId = this.uuid  ;
      data.receiverId = peerId;
      console.log('PEER: SIGNAL from', JSON.stringify(data));
      this.socket.emit( 'signal', data );
    });

    p.on('connect',  () =>  {
      console.log('PEER: WebRTC connection!');
    });

    p.on('data',  (data) => {
      data = JSON.parse( data );
      console.log( 'PEER: Received data: ' );
      console.log( data );
      // do whatever you want with the data now
    });

    p.on('stream', (stream) => {
      console.log(`PEER: received Stream `, stream);
      const mediaStreamSource = this.audioContext.createMediaStreamSource( stream );
      // Connect it to the destination to hear yourself (or any other node for processing!)
      mediaStreamSource.connect( this.audioContext.destination );
      const audio_elem = document.createElement('audio');
      // var audio_elem = document.getElementById("audio");
      document.body.appendChild(audio_elem);
      audio_elem.src = URL.createObjectURL(stream);
      audio_elem.play();
    });

    p.on( 'close', () => {
      this.peerz.delete(peerId);
    });
  }

}
