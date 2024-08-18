import { FC, useEffect } from "react";
import { Dashboard } from "./stream/Dashboard";
import { useStreamProps } from "./stream/StreamContext";
import { useNavigate } from "react-router-dom";

export const StreamControlRoute : FC = () => {
    const { obs } = useStreamProps();
    const navigate = useNavigate();

    useEffect(() => {
        (async function() {
            const { sceneCollections } = await obs.call("GetSceneCollectionList");
            if (sceneCollections.indexOf("Church stream") === -1) {
                navigate("/setup");
            }
        })();
    }, [obs, navigate]);


    return (
        <Dashboard />
    );
}