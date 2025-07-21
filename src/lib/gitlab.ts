// src/lib/gitlab.ts
import { Buffer } from 'buffer';

const gitlabToken = process.env.GITLAB_ACCESS_TOKEN;
const projectId = process.env.GITLAB_PROJECT_ID;
const branch = process.env.GITLAB_BRANCH || 'main';

// Definiujemy prefiks, który będzie dodawany do ścieżki pliku przed commitem do GitLab.
const REPO_PATH_PREFIX = 'src/content/';

/**
 * Tłumaczy ścieżkę z bucketa na pełną ścieżkę w repozytorium GitLab.
 * @param bucketPath - Ścieżka z bucketa Supabase (np. 'policies/privacy.md')
 * @returns Pełna ścieżka w repozytorium (np. 'src/content/policies/privacy.md')
 */
function getRepoPath(bucketPath: string): string {
  return `${REPO_PATH_PREFIX}${bucketPath}`;
}

/**
 * Wysyła plik do repozytorium GitLab, tworząc nowy commit.
 * @param bucketPath - Ścieżka do pliku w buckecie Supabase.
 * @param content - Zawartość pliku jako ArrayBuffer.
 * @param commitMessage - Komunikat commita.
 * @returns {Promise<boolean>} - True, jeśli operacja się powiodła.
 */
export async function commitFileToGitLab(bucketPath: string, content: ArrayBuffer, commitMessage: string): Promise<boolean> {
  if (!gitlabToken || !projectId) {
    console.error('Brak konfiguracji GitLab (GITLAB_ACCESS_TOKEN lub GITLAB_PROJECT_ID). Pomijam commit.');
    return false;
  }

  // Używamy naszej nowej funkcji do uzyskania poprawnej ścieżki w repozytorium
  const repoPath = getRepoPath(bucketPath);
  const contentBase64 = Buffer.from(content).toString('base64');
  const gitlabApiUrl = `https://gitlab.com/api/v4/projects/${projectId}/repository/files/${encodeURIComponent(repoPath)}`;

  try {
    const existingFileResponse = await fetch(gitlabApiUrl, {
      method: 'GET',
      headers: { 'PRIVATE-TOKEN': gitlabToken },
    });

    const method = existingFileResponse.ok ? 'PUT' : 'POST';

    const response = await fetch(gitlabApiUrl, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'PRIVATE-TOKEN': gitlabToken,
      },
      body: JSON.stringify({
        branch: branch,
        content: contentBase64,
        encoding: 'base64',
        commit_message: commitMessage,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Błąd API GitLab (${response.status}): ${JSON.stringify(errorData)}`);
    }

    console.log(`Pomyślnie zacommitowano plik: ${repoPath}`);
    return true;
  } catch (error) {
    console.error(`Krytyczny błąd podczas commitowania do GitLab dla pliku ${repoPath}:`, error);
    return false;
  }
}
