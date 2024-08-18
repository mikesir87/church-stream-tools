import { useCallback, useEffect, useState } from "react";
import { useStreamProps } from "../stream/StreamContext";

export function SceneCollectionCreateStep({ collectionName, onComplete }) {
    const { obs } = useStreamProps();
    const [needsToDelete, setNeedsToDelete] = useState(false);
    const [bootstrapped, setBootstrapped] = useState(false);

    // Only run once to check if the scene collection exists at start
    useEffect(() => {
        (async function() {
            const { sceneCollections } = await obs.call("GetSceneCollectionList")

            const collectionExists = sceneCollections.find(sc => sc === collectionName) !== undefined;
            setNeedsToDelete(collectionExists);
            setBootstrapped(true);
        })();
    }, [obs, collectionName, setNeedsToDelete]);

    // Wait for the scene collection to be removed (which has to be done manually right now)
    useEffect(() => {
        if (!needsToDelete) return;

        const interval = setInterval(async () => {
            const { sceneCollections } = await obs.call("GetSceneCollectionList");

            setNeedsToDelete(sceneCollections.find(sc => sc === collectionName) !== undefined);
        }, 1000);

        return () => clearInterval(interval);
    }, [needsToDelete, collectionName]);

    useEffect(() => {
        if (!bootstrapped || needsToDelete) return;

        obs.call("CreateSceneCollection", {
            sceneCollectionName: collectionName,
        }).then(() => onComplete());
    }, [bootstrapped, needsToDelete]);

    return (
        <div>
            <h2>Scene collection setup</h2>
            { needsToDelete && (
                <p>
                    The Scene Collection named <strong>{ collectionName }</strong> currently exists and needs to be removed before proceeding.
                </p>
            )}
        </div>
    );
}