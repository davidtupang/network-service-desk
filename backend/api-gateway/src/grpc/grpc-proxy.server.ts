import express from 'express';
import bodyParser from 'body-parser';
import { createGrpcClient } from './ticket.client';

const app = express();
app.use(bodyParser.json());

const GRPC_ADDR = process.env.GRPC_ADDR || `localhost:${process.env.GRPC_PORT || 50051}`;

app.post('/grpc/assign', async (req, res) => {
  try {
    const { ticketId, technicianId } = req.body;
    if(!ticketId || !technicianId) return res.status(400).json({message: 'ticketId and technicianId required'});
    const client:any = createGrpcClient(GRPC_ADDR);
    client.AssignTechnician({ ticketId, technicianId }, (err:any, response:any) => {
      if(err) return res.status(500).json({ message: err.message });
      return res.json(response);
    });
  } catch (err:any){
    res.status(500).json({message:err.message});
  }
});

if (require.main === module) {
  const port = process.env.GATEWAY_PORT || 3000;
  app.listen(port, () => console.log(`[grpc-proxy] listening on ${port}, forwarding to ${GRPC_ADDR}`));
}

export default app;
