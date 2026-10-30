import fs from 'fs';
import path from 'path';
import { ContactInquiry } from './types';

const inquiriesFilePath = path.join(process.cwd(), 'data', 'inquiries.json');

export function getInquiries(): ContactInquiry[] {
  try {
    if (!fs.existsSync(inquiriesFilePath)) {
      const initial: ContactInquiry[] = [];
      saveInquiries(initial);
      return initial;
    }
    const content = fs.readFileSync(inquiriesFilePath, 'utf-8');
    return JSON.parse(content) as ContactInquiry[];
  } catch (error) {
    console.error('Error reading inquiries file:', error);
    return [];
  }
}

export function saveInquiries(inquiries: ContactInquiry[]): boolean {
  try {
    const dir = path.dirname(inquiriesFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(inquiriesFilePath, JSON.stringify(inquiries, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving inquiries file:', error);
    return false;
  }
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
