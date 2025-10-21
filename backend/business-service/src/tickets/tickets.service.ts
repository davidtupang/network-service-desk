import { Injectable, NotFoundException } from '@nestjs/common';
import { TicketsRepository } from './tickets.repository';
import { TicketGateway } from '../ws/ticket.gateway';

@Injectable()
export class TicketsService {
  constructor(private readonly repo: TicketsRepository, private gateway: TicketGateway) {}

  async createTicket(dto:any, createdById:string){
    const ticketNumber = `TKT-${Date.now().toString(36)}`;
    const data = {...dto, ticketNumber};
    const t = await this.repo.create(data);
    this.gateway.emitUpdate({ ticketId: t.id, status: t.status, ticketNumber: t.ticketNumber, companyName: t.companyName });
    return t;
  }

  async assignTechnician(ticketId:string, technicianId:string){
    const ticket = await this.repo.findById(ticketId);
    if (!ticket) throw new NotFoundException('Ticket not found');
    const updated = await this.repo.update(ticketId, { status: 'ASSIGNED', technicianId });
    this.gateway.emitUpdate({ ticketId: updated.id, status: updated.status, ticketNumber: updated.ticketNumber, companyName: updated.companyName });
    return updated;
  }

  async resolveTicket(ticketId:string, note?:string){
    const ticket = await this.repo.findById(ticketId);
    if (!ticket) throw new NotFoundException('Ticket not found');
    const updated = await this.repo.update(ticketId, { status: 'RESOLVED' });
    this.gateway.emitUpdate({ ticketId: updated.id, status: updated.status, ticketNumber: updated.ticketNumber, companyName: updated.companyName });
    return updated;
  }

  async listAll(){ return this.repo.findMany(); }
}
