import React from 'react'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function ModalPopup({ msg, path, show, setShow, needRender, setNeedRender }) {
    const redirect = useNavigate();
    const handleClose = () => {
        setShow(false);
        redirect(`${path}`);
        setNeedRender(!needRender);
    }
    return (
        <Modal show={show} onHide={handleClose} keyboard={false}>
            <Modal.Body>{msg}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Quay lại
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
