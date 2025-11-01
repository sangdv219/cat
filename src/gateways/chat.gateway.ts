import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;


    handleDisconnect(client: any) {
        console.log(`❌ Client disconnected: ${client.id}`);
    }
    handleConnection(client: any, ...args: any[]) {
        // console.log(`✅ Client connected: ${client.id}`);
        const token = client.handshake.headers['authorization'];
        // console.log("token__: ", token);
        client.join(`user_${token}`);
        client.emit('welcome', 'You are connected!');
    }

    // lắng nghe message client gửi
    @SubscribeMessage('send_message')
    onChatCreated(@MessageBody() message: string){
        console.log("message: ", message);
        this.server.emit('receive_message', message);
        // return { event: 'send_message', data: `Chat created for ${message}`};
    }


    notifyChatStatusChange(chatId: string, status: string) {
        this.server.emit('chat-status', { chatId, status })
    }
}
