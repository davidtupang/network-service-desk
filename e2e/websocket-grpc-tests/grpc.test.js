const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');
const fetch = require('node-fetch');

const PROTO_PATH = __dirname + '/../../backend/legacy-mono/protos/ticket.proto';
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(packageDef).ticket;

const GRPC_ADDR = process.env.GRPC_ADDR || 'localhost:50051';
const BUSINESS_URL = process.env.BUSINESS_URL || 'http://localhost:3001';

async function createTicket(){
  const res = await fetch(BUSINESS_URL + '/tickets', {
    method: 'POST',
    headers: { 'content-type':'application/json', 'x-user-id':'e2e-user' },
    body: JSON.stringify({ companyName: 'ACME', subject: 'e2e test' })
  });
  return res.json();
}

async function callAssign(ticketId){
  return new Promise((resolve, reject)=>{
    const client = new grpcObj.TicketService(GRPC_ADDR, grpc.credentials.createInsecure());
    client.AssignTechnician({ ticketId, technicianId: 'tech-1' }, (err, resp)=> {
      if(err) return reject(err);
      resolve(resp);
    });
  });
}

(async ()=>{
  try {
    console.log('Creating ticket via REST...');
    const ticket = await createTicket();
    console.log('Ticket created:', ticket.id || ticket.ticketNumber || ticket);
    console.log('Calling gRPC AssignTechnician...');
    const resp = await callAssign(ticket.id || ticket.ticketNumber || ticket);
    console.log('gRPC response:', resp);
    console.log('GRPC test finished');
    process.exit(0);
  } catch (err){
    console.error('e2e grpc test failed', err);
    process.exit(2);
  }
})();