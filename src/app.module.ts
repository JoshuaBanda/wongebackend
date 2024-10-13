import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShopModule } from './shop/shop.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [ShopModule,CloudinaryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
