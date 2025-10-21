import { join } from 'path';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { grpcClientOptions } from './grpc.options';
import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const PROTO_PATH = join(__dirname, '../../protos/ticket.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = loadPackageDefinition(packageDef) as any;
export const ticketPackage = grpcObj.ticket;

export function createGrpcClient(address: string){
  const packageDef = protoLoader.loadSync(PROTO_PATH);
  const grpcObj = loadPackageDefinition(packageDef) as any;
  const ClientCtor = grpcObj.ticket.TicketService;
  const client = new ClientCtor(address, credentials.createInsecure());
  return client;
}
