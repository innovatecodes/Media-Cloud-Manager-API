import { diskStorage } from "multer";
import { generateRandomFileName } from "./generate-random-file-name.js";
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename); 

export const storage = diskStorage({
  destination: (req, file, callback) => {
    const pathToUploadForder = path.resolve(__dirname, '../../assets/uploads' /** '..', '..', 'assets', 'uploads' */);
    callback(null, pathToUploadForder);
  },
  filename: (req, file, callback) => {
    callback(null, generateRandomFileName(file.fieldname, file.originalname));
  },
});
