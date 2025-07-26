'use client';
import CTAButton from "./CTAButton";
import { Modal } from "react-bootstrap";
import { BsCheckCircleFill, BsXCircleFill } from 'react-icons/bs';

type PopupProps = {
  message: string;
  show: boolean;
  onClose: () => void;
  type?: 'success' | 'error';
};

export default function Popup({ message, onClose, show, type }: PopupProps) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop={true}
      keyboard={true}
      className="popup-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Informacja</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <div className="mb-3">
          {type === 'success' ? (
            <BsCheckCircleFill className="text-success animate__animated animate__bounceIn" size={64} />
          ) : (
            <BsXCircleFill className="text-danger animate__animated animate__shakeX" size={64} />
          )}
        </div>
        <div className="mb-3 fs-5">{message}</div>
      </Modal.Body>
      <Modal.Footer>
        <CTAButton
          text="Zamknij"
          variant="outline-primary"
          type="button"
          onClick={onClose}
        />
      </Modal.Footer>
    </Modal>
  );
}
