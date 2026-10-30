import { ContactInquiry } from './types';
import { readStoreFile, writeStoreFile } from './storage';

const INQUIRIES_FILE = 'inquiries.json';

export async function getInquiries(): Promise<ContactInquiry[]> {
  return await readStoreFile<ContactInquiry[]>(INQUIRIES_FILE, []);
}

export async function saveInquiries(inquiries: ContactInquiry[]): Promise<boolean> {
  return await writeStoreFile<ContactInquiry[]>(INQUIRIES_FILE, inquiries);
}

export async function addInquiry(data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  message: string;
}): Promise<ContactInquiry> {
  const inquiries = await getInquiries();
  const newInquiry: ContactInquiry = {
    id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: data.name.trim(),
    email: data.email.trim(),
    company: data.company?.trim() || '',
    phone: data.phone?.trim() || '',
    service: data.service?.trim() || 'استفسار عام',
    message: data.message.trim(),
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  inquiries.unshift(newInquiry);
  await saveInquiries(inquiries);
  return newInquiry;
}

export async function updateInquiryStatus(
  id: string,
  status: 'new' | 'read' | 'replied'
): Promise<ContactInquiry | null> {
  const inquiries = await getInquiries();
  const idx = inquiries.findIndex(i => i.id === id);
  if (idx === -1) return null;

  inquiries[idx].status = status;
  await saveInquiries(inquiries);
  return inquiries[idx];
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const inquiries = await getInquiries();
  const filtered = inquiries.filter(i => i.id !== id);
  if (filtered.length === inquiries.length) return false;
  return await saveInquiries(filtered);
}
