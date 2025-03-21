import { v2 as cloudinary } from 'cloudinary';

import { getConfig } from '../../config.js';

export interface FileStorage {
  /**
   * Upload a file to the storage
   * @param name - File name in storage
   * @param folder - Folder name in storage
   * @param content - File content as Buffer or string
   * @returns A promise resolving to the file URL
   */
  uploadFile({
    name,
    folder,
    content,
  }: {
    name: string;
    folder: string;
    content: Buffer | string;
  }): Promise<string>;
}

const {
  cloudinary: { cloudName: name, apiKey: key, apiSecret: secret },
} = getConfig();

class CloudinaryClient implements FileStorage {
  constructor(
    cloudName: string = name,
    apiKey: string = key,
    apiSecret: string = secret,
  ) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  async uploadFile({
    name,
    folder,
    content,
  }: {
    name: string;
    folder: string;
    content: Buffer | string;
  }): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(
        typeof content === 'string'
          ? content
          : `data:image/png;base64,${content.toString('base64')}`,
        { public_id: name, resource_type: 'auto', folder },
      );
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload file to Cloudinary');
    }
  }
}

export const cloudinaryClient = new CloudinaryClient();
