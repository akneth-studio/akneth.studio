// src/app/api/cms/files/route.ts
import { listCmsFiles } from '@/lib/content';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const files = await listCmsFiles();
    return NextResponse.json(files);
  } catch (error) {
    console.error('Błąd API (listCmsFiles):', error);
    return NextResponse.json({ error: 'Nie udało się pobrać listy plików.' }, { status: 500 });
  }
}
