import fs from 'fs';
import os from 'os';
import path from 'path';
import { put, get } from '@vercel/blob';

const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const hasBlob = Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);

const bundledDataDir = path.join(process.cwd(), 'data');
const runtimeDataDir = isVercel
  ? path.join(os.tmpdir(), 'alnahda-data')
  : bundledDataDir;

export async function readStoreFile<T>(fileName: string, fallback: T): Promise<T> {
  // 1. Read from Vercel Blob first if configured (shared across all Serverless containers)
  if (hasBlob) {
    try {
      const result = await get(`data/${fileName}`, {
        access: 'private',
        useCache: false,
      });
      if (result && result.statusCode === 200 && result.stream) {
        const text = await new Response(result.stream).text();
        return JSON.parse(text) as T;
      }
    } catch {
      // If blob does not exist yet or error, fall through to initial bundled file
    }
  }

  // 2. Fallback to runtime /tmp or local data folder
  try {
    const runtimePath = path.join(runtimeDataDir, fileName);
    if (fs.existsSync(runtimePath)) {
      return JSON.parse(fs.readFileSync(runtimePath, 'utf-8')) as T;
    }

    const bundledPath = path.join(bundledDataDir, fileName);
    if (fs.existsSync(bundledPath)) {
      const content = fs.readFileSync(bundledPath, 'utf-8');
      const parsed = JSON.parse(content) as T;

      // Seed into Vercel Blob on first read if Blob is active
      if (hasBlob) {
        try {
          await put(`data/${fileName}`, content, {
            access: 'private',
            contentType: 'application/json',
            addRandomSuffix: false,
            allowOverwrite: true,
          });
        } catch {
          // ignore initial seed error
        }
      }
      return parsed;
    }

    return fallback;
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return fallback;
  }
}

export async function writeStoreFile<T>(fileName: string, data: T): Promise<boolean> {
  const jsonContent = JSON.stringify(data, null, 2);

  // 1. Write to Vercel Blob so all Serverless containers see the update immediately
  if (hasBlob) {
    try {
      await put(`data/${fileName}`, jsonContent, {
        access: 'private',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: true,
      });
    } catch (blobErr) {
      console.error(`Error writing ${fileName} to Vercel Blob:`, blobErr);
    }
  }

  // 2. Also write to local / runtime disk cache
  try {
    if (!fs.existsSync(runtimeDataDir)) {
      fs.mkdirSync(runtimeDataDir, { recursive: true });
    }
    const runtimePath = path.join(runtimeDataDir, fileName);
    fs.writeFileSync(runtimePath, jsonContent, 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${fileName} locally:`, error);
    return hasBlob;
  }
}
