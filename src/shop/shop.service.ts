import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { db } from 'src/db';
import { insertShop, selectShop, shopTable } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ShopService {
    // Create a new shop
    async createShop(data: insertShop) {
        try {
            const [shop] = await db.insert(shopTable).values(data).returning();
            return shop; // Return the created shop
        } catch (error) {
            console.error('Error creating shop:', error);
            throw new InternalServerErrorException('Failed to create shop');
        }
    }

    // Get a specific shop by ID
    async getShop(id: selectShop['id']): Promise<selectShop | null> {
        const [shop] = await db
            .select()
            .from(shopTable)
            .where(eq(shopTable.id, id))
            .execute();

        return shop || null; // Return the shop or null if not found
    }

    // Get all shops
    async getAllShops(): Promise<selectShop[]> {
        return await db
            .select()
            .from(shopTable)
            .execute();
    }

    // Update a shop
    async updateShop(id: number, data: Partial<insertShop>): Promise<selectShop | null> {
        try {
            const [updatedShop] = await db.update(shopTable)
                .set(data)
                .where(eq(shopTable.id, id))
                .returning()
                .execute();

            if (!updatedShop) {
                throw new NotFoundException(`Shop with ID ${id} not found`);
            }
            return updatedShop;
        } catch (error) {
            console.error('Error updating shop:', error);
            throw new InternalServerErrorException('Failed to update shop');
        }
    }

    // Delete a shop (and its associated photos)
    async deleteShop(id: number): Promise<void> {
        try {
            const result = await db.delete(shopTable).where(eq(shopTable.id, id)).execute();
            console.log('hello');

            if (result.count === 0) {
                throw new NotFoundException(`Shop with ID ${id} not found`);
            }
        } catch (error) {
            console.error('Error deleting shop:', error);
            throw new InternalServerErrorException('Failed to delete shop');
        }
    }

    // Fetch all photos for a specific shop (if photos are included in the shop object)
    async getPhotosByShopId(shopId: number): Promise<selectShop | null> {
        try {
            const [shop] = await db
                .select()
                .from(shopTable)
                .where(eq(shopTable.id, shopId))
                .execute();

            if (!shop) {
                throw new NotFoundException(`Shop with ID ${shopId} not found`);
            }

            return shop; // Return the shop including its photos
        } catch (error) {
            console.error('Error fetching photos for shop:', error);
            throw new InternalServerErrorException('Failed to fetch photos');
        }
    }

    // Method to create a photo for a specific shops
    async createShopPhoto(shopId: number, publicId: string, url: string) {
        try {
            const shop = await this.getShop(shopId);
            if (!shop) {
                throw new NotFoundException(`Shop with ID ${shopId} not found`);
            }
        } catch (error) {
            console.error('Error adding photo to shop:', error);
            throw new InternalServerErrorException('Failed to add photo to shop');
        }
    }

}
