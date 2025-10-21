import { Module } from '@nestjs/common';
import { TicketsModule } from './tickets/tickets.module';
import { PrismaService } from './prisma.service';
import { TicketGrpcController } from './grpc/ticket.grpc';

@Module({
  imports: [TicketsModule],
  providers: [PrismaService, TicketGrpcController],
})
export class AppModule {}
