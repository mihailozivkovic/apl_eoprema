import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database';
import { AppController } from './app.controller';
import { Administrator } from 'entities/administrator.entity';
import { AdministratorService } from './services/administrator/administrator.service';
import { ArticleFeature } from 'entities/article-feature.entity';
import { ArticlePrice } from 'entities/article-price.entity';
import { CartArticle } from 'entities/cart-article.entity';
import { Category } from 'entities/category.entity';
import { Feature } from 'entities/feature.entity';
import { Order } from 'entities/order.entity';
import { Photo } from 'entities/photo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'mysql',
      host:DatabaseConfiguration.hostname,
      port:3306,
      username:DatabaseConfiguration.username,
      password:DatabaseConfiguration.password,
      database:DatabaseConfiguration.database,
      entities:[ Administrator,
                ArticleFeature,
                ArticlePrice,
                CartArticle,
                Category,
                Feature,
                Order,
                Photo]
    }),
    
    TypeOrmModule.forFeature([Administrator])
  ],
  controllers: [AppController],
  providers: [AdministratorService],
})
export class AppModule {}
