import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'entities/administrator.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
export class AdministratorService {
    constructor (
        @InjectRepository(Administrator)
         private readonly administrator:Repository<Administrator>,
    )
    {}
        getAll():Promise<Administrator[]> {
            return this.administrator.find();
        }

      async  getByUsername(username:string):Promise<Administrator | null>{
            const admin = await this.administrator.findOne({
                username:username
            });

            if(admin){
                return admin;
            }
            return null;
        }

        getById(id:number):Promise<Administrator>{
            return this.administrator.findOne(id);

        }
        
    }

