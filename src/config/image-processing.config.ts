import { registerAs } from '@nestjs/config';

export default registerAs('imageProcessing', () => ({
  imageDownloadsDirpath: process.env.IMAGE_DOWNLOADS_DIRPATH,
}));
