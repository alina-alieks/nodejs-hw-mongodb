import path from 'node:path';
import fs from 'node:fs/promises';
import { PUBLIC_UPLOAD_DIR } from '../constants/index.js';
import { env } from './env.js';

export const saveFileToPublicDir = async (file) => {
  await fs.rename(file.path, path.join(PUBLIC_UPLOAD_DIR, file.filename));
  return `${env('APP_DOMAIN')}/${file.filename}`;
};
