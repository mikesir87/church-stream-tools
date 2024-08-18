import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect, useState } from "react";
import { SceneCollectionCreateStep } from "./SceneCollectionCreateStep";
import { InfoGatheringStep } from "./InfoGatheringStep";
import { createAndSetupProfile, createScenes, populateAndConfigureSources } from '../../ObsUtil';
import { useStreamProps } from '../stream/StreamContext';
import { Link } from 'react-router-dom';

const PROFILE_NAME = "Church stream";
const SCENE_COLLECTION_NAME = "Church stream";

export function StreamSetupRoute() {
    const { obs } = useStreamProps();
    const [ step, setStep ] = useState(0);
    const [ profileConfig, setProfileConfig ] = useState(null);
    const [ youTubeKey, setYouTubeKey ] = useState(null);

    useEffect(() => {
        fetch("/controller/profileConfig.json")
            .then(r => r.json())
            .then(setProfileConfig);
    }, [setProfileConfig]);

    useEffect(() => {
        if (step !== 1) return;

        (async function () {
            const { profiles } = await obs.call("GetProfileList");
            console.log("PROFILES", profiles);
            if (profiles.indexOf(PROFILE_NAME) > -1) {
                console.log("Removing profile");
                await obs.call("RemoveProfile", { profileName: PROFILE_NAME });
                await wait(500);
                console.log("And removed");
            }

            await createAndSetupProfile(obs, PROFILE_NAME, youTubeKey);
            setStep(s => s + 1);
        })();
    }, [obs, step, youTubeKey, setStep]);

    useEffect(() => {
        if (!profileConfig || step !== 3) return;

        (async function () {
            const sceneIds = await createScenes(obs, profileConfig);
            console.log("Scene ids", sceneIds);

            await populateAndConfigureSources(obs, profileConfig, sceneIds);
            
            const { scenes } = await obs.call("GetSceneList");
            if (scenes.find(s => s.sceneName === "Scene")) {
                await obs.call("RemoveScene", {
                    sceneName: "Scene"
                });
            }

            const settings = await obs.call("GetOutputList");
            console.log("Output list", settings);

            setStep(s => s + 1);
        })();
    }, [obs, profileConfig, step, setStep]);

    return (
        <Container>
            <Row className="mt-5">
                <Col>
                    <h1>OBS Setup</h1>
                    <div>
                        { step === 0 && (
                            <InfoGatheringStep onComplete={({ youTubeKey }) => {
                                setYouTubeKey(youTubeKey);
                                setStep(s => s + 1)
                            }} />
                        )}
                        
                        { step === 2 && (
                            <SceneCollectionCreateStep 
                                collectionName={SCENE_COLLECTION_NAME} 
                                onComplete={() => setStep(s => s + 1)} 
                            />
                        )}

                        { step === 4 && (
                            <>
                                <h2>And done!</h2>
                                <p>There are a few other things to configure, which can't be done programatically:</p>
                                <ol>
                                    <li>Double click the <strong>Camera input</strong> source and select the proper camera</li>
                                    <li>Double click the <strong>Church audio input</strong> source and select the proper audio input</li>
                                    <li>Update YouTube streaming output to use the following settings (Settings -> Output):
                                        <ol>
                                            <li>Video bitrate: 3758 Kbps</li>
                                            <li>Audio bitrate: 160</li>
                                            <li>Video Encoder: Hardware (Apple, H.264)</li>
                                        </ol>
                                    </li>
                                </ol>
                                <p>
                                    <Link to="/">Go to the controller</Link>
                                </p>
                            </>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}