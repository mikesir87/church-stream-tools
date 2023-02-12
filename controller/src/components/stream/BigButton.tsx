import { FC, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import { useStreamProps } from "./StreamContext";
import "./BigButton.css";

interface BigButtonProps {
    text: string;
    onClick: () => void;
    requireVerification?: boolean;
    variant?: "primary" | "secondary" | "danger" | "warning" | "success";
}

export const BigButton : FC<BigButtonProps> = ({ text, onClick, requireVerification, variant }) => {
    const { isTransitioning } = useStreamProps();

    const handleClick = useCallback(() => {
        if (requireVerification === undefined || window.confirm("Are you sure?"))
            onClick();
    }, [onClick, requireVerification]);

    return (
        <Col className="mb-3">
            <Button onClick={handleClick} disabled={isTransitioning} className="big-button" variant={variant}>
                { text }
            </Button>
        </Col>
    );
}