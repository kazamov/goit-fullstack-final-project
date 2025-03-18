import { v2 as cloudinary } from 'cloudinary';

import type { FileStorage } from '../../app/interfaces';

export class CloudinaryClient implements FileStorage {
  constructor(cloudName: string, apiKey: string, apiSecret: string) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  async uploadFile(name: string, content: Buffer | string): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(
        typeof content === 'string'
          ? content
          : `data:image/png;base64,${content.toString('base64')}`,
        { public_id: name, resource_type: 'auto' },
      );
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload file to Cloudinary');
    }
  }
}
