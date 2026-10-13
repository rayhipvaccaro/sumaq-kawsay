import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DEFAULT_CMS_DATA, ContactLead } from '@/data/defaultCmsData'; 
import { requireAdmin } from '@/lib/requireAuth';

const CONTACTS_FILE = path.join(process.cwd(), 'data', 'contacts_store.json');

function readContacts(): ContactLead[] {
  try {
    if (fs.existsSync(CONTACTS_FILE)) {
      const content = fs.readFileSync(CONTACTS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error reading contacts from disk:', error);
  }
  return DEFAULT_CMS_DATA.contacts;
}

function writeContacts(contacts: ContactLead[]): boolean {
  try {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing contacts to disk:', error);
    return false;
  }
}

export async function GET(req: NextRequest) { const auth = await requireAdmin(req); if ('error' in auth) return auth.error;
  const contacts = readContacts();
  return NextResponse.json(contacts);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message, tourInterest, travelDate } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const contacts = readContacts();
    const newLead: ContactLead = {
      id: `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      email,
      phone: phone || '',
      message: message || '',
      tourInterest: tourInterest || 'Consulta General',
      travelDate: travelDate || '',
      createdAt: new Date().toISOString(),
      status: 'nuevo',
    };

    contacts.unshift(newLead);
    writeContacts(contacts);

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    console.error('Error adding contact lead:', error);
    return NextResponse.json({ error: 'Invalid contact payload' }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) { const auth = await requireAdmin(req); if ('error' in auth) return auth.error;
  try {
    const { id, status } = await req.json();
    const contacts = readContacts();
    const idx = contacts.findIndex((c) => c.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    contacts[idx].status = status;
    writeContacts(contacts);
    return NextResponse.json({ success: true, lead: contacts[idx] });
  } catch (error) {
    console.error('Error updating contact status:', error);
    return NextResponse.json({ error: 'Invalid update payload' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) { const auth = await requireAdmin(req); if ('error' in auth) return auth.error;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    let contacts = readContacts();
    contacts = contacts.filter((c) => c.id !== id);
    writeContacts(contacts);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 400 });
  }
}
