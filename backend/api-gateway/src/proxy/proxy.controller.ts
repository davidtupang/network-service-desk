import { Controller, All, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';
import { JwtAuthGuard } from '../shared/jwt-auth.guard';

const BUSINESS_URL = process.env.BUSINESS_URL || 'http://localhost:3001';

@Controller()
export class ProxyController {
  @UseGuards(JwtAuthGuard)
  @All('api/*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    try {
      const url = BUSINESS_URL + req.originalUrl.replace(/^/api/, '');
      const headers = {...req.headers};
      delete headers.host;
      if ((req as any).user){
        headers['x-user-id']=(req as any).user.sub;
        headers['x-user-role']=(req as any).user.role;
      }
      const response = await axios({ method: req.method as any, url, headers, data: req.body, params: req.query, validateStatus: ()=>true });
      res.status(response.status).send(response.data);
    } catch (err:any){
      res.status(err.response?.status||500).json({message:err.message});
    }
  }
}
