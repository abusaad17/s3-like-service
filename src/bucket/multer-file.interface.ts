import { File } from 'multer';

export interface MulterFile extends File {
  filename: string;
  originalname: any;
  path: string;
}
