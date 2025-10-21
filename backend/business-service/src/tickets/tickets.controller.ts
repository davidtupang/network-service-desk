import { Controller, Post, Body, Patch, Param, Get, Req, BadRequestException } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Request } from 'express';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly svc: TicketsService) {}

  @Post()
  async create(@Req() req: Request, @Body() body: any) {
    const userId = req.headers['x-user-id'] as string;
    if(!userId) throw new BadRequestException('missing user context');
    return this.svc.createTicket(body, userId);
  }

  @Patch(':id/assign')
  async assign(@Param('id') id:string, @Body() body:any){ return this.svc.assignTechnician(id, body.technicianId); }

  @Patch(':id/resolve')
  async resolve(@Param('id') id:string, @Body() body:any){ return this.svc.resolveTicket(id, body.note); }

  @Get()
  async listAll(){ return this.svc.listAll(); }
}
