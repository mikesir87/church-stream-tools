import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useCallback, useState } from 'react';

export function InfoGatheringStep({ onComplete }) {
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [youTubeKey, setYouTubeKey] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        onComplete({ youTubeKey});
    };

    return (
        <>
            <p>Please provide the following information to help setup your OBS install to support church streaming.</p>

            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="hostInput">
                    <Form.Label>YouTube Stream Key</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={youTubeKey} 
                        onChange={(e) => setYouTubeKey(e.target.value)} 
                        autoFocus
                        placeholder=""
                        required
                    />
                    <Form.Text className="text-muted">
                        Need help finding this? <Button variant="link" className="p-0" size="sm" onClick={() => setShowHelpModal(true)}>Click here</Button>
                    </Form.Text>
                </Form.Group>

                <p><Button type="submit" variant="primary">Start setup</Button></p>
            </Form>

            <Modal show={showHelpModal} size="lg" onHide={() => setShowHelpModal(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Obtaining YouTube Stream Key</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>To get the stream key, complete the following steps:</p>
                    <ol>
                        <li>Open <a href="https://studio.youtube.com/" target='_blank'>YouTube Studio</a></li>
                        <li>Click on the <strong>Go Live</strong> button in the top-right corner</li>
                        <li>Select an existing stream or create a scheduled event for a future stream</li>
                        <li>In the <strong>Stream settings</strong> tab, copy the <strong>Stream key</strong> field</li>
                    </ol>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowHelpModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}