'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { CmsFile } from '@/lib/content';
import Auth from '@/components/admin/auth';
import CTAButton from '@/components/CTAButton';

export default function ContentManagementPage() {
    const [files, setFiles] = useState<CmsFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<CmsFile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);

    const groupedFiles = useMemo(() => {
        return files.reduce((acc, file) => {
            const lastSlashIndex = file.path.lastIndexOf('/');
            const folder = lastSlashIndex > -1 ? file.path.substring(0, lastSlashIndex) : '/';
            if (!acc[folder]) {
                acc[folder] = [];
            }
            acc[folder].push(file);
            return acc;
        }, {} as Record<string, CmsFile[]>);
    }, [files]);

    const fetchFiles = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/cms/files');
            if (!response.ok) throw new Error('Odpowiedź sieciowa nie była poprawna.');
            const fileList = await response.json();
            setFiles(fileList);
        } catch (e) {
            console.error('Błąd krytyczny podczas pobierania plików:', e);
            setError('Nie udało się pobrać listy plików. Sprawdź konsolę deweloperską (F12).');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    useEffect(() => {
        setFileToUpload(null);
    }, [selectedFile]);

    // Efekt do dynamicznego importu i inicjalizacji JavaScriptu Bootstrapa
    useEffect(() => {
        // Sprawdzamy, czy kod działa w przeglądarce przed importem
        if (typeof window !== 'undefined') {
            import('bootstrap/dist/js/bootstrap.bundle.min.js');
        }
    }, []);

    const handleDownload = async () => {
        if (!selectedFile) return;
        try {
            const response = await fetch(`/api/cms/files/${selectedFile.path}`);
            if (!response.ok) throw new Error('Błąd pobierania linku');
            const data = await response.json();
            window.open(data.signedUrl, '_blank');
        } catch (e) {
            console.error('Błąd podczas pobierania pliku:', e);
            alert('Nie udało się pobrać pliku.');
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFileToUpload(event.target.files[0]);
        } else {
            setFileToUpload(null);
        }
    };

    const handleConfirmUpload = async () => {
        if (!fileToUpload || !selectedFile) return;
        const formData = new FormData();
        formData.append('file', fileToUpload);
        try {
            const response = await fetch(`/api/cms/files/${selectedFile.path}`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Błąd wysyłania pliku');
            }
            alert('Plik zaktualizowany pomyślnie!');
            setFileToUpload(null);
            fetchFiles();
        } catch (e) {
            console.error('Błąd podczas aktualizacji pliku:', e);
            let errorMessage = 'Wystąpił błąd podczas aktualizacji pliku.';
            if (e instanceof Error) {
                errorMessage = `Wystąpił błąd podczas aktualizacji pliku: ${e.message}`;
            }
            alert(errorMessage);
        }
    };

    return (
        <>
            <Auth>
                <div className="container-fluid mt-4">
                    <h1 className="mb-4">Zarządzanie Plikami CMS</h1>
                    <div className="row g-4">
                        <div className="col-lg-5">
                            <div className="card">
                                <div className="card-header">
                                    <h2 className="h5 mb-0">Pliki w buckecie `cms`</h2>
                                </div>
                                {isLoading ? (
                                    <div className="card-body text-center"><p>Ładowanie...</p></div>
                                ) : error ? (
                                    <div className="alert alert-danger mb-0">{error}</div>
                                ) : files.length === 0 ? (
                                    <div className="card-body"><p>Brak plików w buckecie.</p></div>
                                ) : (
                                    <div className="accordion accordion-flush" id="cmsFilesAccordion">
                                        {Object.entries(groupedFiles).sort(([folderA], [folderB]) => folderA.localeCompare(folderB)).map(([folder, folderFiles], index) => (
                                            <div className="accordion-item" key={folder}>
                                                <h2 className="accordion-header" id={`heading-${index}`}>
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${index}`} aria-expanded="false" aria-controls={`collapse-${index}`}>
                                                        {folder}
                                                    </button>
                                                </h2>
                                                <div id={`collapse-${index}`} className="accordion-collapse collapse" aria-labelledby={`heading-${index}`} data-bs-parent="#cmsFilesAccordion">
                                                    <div className="list-group list-group-flush">
                                                        {folderFiles.map((file) => (
                                                            <button
                                                                type="button"
                                                                key={file.path}
                                                                onClick={() => setSelectedFile(file)}
                                                                className={`list-group-item list-group-item-action text-start ${selectedFile?.path === file.path ? 'active' : ''}`}
                                                            >
                                                                {file.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-lg-7">
                            <div className="card">
                                <div className="card-body">
                                    {selectedFile ? (
                                        <div>
                                            <h2 className="h5 mb-3">Wybrany plik: <span className="fw-normal">{selectedFile.path}</span></h2>
                                            <div className="d-flex flex-column gap-4">
                                                <div>
                                                    <h3 className="h6">Pobierz plik</h3>
                                                    <CTAButton
                                                        type="button"
                                                        text="Pobierz"
                                                        onClick={handleDownload}
                                                        variant="secondary"
                                                    />
                                                </div>
                                                <hr />
                                                <div>
                                                    <h3 className="h6">Aktualizuj plik</h3>
                                                    <p className="mb-2">Wybierz nowy plik, aby nadpisać <strong>{selectedFile.path}</strong>:</p>
                                                    <input type="file" className="form-control" onChange={handleFileChange} />
                                                    {fileToUpload && (
                                                        <div className="mt-3">
                                                            <CTAButton
                                                                type="button"
                                                                text={`Potwierdź aktualizację na: ${fileToUpload.name}`}
                                                                onClick={handleConfirmUpload}
                                                                variant="primary"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-muted mb-0">Wybierz plik z listy, aby zobaczyć opcje.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Auth>
        </>
    );
}
