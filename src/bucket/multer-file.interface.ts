import { File } from 'multer';

export interface MulterFile extends File {
  originalname: any;
  path: string;
}
