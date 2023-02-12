import { useEffect, useContext, useState, createContext, FC, ReactNode, useCallback } from "react";
import OBSWebSocket from 'obs-websocket-js';
import { SCENE_BLANK, SCENE_CAMERA, SCENE_HYMNS, SCENE_INTRO, SCENE_SACRAMENT_PAUSED, SCENE_THANKS_FOR_JOINING } from "../../consts";

const obs = new OBSWebSocket();

declare global {
    interface Window { obs: any; }
}
window.obs = window.obs = obs;

interface ScreenshotData {
    imageData: string;
}

interface StreamStatus { 
    active: boolean;
    reconnecting: boolean;
    skippedFrames: number;
}

interface StreamContextProps {
    isConnected: boolean;
    isTransitioning: boolean;
    streamStatus: StreamStatus;
    connect: (host: string, password: string) => void;
    connectionError: string | null;
    activeScene: string;
    showIntro: () => void;
    showCamera: () => void;
    showHymn: (hymnNumber: any) => void;
    startSacramentPause: () => void;
    endStream: () => void;
    getScreenshot: () => Promise<ScreenshotData>;
    forceScreenshotCounter: number;
    forceScreenshotUpdate: () => void;
    obs : OBSWebSocket;
}

const defaultStreamContextProps : StreamContextProps = {
    isConnected: false,
    isTransitioning: false,
    streamStatus: { active: false, reconnecting: false, skippedFrames: 0 },
    connect() {},
    connectionError: null,
    activeScene : "",
    showIntro() {},
    showCamera() {},
    showHymn() {},
    startSacramentPause() {},
    endStream() {},
    getScreenshot: () => Promise.resolve({ imageData: "" }),
    forceScreenshotCounter: 0,
    forceScreenshotUpdate() {},
    obs,
};

interface StreamContextProviderProps {
    children: ReactNode,
}

const StreamContext = createContext<StreamContextProps>(defaultStreamContextProps);

export const StreamContextProvider : FC<StreamContextProviderProps> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [streamStatus, setStreamStatus] = useState<StreamStatus>({ active: false, reconnecting: false, skippedFrames: 0 });
    const [activeScene, setActiveScene] = useState("");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [forceScreenshotCounter, setForceScreenshotCounter] = useState(0);

    const connect = useCallback((host: string, password: string) => {
        if (isConnected) return;
        obs.connect(host, password)
            .catch(err => setConnectionError(err.message));
    }, [isConnected]);

    const showIntro = useCallback(() => {
        obs.call("SetCurrentProgramScene", { sceneName: SCENE_INTRO });
    }, []);

    const showCamera = useCallback(() => {
        obs.call("SetCurrentProgramScene", { sceneName: SCENE_CAMERA });
    }, []);

    const showHymn = useCallback((hymnNumber: number) => {
        async function run() {
            const data = await obs.call("GetInputSettings", { inputName: "Hymn browser" });

            data.inputSettings.url = `https://hymns.blacksburglds.com/${hymnNumber}`;
            await obs.call("SetInputSettings", { inputName: "Hymn browser", inputSettings: data.inputSettings });

            obs.call("SetCurrentProgramScene", { sceneName: SCENE_HYMNS });
        }

        run();
    }, []);

    const startSacramentPause = useCallback(() => {
        obs.call("SetCurrentProgramScene", { sceneName: SCENE_SACRAMENT_PAUSED });
    }, []);

    const endStream = useCallback(() => {
        obs.call("SetCurrentProgramScene", { sceneName: SCENE_THANKS_FOR_JOINING });

        setTimeout(() => obs.call("SetCurrentProgramScene", { sceneName: SCENE_BLANK }), 15000);
        setTimeout(() => obs.call("StopStream"), 20000);
    }, []);

    const getScreenshot = useCallback(() => {
        return obs.call("GetSourceScreenshot", {
            sourceName: activeScene,
            imageFormat: "jpg",
            imageWidth: 960,
            imageHeight: 540
        });
    }, [activeScene]);

    const forceScreenshotUpdate = useCallback(() => {
        setForceScreenshotCounter(c => c + 1);
    }, [setForceScreenshotCounter]);

    useEffect(() => {
        obs.on("Identified", async () => setIsConnected(true));
        obs.on("ConnectionClosed", () => setIsConnected(false));
        obs.on("CurrentProgramSceneChanged", (data) => {
            setActiveScene(data.sceneName || "");
        });
        obs.on("SceneTransitionStarted", () => setIsTransitioning(true));
        obs.on("SceneTransitionEnded", () => setIsTransitioning(false));
        obs.on("StreamStateChanged", (data) => {
            setStreamStatus({ 
                active: data.outputActive,
                reconnecting: false,
                skippedFrames: 0,
            })
        });
    }, [setIsConnected, setActiveScene, setIsTransitioning]);

    useEffect(() => {
        if (!isConnected) return;

        setConnectionError(null);

        obs.call("GetSceneList")
            .then((sceneData) => {
                setActiveScene(sceneData.currentProgramSceneName);
            });

        obs.call("GetStreamStatus")
            .then((data) => setStreamStatus({ 
                active: data.outputActive, 
                reconnecting: data.outputReconnecting, 
                skippedFrames: data.outputSkippedFrames 
            }));

        const refreshInterval = setInterval(() => {
            obs.call("GetStreamStatus")
                .then((data) => {
                    setStreamStatus({
                        active: data.outputActive,
                        reconnecting: data.outputReconnecting,
                        skippedFrames: data.outputSkippedFrames
                    });
                });
        }, 5000);
        return () => clearInterval(refreshInterval);
    }, [isConnected, setStreamStatus]);


    return (
        <StreamContext.Provider value={{ 
            isConnected, isTransitioning, streamStatus, connect, connectionError, activeScene, 
            showIntro, showCamera, showHymn, startSacramentPause, endStream,
            getScreenshot, forceScreenshotCounter, forceScreenshotUpdate, obs,
        }}>
            { children }
        </StreamContext.Provider>
    )
};

export const useStreamProps = () => {
    return useContext(StreamContext);
};