import { Controller, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Crud } from "@nestjsx/crud";
import { Article } from "entities/article.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dtos";
import { ArticleService } from "src/services/article/article.service";
import {diskStorage} from "multer";
import { StorageConfig } from "config/storage.config";
import { Photo } from "entities/photo.entity";

import { ApiResponse } from "src/misc/api.response.class";

@Controller('api/article')
@Crud({
    model: {
        type:Article
    },
    params : {
        id: {
            field:'articleId',
            type:'number',
            primary:true
        }
    },
    query:{
        join:{
            category:{
                eager:true
            },
            photos:{
                eager:true
            },
            articlePrice:{
                eager:true
            },
            articleFeature:{
                eager:true
            },
            features:{
                eager:true
            }
        }
    }
})
export class ArticleController {
    photoService: any;
    constructor(public service:ArticleService){}

    @Post('createFull')
    createFullArticle(data:AddArticleDto){
        return this.service.createFullArticle(data);
    }

    @Post('' )//POST http://localhost:3000/api/article/:id/uploadPhoto
    @UseInterceptors(
        FileInterceptor('photo', {
            storage:diskStorage({
                destination:StorageConfig.photoDestination,
                filename: (req,file, callback)=>{
                    

                    let original = file.originalname;

                    let normalized = original.replace(/\W+/g,'-');

                    let sada= new Date();

                    let datePart = '';
                    datePart+=sada.getFullYear().toString;
                    datePart+=(sada.getMonth()+1).toString;
                    datePart+=sada.getDate().toString;

                    let randomPart :string= new Array (10)
                    .fill(0)
                    .map(e => (Math.random()*9).toString())
                    .join('');



                    let fileName=datePart + '-'+randomPart+'-'+normalized;

                    callback(null,fileName);
                }
            }),
            fileFilter: (req,file, callback)=>{
                if(!file.originalname.match(/\.(jpg|png)$/)){
                    callback(new Error('Bad file extension!'),false);
                    return;
                }
                if (!(file.mimetype.includes('jpeg')|| file.mimetype.includes('png'))){

                    callback(new Error('Bad file content!'),false);
                    return;
                }

                callback(null, true);
            },
            limits:{
                files: 1,
                fileSize: StorageConfig.photoMaxFileSize,

            },
            
        })
    )
     async uploadPhoto(@Param ('id') articleId:number,@UploadedFile() photo):Promise<ApiResponse|Photo>{
        const newPhoto : Photo = new Photo();
        newPhoto.articleId = articleId;
        newPhoto.imagePath = photo.fileName;

        const savedPhoto = this.photoService.add(newPhoto) 
        if(!savedPhoto) {
            return new ApiResponse('error', -4001);

        }
        return savedPhoto;
    }
}