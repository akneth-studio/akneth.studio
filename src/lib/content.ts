import { supabase } from '@/lib/supabaseClientServ';
import { commitFileToGitLab } from '@/lib/gitlab';

// Definicja typu CmsFile (przywrócona)
export interface CmsFile {
  name: string;
  id: string;
  path: string;
}

const BUCKET_NAME = 'cms';

// Rekurencyjna funkcja pomocnicza (przywrócona)
async function listFilesRecursively(path = ''): Promise<CmsFile[]> {
  const { data: filesAndFolders, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(path, { limit: 1000 });

  if (error) {
    console.error(`Błąd serwera podczas listowania plików w ścieżce ${path}:`, error);
    throw error;
  }

  const filePromises = filesAndFolders.map(async (item): Promise<CmsFile[]> => {
    if (item.id) {
      const fileWithPath: CmsFile = { ...item, id: item.id, path: path ? `${path}/${item.name}` : item.name };
      return [fileWithPath];
    } else {
      const newPath = path ? `${path}/${item.name}` : item.name;
      return listFilesRecursively(newPath);
    }
  });

  const nestedFiles = await Promise.all(filePromises);
  return nestedFiles.flat();
}

// Główna funkcja do listowania (przywrócona)
export async function listCmsFiles(): Promise<CmsFile[]> {
  return listFilesRecursively();
}

// Funkcja do pobierania (przywrócona i poprawiona)
export async function downloadCmsFile(filePath: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, 60, { download: true });
  if (error) {
    console.error('Błąd serwera podczas generowania linku do pobrania:', error);
    return null;
  }
  return data.signedUrl;
}

// Nowa funkcja-koordynator do synchronizacji
export async function syncFile(file: File, path: string): Promise<boolean> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const commitMessage = `Aktualizacja pliku CMS przez panel admina: ${path}`;

    // Krok 1: Spróbuj wysłać commit do GitLab
    const gitlabSuccess = await commitFileToGitLab(path, arrayBuffer, commitMessage);

    if (!gitlabSuccess) {
      console.error('Commit do GitLab nie powiódł się. Przerywam synchronizację z Supabase.');
      return false;
    }

    // Krok 2: Jeśli GitLab się udał, wyślij plik do Supabase
    const { error: supabaseError } = await supabase.storage.from(BUCKET_NAME).upload(path, arrayBuffer, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    });

    if (supabaseError) {
      console.error('KRYTYCZNY BŁĄD: Commit do GitLab powiódł się, ale upload do Supabase nie!', supabaseError);
      throw supabaseError;
    }

    console.log('Plik pomyślnie zsynchronizowany z GitLab i Supabase.');
    return true;

  } catch (error) {
    console.error(`Błąd podczas procesu synchronizacji pliku ${path}:`, error);
    return false;
  }
}
