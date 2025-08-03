# Pobierz listę zmienionych plików względem poprzedniego deploya
CHANGED_FILES=$(git diff --name-only $VERCEL_GIT_PREVIOUS_SHA $VERCEL_GIT_COMMIT_REF)

# Sprawdź, czy zmiany dotyczą istotnych plików/folderów
if ! echo "$CHANGED_FILES" | grep -qE '^(
  src/|
  public/|
  data/|
  next\.config\.js|
  next\.config\.ts|
  package\.json|
  package-lock\.json|
  tsconfig\.json|
  \.env|
  \.env\.local|
  README\.md|
  CHANGELOG\.md
)' ; then
  echo "Brak istotnych zmian, pomijam build."
  exit 0
fi

# Jeśli były zmiany w powyższych - build przebiegnie normalnie
