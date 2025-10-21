import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class TicketGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  afterInit(server: Server){ console.log('WebSocket gateway initialized'); }

  emitUpdate(update:any){
    this.server.emit('ticket:update', update);
  }
}
