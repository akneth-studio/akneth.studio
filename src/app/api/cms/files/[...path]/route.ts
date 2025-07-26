// src/app/api/cms/files/[...path]/route.ts
import { downloadCmsFile, syncFile } from '@/lib/content'; // Używamy nowej funkcji syncFile
import { NextResponse } from 'next/server';

// Funkcja pomocnicza do wyciągania ścieżki pliku z URL, aby ominąć błąd Next.js 15
function getFilePathFromRequest(request: Request): string {
  const url = new URL(request.url);
  // Usuwamy stały prefiks ścieżki API, aby uzyskać ścieżkę do pliku
  // np. z /api/cms/files/policies/privacy.md -> policies/privacy.md
  return url.pathname.substring('/api/cms/files/'.length);
}

// Pobieranie pliku (generowanie linku)
export async function GET(request: Request) {
  const filePath = getFilePathFromRequest(request);
  try {
    const signedUrl = await downloadCmsFile(filePath);
    if (signedUrl) {
      return NextResponse.json({ signedUrl });
    } else {
      return NextResponse.json({ error: 'Nie udało się wygenerować linku.' }, { status: 404 });
    }
  } catch (error) {
    console.error(`Błąd API (downloadCmsFile dla ${filePath}):`, error);
    return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 });
  }
}

// Aktualizacja pliku
export async function POST(request: Request) {
  const filePath = getFilePathFromRequest(request);
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Brak pliku w żądaniu.' }, { status: 400 });
    }

    const success = await syncFile(file, filePath);
    if (success) {
      return NextResponse.json({ message: 'Plik zaktualizowany pomyślnie.' });
    } else {
      return NextResponse.json({ error: 'Nie udało się zaktualizować pliku.' }, { status: 500 });
    }
  } catch (error) {
    console.error(`Błąd API (uploadCmsFile dla ${filePath}):`, error);
    return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 });
  }
}
