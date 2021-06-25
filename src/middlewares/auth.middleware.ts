import { HttpException, HttpStatus, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as jwt from 'jsonwebtoken';
import { JwtDataAdministratorDto } from "src/dtos/administrator/jwt.data.administrator";
import { jwtSecret } from "config/jwt.secret";
import { Request } from "@nestjs/common";

export class AuthMiddleware implements NestMiddleware{
   
   constructor(private readonly administratorService:AdministratorService){}
    async use(req: Request, res: Response, next:NextFunction) {
        if(!req.headers.has("authorization")){
            throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
        }

        const token = req.headers.get('authorization');

       const jwtData:JwtDataAdministratorDto = jwt.verify(token,  jwtSecret)as any;
        
       if(!jwtData){
           throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
       }

       const administrator= await this.administratorService.getById(jwtData.administratorId)
           if(!administrator){
            throw new HttpException('Account not found', HttpStatus.UNAUTHORIZED);
           
       }

      const trenutniTimestamp = new Date().getTime() / 1000;

      if (trenutniTimestamp >= jwtData.ext){
        throw new HttpException('The token has expired', HttpStatus.UNAUTHORIZED);
      }
      
        next();
     
    }

}