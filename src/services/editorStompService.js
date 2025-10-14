import { Client } from '@stomp/stompjs';

let client = null;

export const connectStomp = (documentId, onMessage) => {
  if (client && client.active) {
    return;
  }
  
  client = new Client({
    brokerURL: 'ws://localhost:8080/drive-service/ws/editor', // STOMP 엔드포인트
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  client.onConnect = (frame) => {
    console.log('STOMP 연결 성공:', frame);
    
    // 서버로부터 메시지를 수신하기 위해 토픽 구독
    client.subscribe(`/topic/document/${documentId}`, (message) => {
      onMessage(JSON.parse(message.body));
    });
  };

  client.onStompError = (frame) => {
    console.error('Broker reported error:', frame.headers['message']);
    console.error('Additional details:', frame.body);
  };

  client.activate(); // 클라이언트 활성화
};

// 서버로 메시지 전송
export const sendStompMessage = (message) => {
  if (client && client.active) {
    client.publish({
      destination: '/publish/editor/update', // 메시지를 보낼 destination
      body: JSON.stringify(message),
    });
  } else {
    console.error('STOMP가 연결되어 있지 않습니다.');
  }
};

export const disconnectStomp = () => {
  if (client) {
    client.deactivate();
  }
};