import { FC, useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useStreamProps } from "./StreamContext";

const REFRESH_PERIOD_SECONDS = 10;

export const LiveView : FC = () => {
    const { getScreenshot, activeScene, forceScreenshotCounter } = useStreamProps();
    const [refreshCounter, setRefreshCounter] = useState(0);
    const [refreshTimer, setRefreshTimer] = useState(REFRESH_PERIOD_SECONDS);
    const [imageSrc, setImageSrc] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshTimer(c => {
                if (c - 1 <= 0) {
                    setRefreshCounter(c => c + 1);
                    return REFRESH_PERIOD_SECONDS;
                }
                return c - 1
            });
        }, 1000);
        
        return () => clearInterval(interval);
    }, [setRefreshCounter]);

    useEffect(() => {
        getScreenshot()
            .then((data) => {
                setImageSrc(data.imageData)
                setRefreshTimer(REFRESH_PERIOD_SECONDS);
            });
    }, [getScreenshot, refreshCounter, activeScene, forceScreenshotCounter]);

    const onRefresh = useCallback(() => {
        setRefreshCounter(c => c + 1);
    }, [setRefreshCounter]);

    return (
        <>
            <Row className="text-center">
                <div className="mb-3">
                    <img src={imageSrc} className="img-fluid" alt="Stream preview screenshot" />
                </div>
            </Row>
            <Row className="text-center mb-3">
                <Col>
                    Next refresh in { refreshTimer }
                    <Button variant="secondary" onClick={onRefresh} className="ms-2">Refresh Now</Button>
                </Col>
            </Row>
        </>
    )
};