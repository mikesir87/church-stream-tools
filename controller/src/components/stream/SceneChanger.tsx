import { FC } from "react";
import Row from "react-bootstrap/Row";
import { SCENE_CAMERA, SCENE_HYMNS, SCENE_INTRO, SCENE_SACRAMENT_PAUSED } from "../../consts";
import { useStreamProps } from "./StreamContext";
import { BigButton } from "./BigButton";
import { HymnButtons } from "./HymnButtons";
import { ShowHymnButton } from "./ShowHymnButton";
import { ShowName } from "./ShowName";

export const SceneChanger : FC = () => {
    return (
        <Row id="scene-changer" className="mb-3">
            <SceneChangingButtons />
        </Row>
    )
}

const SceneChangingButtons : FC = () => {
    const { activeScene, showCamera, startSacramentPause, endStream } = useStreamProps();

    if (activeScene === SCENE_INTRO) {
        return (
            <BigButton text="Go to Camera View" onClick={showCamera} />
        )
    }

    if (activeScene === SCENE_CAMERA) {
        return (
            <>
                <ShowHymnButton />
                <ShowName />
                <BigButton text="Pause stream" onClick={startSacramentPause} requireVerification="pause the stream" />
                <BigButton text="End stream" variant="danger" onClick={endStream} requireVerification="end the stream" />
            </>
        )
    }

    if (activeScene === SCENE_HYMNS) {
        return (
            <>
                <BigButton text="Go to Camera" onClick={showCamera} />
                <HymnButtons />
            </>
        )
    }

    if (activeScene === SCENE_SACRAMENT_PAUSED) {
        return (
            <>
                <BigButton text="Resume stream" onClick={showCamera} />
            </>
        );
    }
    
    return <p>No available scenes to switch from at this point</p>
};