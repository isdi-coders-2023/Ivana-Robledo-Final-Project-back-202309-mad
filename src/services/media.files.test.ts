import cloudinaryBase from 'cloudinary';
/* Import { ImgData } from '../types/img.data'; */
import { MediaFiles } from './media.files.js';

jest.mock('cloudinary');

describe('When it is Instantiated', () => {
  const cloudinaryService = new MediaFiles();
  beforeEach(() => {
    // Simula el comportamiento de cloudinary.uploader.upload
    cloudinaryBase.v2.uploader.upload = jest
      .fn()
      .mockResolvedValue({ publicId: 'Test image' });
  });
  test('Then, when we use the method uploadImage', async () => {
    // Proporciona la ruta de la imagen como una cadena
    const imagePath = '/ruta/a/imagen.png';

    const imgData = await cloudinaryService.uploadImage(imagePath);

    expect(cloudinaryBase.v2.uploader.upload).toHaveBeenCalledWith(imagePath, {
      // eslint-disable-next-line camelcase
      use_filename: true,
      // eslint-disable-next-line camelcase
      unique_filename: false,
      overwrite: true,
    });

    expect(imgData).toEqual({
      url: '',
      format: '',
    });
  });
});
