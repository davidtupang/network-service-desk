const io = require('socket.io-client');
const fetch = require('node-fetch');
const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');

const BUSINESS_WS = process.env.BUSINESS_WS || 'http://localhost:3001';
const GRPC_ADDR = process.env.GRPC_ADDR || 'localhost:50051';
const BUSINESS_URL = process.env.BUSINESS_URL || 'http://localhost:3001';

async function createTicket(){
  const res = await fetch(BUSINESS_URL + '/tickets', {
    method: 'POST',
    headers: { 'content-type':'application/json', 'x-user-id':'e2e-user' },
    body: JSON.stringify({ companyName: 'ACME', subject: 'ws test' })
  });
  return res.json();
}

function callAssign(ticketId){
  const packageDef = protoLoader.loadSync(__dirname + '/../../backend/legacy-mono/protos/ticket.proto');
  const grpcObj = grpc.loadPackageDefinition(packageDef).ticket;
  const client = new grpcObj.TicketService(GRPC_ADDR, grpc.credentials.createInsecure());
  return new Promise((resolve, reject)=>{
    client.AssignTechnician({ ticketId, technicianId: 'tech-2' }, (err, resp)=>{
      if(err) return reject(err);
      resolve(resp);
    });
  });
}

(async ()=>{
  try {
    const ticket = await createTicket();
    const sock = io(BUSINESS_WS, { transports: ['websocket'] });
    sock.on('connect', async ()=> {
      console.log('ws connected, socket id', sock.id);
      sock.on('ticket:update', (payload)=> {
        console.log('received ticket:update', payload);
        sock.close();
        process.exit(0);
      });
      // call grpc -> should trigger update
      await callAssign(ticket.id || ticket.ticketNumber || ticket);
    });
    sock.on('connect_error', (e)=> { console.error('connect_error', e); process.exit(2); });
    setTimeout(()=>{ console.error('ws test timeout'); process.exit(3); }, 20000);
  } catch (err){
    console.error('ws test failed', err);
    process.exit(2);
  }
})();