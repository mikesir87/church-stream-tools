import { FormEvent, useCallback, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useStreamProps } from "./StreamContext";

export const LoginForm = () => {
  const { connect, connectionError } = useStreamProps();
  const [host, setHost] = useState(localStorage.getItem("stream-controller/host") || "");
  const [password, setPassword] = useState(localStorage.getItem("stream-controller/password") || "");
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  const connectCallback = useCallback((e : FormEvent) => {
      e.preventDefault();
      let hostToUse = (host.indexOf(":") > -1) ? `[${host}]` : host;
      connect(`ws://${hostToUse}:4455`, password);
  }, [host, password, connect]);

  useEffect(() => { if (host) localStorage.setItem("stream-controller/host", host) }, [host]);
  useEffect(() => { if (password) localStorage.setItem("stream-controller/password", password) }, [password]);

  return (
    <>
      <Container>
        <Row className="mt-5">
            <Col>
                <h2>You are not connected to OBS</h2>
                <p>Provide connection details below to connect to OBS.</p>

                <Alert variant="info">
                  Need help finding the login info? <Button variant="link" size="sm" onClick={() => setShowHelpModal(true)}>Click here for additional info</Button>
                </Alert>

                <Form onSubmit={connectCallback}>
                    <Form.Group className="mb-3" controlId="hostInput">
                        <Form.Label>Host Name/IP Address</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={host} 
                            onChange={(e) => setHost(e.target.value)} 
                            autoFocus
                            placeholder="localhost"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="hostPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </Form.Group>
                    <p><Button type="submit" variant="primary">Connect</Button></p>

                    { connectionError && (
                        <Alert variant="danger">{ connectionError }</Alert>
                    )}
                </Form>
            </Col>
        </Row>
      </Container>
      <Modal show={showHelpModal} size="lg" onHide={() => setShowHelpModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Connecting to OBS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>To get the connection details, complete the following steps:</p>
          <ol>
            <li>In OBS, go to <strong>Tools</strong> &rarr; <strong>WebSocket Server Settings</strong></li>
            <li>If the top checkbox isn't checked (labeled <strong>Enable WebSocket server</strong>), check it</li>
            <li>Check the <strong>Enable Authentication</strong> box and enter a password. This password should simple, as it will be transported unencrypted.</li>
            <li>Click on the <strong>Show connect Info</strong> button. The IP address and password will be displayed. You can use the Copy button</li>
          </ol>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHelpModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};