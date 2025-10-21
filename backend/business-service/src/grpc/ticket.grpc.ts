import { Controller, OnModuleInit } from '@nestjs/common';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { TicketsService } from '../tickets/tickets.service';

@Controller()
export class TicketGrpcController implements OnModuleInit {
  constructor(private ticketsService: TicketsService) {}
  onModuleInit(){}

  @GrpcMethod('TicketService', 'AssignTechnician')
  async assignTechnician(data:any){
    const { ticketId, technicianId } = data;
    await this.ticketsService.assignTechnician(ticketId, technicianId);
    return { status: 'ASSIGNED' };
  }

  @GrpcMethod('TicketService', 'ResolveTicket')
  async resolveTicket(data:any){
    const { ticketId, note } = data;
    await this.ticketsService.resolveTicket(ticketId, note);
    return { status: 'RESOLVED' };
  }
})
