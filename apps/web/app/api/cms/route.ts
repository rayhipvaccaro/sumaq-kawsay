import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DEFAULT_CMS_DATA, CMSData } from '@/data/defaultCmsData'; 
import { requireAdmin } from '@/lib/requireAuth';

const DATA_FILE = path.join(process.cwd(), 'data', 'cms_store.json');

function readCmsData(): CMSData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(fileContent);
      return { ...DEFAULT_CMS_DATA, ...parsed };
    }
  } catch (error) {
    console.error('Error reading CMS data from disk:', error);
  }
  return DEFAULT_CMS_DATA;
}

function writeCmsData(data: CMSData): boolean {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing CMS data to disk:', error);
    return false;
  }
}

export async function GET() {
  const data = readCmsData();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) { const auth = await requireAdmin(req); if ('error' in auth) return auth.error;
  try {
    const updatedData = (await req.json()) as Partial<CMSData>;
    const currentData = readCmsData();
    const merged: CMSData = {
      ...currentData,
      ...updatedData,
      generalContent: {
        ...currentData.generalContent,
        ...(updatedData.generalContent || {}),
      },
    };
    const success = writeCmsData(merged);
    return NextResponse.json({ success: true, data: merged, diskPersisted: success });
  } catch (error) {
    console.error('Error updating CMS data:', error);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
