/* eslint-disable camelcase */
import { v2 as cloudinary } from 'cloudinary';
import createDebug from 'debug';
import { ImgData } from '../types/img.data';
import { HttpError } from '../types/http.error.js';

const debug = createDebug('W8E:mediaFiles');

export class MediaFiles {
  constructor() {
    // Alternative cloudinary.config({
    //   cloud_name: 'dip7gfqzk',
    //   api_key: '779336367936511',
    //   api_secret: process.env.CLOUDINARY_SECRET,
    // });

    cloudinary.config({
      secure: true, // Setting return "https" URLs
    });

    debug('Instantiated');
    debug('key:', cloudinary.config().api_key);
  }

  async uploadImage(imagePath: string) {
    try {
      const uploadApiResponse = await cloudinary.uploader.upload(imagePath, {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });

      const imgData: ImgData = {
        url: uploadApiResponse.url,
        publicId: uploadApiResponse.public_id,
        size: uploadApiResponse.bytes,
        height: uploadApiResponse.height,
        width: uploadApiResponse.width,
        format: uploadApiResponse.format,
      };

      return imgData;
    } catch (err) {
      const error = (err as { error: Error }).error as Error;
      throw new HttpError(406, 'Not Acceptable', error.message);
    }
  }
}
