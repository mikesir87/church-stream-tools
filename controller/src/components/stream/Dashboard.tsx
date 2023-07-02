import { FC } from "react";
import Container from "react-bootstrap/Container";
import { useStreamProps } from "./StreamContext";
import { FixCameraDisplay } from "./FixCameraDisplay";
import { LiveView } from "./LiveView";
import { SceneChanger } from "./SceneChanger";
import { StreamStatusDisplay } from "./StreamStatusDisplay";
import { LoginForm } from "./LoginForm";

export const Dashboard : FC = () => {
    const { isConnected } = useStreamProps();
    
    if (!isConnected) {
        return (
            <LoginForm />
        );
    }

    return (
        <Container className="mt-2">
            <StreamStatusDisplay />
            <SceneChanger />
            <LiveView />
            {/* <FixCameraDisplay /> */}
        </Container>
    )
};