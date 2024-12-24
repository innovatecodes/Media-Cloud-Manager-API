import { diskStorage } from "multer";
import { generateRandomFileName } from "./generate-random-file-name";
import path from "path";


export const storage = diskStorage({
  destination: (req, file, callback) => {
    const pathToUploadForder = path.resolve(__dirname, '../../assets/uploads' /** '..', '..', 'assets', 'uploads' */);
    callback(null, pathToUploadForder);
  },
  filename: (req, file, callback) => {
    callback(null, generateRandomFileName(file.fieldname, file.originalname));
  },
});
