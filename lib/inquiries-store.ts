import { ContactInquiry } from './types';
import { readStoreFile, writeStoreFile } from './storage';

const INQUIRIES_FILE = 'inquiries.json';

export function getInquiries(): ContactInquiry[] {
  return readStoreFile<ContactInquiry[]>(INQUIRIES_FILE, []);
}

export function saveInquiries(inquiries: ContactInquiry[]): boolean {
  return writeStoreFile<ContactInquiry[]>(INQUIRIES_FILE, inquiries);
}

export function addInquiry(data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  message: string;
}): ContactInquiry {
  const inquiries = getInquiries();
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
  saveInquiries(inquiries);
  return newInquiry;
}

export function updateInquiryStatus(id: string, status: 'new' | 'read' | 'replied'): ContactInquiry | null {
  const inquiries = getInquiries();
  const idx = inquiries.findIndex(i => i.id === id);
  if (idx === -1) return null;

  inquiries[idx].status = status;
  saveInquiries(inquiries);
  return inquiries[idx];
}

export function deleteInquiry(id: string): boolean {
  const inquiries = getInquiries();
  const filtered = inquiries.filter(i => i.id !== id);
  if (filtered.length === inquiries.length) return false;
  return saveInquiries(filtered);
}
