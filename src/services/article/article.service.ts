import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Repository } from "typeorm";
import { Article } from "entities/article.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { AddArticleDto } from "src/dtos/article/add.article.dtos";
import { ArticlePrice } from "entities/article-price.entity";
import { ArticleFeature } from "entities/article-feature.entity";

@Injectable()
export class ArticleService extends TypeOrmCrudService<Article>{
    constructor(
        @InjectRepository(Article)
            private readonly article:Repository<Article>,

            @InjectRepository(ArticlePrice)
            private readonly articlePrice:Repository<ArticlePrice>,

            @InjectRepository(ArticleFeature)
            private readonly articleFeature:Repository<ArticleFeature>

            ){
                super(article);
            }

            async createFullArticle(data:AddArticleDto):Promise<Article|ApiResponse> {
                let newArticle:Article=new Article();
                newArticle.name=data.name;
                newArticle.categoryId=data.categoryId;
                newArticle.excerpt=data.excerpt;
                newArticle.description=data.description;

                let savedArticle= await this.article.save(newArticle);

                let newArticlePrice = new ArticlePrice();

                newArticlePrice.articleId = savedArticle.articleId;
                newArticlePrice.price =data.price;

               await this.articlePrice.save(newArticlePrice)

                for (let feature of data.features){
                    let newArticleFeature = new ArticleFeature();
                    newArticleFeature.articleId=savedArticle.articleId;
                    newArticleFeature.featureId=feature.featureId;
                    newArticleFeature.value = feature.value;

                    await this.articleFeature.save(newArticleFeature);
                }
                return await this.article.findOne(savedArticle.articleId,{
                    relations: [
                        "category",
                        "articleFeatures",
                        "features",
                        "photos"
                    ]
                });
            }
        }
    
