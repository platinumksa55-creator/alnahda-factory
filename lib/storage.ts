import fs from 'fs';
import os from 'os';
import path from 'path';

const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const bundledDataDir = path.join(process.cwd(), 'data');
const runtimeDataDir = isVercel
  ? path.join(os.tmpdir(), 'alnahda-data')
  : bundledDataDir;

export function readStoreFile<T>(fileName: string, fallback: T): T {
  try {
    const runtimePath = path.join(runtimeDataDir, fileName);
    if (fs.existsSync(runtimePath)) {
      return JSON.parse(fs.readFileSync(runtimePath, 'utf-8')) as T;
    }

    const bundledPath = path.join(bundledDataDir, fileName);
    if (fs.existsSync(bundledPath)) {
      const content = fs.readFileSync(bundledPath, 'utf-8');
      if (isVercel) {
        try {
          if (!fs.existsSync(runtimeDataDir)) {
            fs.mkdirSync(runtimeDataDir, { recursive: true });
          }
          fs.writeFileSync(runtimePath, content, 'utf-8');
        } catch {
          // ignore write error on init
        }
      }
      return JSON.parse(content) as T;
    }

    return fallback;
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return fallback;
  }
}

export function writeStoreFile<T>(fileName: string, data: T): boolean {
  try {
    if (!fs.existsSync(runtimeDataDir)) {
      fs.mkdirSync(runtimeDataDir, { recursive: true });
    }
    const runtimePath = path.join(runtimeDataDir, fileName);
    fs.writeFileSync(runtimePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${fileName}:`, error);
    return false;
  }
}
