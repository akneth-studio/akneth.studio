'use client';

import { useEffect, useState } from "react";
import { Table, OverlayTrigger, Tooltip, Modal, Form } from "react-bootstrap";
import CTAButton from "@/components/CTAButton";
import Popup from "@/components/Popup";
import { BiPlus, BiTrash, BiPencil } from "react-icons/bi";
import Auth from "@/components/admin/auth";

type Mode = "vacation" | "maintenance";
interface BannerRow {
    id: string;
    mode: Mode;
    announce_from: string;
    date_start: string;
    date_end: string;
    visible: boolean;
}
const MODES = [
    { value: "vacation", label: "Urlop" },
    { value: "maintenance", label: "Prace serwisowe" },
];

type ModalType = "add" | "edit" | null;

export default function VacationAdminPage() {
    const [banners, setBanners] = useState<BannerRow[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [editRecord, setEditRecord] = useState<BannerRow | null>(null);

    // Formularz
    const [form, setForm] = useState<Omit<BannerRow, "id">>({
        mode: "vacation",
        announce_from: "",
        date_start: "",
        date_end: "",
        visible: true,
    });
    const [formError, setFormError] = useState<Record<string, string>>({});
    const [popup, setPopup] = useState<{ show: boolean; type?: "success" | "error"; message: string }>({
        show: false, message: "", type: "success",
    });
    const [processing, setProcessing] = useState(false);

    // Pobierz dane
    useEffect(() => { fetchData(); }, []);
    async function fetchData() {
        setLoading(true);
        try {
            const res = await fetch("/api/banners");
            if (!res.ok) {
                throw new Error("Nie udało się pobrać komunikatów.");
            }
            const data: BannerRow[] = await res.json();
            setBanners(data.sort((a, b) => b.date_start.localeCompare(a.date_start)));
        } catch (e) {
            setBanners([]);
            setPopup({ show: true, type: "error", message: `Błąd pobierania komunikatów: ${e}` });
        } finally {
            setLoading(false);
        }
    }

    // Modal
    function openAddModal() {
        setForm({
            mode: "vacation",
            announce_from: new Date().toISOString().slice(0, 16),
            date_start: new Date().toISOString().slice(0, 16),
            date_end: new Date().toISOString().slice(0, 16),
            visible: true,
        });
        setFormError({});
        setEditRecord(null);
        setModalType("add");
        setShowModal(true);
    }
    function openEditModal(record: BannerRow) {
        setForm({
            mode: record.mode,
            announce_from: record.announce_from.slice(0, 16),
            date_start: record.date_start.slice(0, 16),
            date_end: record.date_end.slice(0, 16),
            visible: record.visible,
        });
        setFormError({});
        setEditRecord(record);
        setModalType("edit");
        setShowModal(true);
    }
    function closeModal() {
        setShowModal(false);
        setModalType(null);
        setEditRecord(null);
        setFormError({});
    }

    // Walidacja
    function validateForm() {
        const err: Record<string, string> = {};
        if (!form.mode) err.mode = "Wybierz typ komunikatu.";
        if (!form.announce_from) err.announce_from = "Wymagane.";
        if (!form.date_start) err.date_start = "Wymagane.";
        if (!form.date_end) err.date_end = "Wymagane.";
        if (form.date_start && form.date_end && form.date_end < form.date_start) {
            err.date_end = "Data zakończenia nie może być wcześniejsza niż początek.";
        }
        setFormError(err);
        return Object.keys(err).length === 0;
    }

    // Zamiana local datetime na ISO UTC
    function toISOStringLocal(dt: string) {
        const date = new Date(dt);
        return date.toISOString();
    }

    // Submit (Dodaj/Edytuj)
    async function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validateForm()) return;
        setProcessing(true);
        try {
            const url = "/api/banners";
            const method = modalType === "edit" ? "PATCH" : "POST";
            const body = modalType === "edit" && editRecord
                ? {
                    id: editRecord.id,
                    ...form,
                    announce_from: toISOStringLocal(form.announce_from),
                    date_start: toISOStringLocal(form.date_start),
                    date_end: toISOStringLocal(form.date_end),
                  }
                : {
                    ...form,
                    announce_from: toISOStringLocal(form.announce_from),
                    date_start: toISOStringLocal(form.date_start),
                    date_end: toISOStringLocal(form.date_end),
                  };
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const result = await res.json();
            if (!res.ok) {
                const msg =
                    result?.error?.message ||
                    (modalType === "add" ? "Błąd przy dodawaniu komunikatu." : "Nie udało się zaktualizować.");
                throw new Error(msg);
            }
            setPopup({
                show: true, type: "success",
                message: modalType === "add" ? "Dodano komunikat." : "Zaktualizowano komunikat."
            });
            closeModal();
            fetchData();
        } catch (e: unknown) {
            const errorMsg =
                (typeof e === "object" && e !== null && "message" in e && typeof (e as { message?: unknown }).message === "string")
                    ? (e as { message: string }).message
                    : (modalType === "add"
                        ? "Nie powiodło się dodanie komunikatu."
                        : "Nie powiodła się edycja komunikatu.");
            setPopup({
                show: true, type: "error",
                message: errorMsg
            });
        } finally {
            setProcessing(false);
        }
    }

    // Usuwanie
    async function handleDelete(id: string) {
        const ok = typeof window !== "undefined" ? window.confirm("Na pewno usunąć ten komunikat?") : false;
        if (!ok) return;
        setProcessing(true);
        try {
            const res = await fetch("/api/banners", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data?.error?.message || "Nie udało się usunąć komunikatu.");
            }
            setPopup({ show: true, type: "success", message: "Usunięto komunikat." });
            fetchData();
        } catch (e: unknown) {
            let errorMsg = "Nie udało się usunąć komunikatu.";
            if (typeof e === "object" && e !== null && "message" in e && typeof (e as { message?: unknown }).message === "string") {
                errorMsg = (e as { message: string }).message;
            }
            setPopup({ show: true, type: "error", message: errorMsg });
        } finally {
            setProcessing(false);
        }
    }

    // Handler formularza: checkbox osobno obsługuje checked
    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, type, value, checked } = e.target;
        setForm((f) => ({
            ...f,
            [name]: type === "checkbox" ? checked : value
        }));
    }
    function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm((f) => ({
            ...f,
            [name]: value
        }));
    }


    return (
        <>
            <Auth>
                <div className="py-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold mb-0">Zarządzanie komunikatami (urlop, serwis, historia)</h2>
                        <CTAButton
                            text='Dodaj komunikat'
                            icon={<BiPlus className="me-2" />}
                            variant="primary"
                            type="button"
                            className="d-flex align-items-center"
                            onClick={openAddModal}
                            data-testid="add-banner-button"
                        />
                    </div>
                    <Table bordered hover responsive>
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Typ</th>
                                <th>Zakres</th>
                                <th>Ogłoszenie</th>
                                <th>Widoczny</th>
                                <th>Akcje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center">Wczytywanie…</td></tr>
                            ) : banners.length === 0 ? (
                                <tr><td colSpan={6} className="text-center text-muted">Brak komunikatów w bazie.</td></tr>
                            ) : (
                                banners.map((b) => (
                                    <tr key={b.id}>
                                        <td>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip id={`tip-id-${b.id}`}>{b.id}</Tooltip>}
                                            >
                                                <span>{b.id.slice(0, 8)}…</span>
                                            </OverlayTrigger>
                                        </td>
                                        <td>{MODES.find((m) => m.value === b.mode)?.label || b.mode}</td>
                                        <td>
                                            {new Date(b.date_start).toLocaleDateString("pl-PL", { timeZone: 'Europe/Warsaw' })} —<br />
                                            {new Date(b.date_end).toLocaleDateString("pl-PL", { timeZone: 'Europe/Warsaw' })}
                                        </td>
                                        <td>{new Date(b.announce_from).toLocaleString("pl-PL", { timeZone: 'Europe/Warsaw' })}</td>
                                        <td>{b.visible ? "TAK" : "NIE"}</td>
                                        <td className="d-flex gap-2">
                                            <CTAButton
                                                icon={<BiPencil className="me-2" />}
                                                text='Edytuj'
                                                variant="outline-primary"
                                                type="button"
                                                className="d-flex align-items-center"
                                                onClick={() => openEditModal(b)}
                                                data-testid={`edit-banner-${b.id}`}
                                            />
                                            <CTAButton
                                                icon={<BiTrash className="me-2" />}
                                                text='Usuń'
                                                variant="outline-danger"
                                                type="button"
                                                className="d-flex align-items-center"
                                                onClick={() => handleDelete(b.id)}
                                                data-testid={`delete-banner-${b.id}`}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>

                    {/* MODAL Form Bootstrap */}
                    <Modal
                        show={showModal}
                        onHide={closeModal}
                        centered
                        backdrop={true}
                        keyboard={true}
                    >
                        <Form onSubmit={handleFormSubmit}>
                            <Modal.Header closeButton>
                                <Modal.Title data-testid="modal-title">
                                    {modalType === "edit" ? "Edytuj komunikat" : "Dodaj komunikat"}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {modalType === "edit" && editRecord && (
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="id" className="fw-bold">ID (readonly)</Form.Label>
                                        <Form.Control
                                            id="id"
                                            type="text"
                                            value={editRecord.id}
                                            readOnly
                                            style={{ background: "#f6f6f6" }}
                                        />
                                    </Form.Group>
                                )}
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="mode" className="fw-bold">Typ komunikatu</Form.Label>
                                    <Form.Select
                                        id="mode"
                                        name="mode"
                                        value={form.mode}
                                        onChange={handleSelectChange}
                                        isInvalid={!!formError.mode}
                                        required
                                    >
                                        {MODES.map((m) => (
                                            <option key={m.value} value={m.value}>{m.label}</option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{formError.mode}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="announce_from" className="fw-bold">Ogłoszenie od</Form.Label>
                                    <Form.Control
                                        id="announce_from"
                                        type="datetime-local"
                                        name="announce_from"
                                        value={form.announce_from}
                                        onChange={handleInputChange}
                                        isInvalid={!!formError.announce_from}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">{formError.announce_from}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="date_start" className="fw-bold">Początek</Form.Label>
                                    <Form.Control
                                        id="date_start"
                                        type="datetime-local"
                                        name="date_start"
                                        value={form.date_start}
                                        onChange={handleInputChange}
                                        isInvalid={!!formError.date_start}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">{formError.date_start}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="date_end" className="fw-bold">Koniec</Form.Label>
                                    <Form.Control
                                        id="date_end"
                                        type="datetime-local"
                                        name="date_end"
                                        value={form.date_end}
                                        onChange={handleInputChange}
                                        isInvalid={!!formError.date_end}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">{formError.date_end}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label htmlFor="visible" className="fw-bold">Widoczny</Form.Label>
                                    <Form.Check
                                        id="visible"
                                        type="checkbox"
                                        name="visible"
                                        label="Komunikat widoczny"
                                        checked={form.visible}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <CTAButton
                                    text="Anuluj"
                                    variant="outline-secondary"
                                    type="button"
                                    onClick={closeModal}
                                    disabled={processing}
                                />
                                <CTAButton
                                    text={modalType === "edit" ? "Zapisz" : "Dodaj"}
                                    variant="primary"
                                    type="submit"
                                    disabled={processing}
                                    data-testid="modal-submit-button"
                                />
                            </Modal.Footer>
                        </Form>
                    </Modal>

                    <Popup
                        show={popup.show}
                        message={popup.message}
                        onClose={() => setPopup({ show: false, message: "" })}
                        type={popup.type}
                    />
                </div>
            </Auth>
        </>
    );
}
