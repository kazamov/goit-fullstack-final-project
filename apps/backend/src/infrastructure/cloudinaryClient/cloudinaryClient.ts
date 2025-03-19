import { v2 as cloudinary } from 'cloudinary';

export interface FileStorage {
  /**
   * Upload a file to the storage
   * @param name - File name in storage
   * @param content - File content as Buffer or string
   * @returns A promise resolving to the file URL
   */
  uploadFile(name: string, content: Buffer | string): Promise<string>;
}

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
