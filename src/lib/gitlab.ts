import { Buffer } from 'buffer';

const gitlabToken = process.env.GITLAB_ACCESS_TOKEN;
const projectId = process.env.GITLAB_PROJECT_ID;
const branch = process.env.GITLAB_BRANCH || 'main';

const REPO_PATH_PREFIX = 'src/content/';

function getRepoPath(bucketPath: string): string {
  return `${REPO_PATH_PREFIX}${bucketPath}`;
}

export async function commitFileToGitLab(bucketPath: string, content: ArrayBuffer, commitMessage: string): Promise<boolean> {
  if (!gitlabToken || !projectId) {
    console.error('Brak konfiguracji GitLab (GITLAB_ACCESS_TOKEN lub GITLAB_PROJECT_ID). Pomijam commit.');
    return false;
  }

  const repoPath = getRepoPath(bucketPath);
  const contentBase64 = Buffer.from(content).toString('base64');
  // Zmieniamy URL, aby wskazywał na metodę PUT, która jest bardziej uniwersalna
  const gitlabApiUrl = `https://gitlab.com/api/v4/projects/${projectId}/repository/files/${encodeURIComponent(repoPath)}`;

  try {
    // Używamy teraz zawsze metody PUT, która tworzy plik, jeśli nie istnieje, lub go aktualizuje.
    const response = await fetch(gitlabApiUrl, {
      method: 'PUT', // Zawsze używamy PUT
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
      const errorText = await response.text();
      console.error('Pełna odpowiedź błędu z GitLab API:', errorText);
      throw new Error(`Błąd API GitLab (${response.status}): ${errorText}`);
    }

    console.log(`Pomyślnie zacommitowano plik: ${repoPath}`);
    return true;
  } catch (error) {
    console.error(`Krytyczny błąd podczas commitowania do GitLab dla pliku ${repoPath}:`, error);
    return false;
  }
}
