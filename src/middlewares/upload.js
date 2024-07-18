import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';
import createHttpError from 'http-errors';

const storage = multer.diskStorage({
  destination: TEMP_UPLOAD_DIR,
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now();
    const filename = `${uniqueSuffix}_${file.originalname}`;
    callback(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, callback) => {
  const extension = req.file.originalname.split('.').pop();
  if (extension === 'exe') {
    return callback(createHttpError(400, '.exe file not allow'));
  }
  callback(null, true);
};
