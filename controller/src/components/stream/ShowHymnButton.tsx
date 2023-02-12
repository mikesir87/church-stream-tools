import { FC, FormEvent, useCallback, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { useStreamProps } from "./StreamContext";
import { BigButton } from "./BigButton";

export const ShowHymnButton : FC = () => {
    const { showHymn } = useStreamProps();
    const [showHymnEntryModal, setShowHymnEntryModal] = useState(false);
    const [hymnNumber, setHymnNumber] = useState("");
    const [updating, setUpdating] = useState(false);

    const handleHymnClick = useCallback(() => {
        setShowHymnEntryModal(true);
    }, [setShowHymnEntryModal]);

    const handleHymnSubmission = useCallback((e : FormEvent) => {
        e.preventDefault();
        showHymn(hymnNumber);
        setUpdating(true);
    }, [showHymn, hymnNumber]);

    const handleModalClose = useCallback(() => {
        setHymnNumber("");
        setShowHymnEntryModal(false);
    }, [setHymnNumber, setShowHymnEntryModal]);

    return (
        <>
            <BigButton text="Show Hymn" onClick={handleHymnClick} />

            <Modal show={showHymnEntryModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleHymnSubmission}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Hymn Number</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={hymnNumber} 
                                onChange={(e) => setHymnNumber(e.target.value)} 
                                autoFocus
                                disabled={updating}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose} disabled={updating}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleHymnSubmission} disabled={updating}>
                        { updating ? (
                            <Spinner animation="border" role="status" size="sm">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        ) : "Show Hymn" }
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}