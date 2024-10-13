import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports:[CloudinaryModule],
  controllers: [ShopController],
  providers: [ShopService,CloudinaryService],
})
export class ShopModule {}
