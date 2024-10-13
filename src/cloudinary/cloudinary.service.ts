import { Injectable } from "@nestjs/common";
import { UploadApiErrorResponse, UploadApiResponse, v2 } from "cloudinary";

@Injectable()
export class CloudinaryService {
  constructor() {
    v2.config({
      cloud_name: 'dbtsy6avd',
      api_key: '535641222615837',
      api_secret: '4z0mGnd7RfOZohgmTgSl57-qkjY',
    });
  }

  async uploadImage(fileBuffer: Buffer, fileName: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = v2.uploader.upload_stream(
        {
          resource_type: 'auto',
          public_id: fileName, // Use fileName as public_id if desired
          folder: 'jo' // Optionally specify a folder
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(error);
          }
          console.log('Cloudinary upload result:', result); // Log the result
          resolve(result);
        }
      );

      uploadStream.end(fileBuffer); // End the stream with the buffer
    });
  }
  async deleteImage(publicId: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
        v2.uploader.destroy(publicId, { invalidate: true }, (error, result) => {
            if (error) {
                console.error('Cloudinary delete error:', error); // Log detailed error
                return reject(error);
            }
            console.log('Cloudinary delete result:', result);
            resolve(result);
        });
    });
}
}

