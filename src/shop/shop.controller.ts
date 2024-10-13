import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ShopService } from './shop.service';
import { insertShop, selectShop } from 'src/db/schema';

@Controller('shops')
export class ShopController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly shopService: ShopService,
  ) {}

  // Create a new shop and upload a photo
  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // Intercept the uploaded file
  async createShopWithPhoto(
    @Body() createShopDto: insertShop,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.cloudinaryService.uploadImage(file.buffer, file.originalname);
      const { public_id: publicId, secure_url: url } = result;

      const shopData = {
        ...createShopDto,
        url,
        publicId,
      };

      const shop = await this.shopService.createShop(shopData);
      
      return {
        message: 'Shop created and photo uploaded successfully',
        shop,
      };
    } catch (error) {
      console.error('Error creating shop or uploading photo:', error);
      throw new HttpException('Failed to create shop or upload photo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Get a specific shop by ID
  @Get(':id')
  async getShop(@Param('id') id: string): Promise<selectShop> {
    const shop = await this.shopService.getShop(Number(id));
    if (!shop) {
      throw new HttpException(`Shop with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return shop;
  }

  // Get all shops
  @Get()
  async getAllShops(): Promise<selectShop[]> {
    return await this.shopService.getAllShops();
  }

  // Get all photos for a specific shop
  @Get(':shopId/photos')
  async getPhotosByShopId(@Param('shopId') shopId: string) {
    const shopIdNumber = Number(shopId);
    const shop = await this.shopService.getPhotosByShopId(shopIdNumber);
    if (!shop) {
      throw new HttpException(`Shop with ID ${shopId} not found`, HttpStatus.NOT_FOUND);
    }
    return shop;
  }

  // Update shop details
  @Put(':id')
  async updateShop(
    @Param('id') id: string,
    @Body() updateShopDto: insertShop,
  ) {
    try {
      const updatedShop = await this.shopService.updateShop(Number(id), updateShopDto);
      if (!updatedShop) {
        throw new HttpException(`Shop with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return {
        message: 'Shop updated successfully',
        shop: updatedShop,
      };
    } catch (error) {
      console.error('Error updating shop:', error);
      throw new HttpException('Failed to update shop', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Delete a photo by ID
  @Delete(':shopId/photos/:publicId')
  async deletePhoto(@Param('publicId') publicId: string, @Param('shopId') shopId: string) {
    const shopIdNumber = Number(shopId);
    try {
      await this.cloudinaryService.deleteImage(publicId);
      return { message: 'Photo deleted successfully' };
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw new HttpException('Failed to delete photo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Delete a shop by ID
  @Delete(':id')
  async deleteShop(@Param('id') id: string) {
    try {
      const shop = await this.shopService.getShop(Number(id));
      if (!shop) {
        throw new HttpException(`Shop with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }

      // Delete associated image from Cloudinary
      await this.cloudinaryService.deleteImage(shop.publicId);

      // Delete the shop from the database
      await this.shopService.deleteShop(Number(id));
      
      return { message: 'Shop deleted successfully' };
    } catch (error) {
      console.error('Error deleting shop:', error);
      throw new HttpException('Failed to delete shop', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
