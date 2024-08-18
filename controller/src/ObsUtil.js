import { useEffect, useState } from "react";
import { useStreamProps } from "./components/stream/StreamContext";

export async function createAndSetupProfile(obs, profileName, youtubeKey) {
    try {
        await obs.call("CreateProfile", {
            profileName,
        });

        // Create new profile and configure settings
        await obs.call("SetStreamServiceSettings", {
            streamServiceType: "rtmp_common",
            streamServiceSettings: {
                bwtest: false,
                key: youtubeKey,
                multitrack_video_disclaimer: "Multitrack Video automatically optimizes your settings to encode and send multiple video qualities to YouTube - RTMPS. Selecting this option will send YouTube - RTMPS information about your computer and software setup.",
                multitrack_video_name: "Multitrack Video",
                protocol: "RTMPS",
                server: "rtmps://a.rtmps.youtube.com:443/live2",
                service: "YouTube - RTMPS",
                stream_key_link: "https://www.youtube.com/live_dashboard"
            }
        });

        await obs.call("SetVideoSettings", {
            fpsNumerator: 30,
            fpsDenominator: 1,
            baseWidth: 1920,
            baseHeight: 1080,
            outputWidth: 1920,
            outputHeight: 1080,
        });
    } catch (e) {
        console.error("Error creating profile", e);
    }
}

export async function createScenes(obs, profileConfig) {
    const scenes = [];

    const { scenes : currentSceneList } = await obs.call("GetSceneList");

    const allScenesConfig = profileConfig.sources
        .filter(s => s.id === "scene");

    const sceneNamesToCreate = profileConfig.scene_order
        .map(s => s.name)
        .reverse();

    for (let name of sceneNamesToCreate) {
        const sceneConfig = allScenesConfig.find(s => s.name === name);

        const matchingScene = currentSceneList.find(s => s.sceneName === name);

        if (matchingScene) {
            scenes.push({
                name,
                uuid: matchingScene.sceneUuid,
                oldUuid: sceneConfig.uuid,
            });
            continue;
        }

        const { sceneUuid } = await obs.call("CreateScene", {
            sceneName: name,
        });

        scenes.push({
            name,
            uuid: sceneUuid,
            oldUuid: sceneConfig.uuid,
        });
    }

    return scenes;
}

export async function populateAndConfigureSources(obs, profileConfig, sceneIds) {
    const inputUuids = [];

    const sceneConfigs = profileConfig.sources
            .filter(s => s.id === "scene");

    for (let sceneId of sceneIds) {
        const sceneConfig = sceneConfigs
            .find(s => s.uuid === sceneId.oldUuid);

        for (let sceneItem of sceneConfig.settings.items) {
            console.log("Creating scene item", sceneItem);
            const sourceConfig = profileConfig.sources
                .find(s => s.uuid === sceneItem.source_uuid);

            if (!sourceConfig) {
                console.error("Could not find source config", sceneItem.source_uuid);
                continue;
            }

            if (sourceConfig.versioned_id === "av_capture_input") {
                console.log("Skipping av_capture_input", sourceConfig);
                continue;
            }

            const existingInput = inputUuids.find(i => i.configUuid === sourceConfig.uuid);

            let inputUuid = null;

            if (existingInput) {
                const itemCreation = await obs.call("CreateSceneItem", {
                    sceneUuid: sceneId.uuid,
                    sceneName: sceneId.name,
                    sourceName: sourceConfig.name,
                    sourceUuid: existingInput.createdUuid,
                });
                inputUuid = itemCreation.sceneItemId;
            } else {
                const options = {
                    sceneUuid: sceneId.uuid,
                    sceneName: sceneId.name,
                    inputName: sourceConfig.name,
                    inputKind: sourceConfig.versioned_id,
                    inputSettings: sourceConfig.settings,
                };

                console.log("Creating input", options);
                const createInputReponse = await obs.call("CreateInput", options);
                inputUuid = createInputReponse.sceneItemId;

                if (sourceConfig.filters) {
                    for (let filter of sourceConfig.filters) {
                        console.log("Creating filter", filter);
                        await obs.call("CreateSourceFilter", {
                            sourceName: sourceConfig.name,
                            sourceUuid: inputUuid,
                            filterName: filter.name,
                            filterKind: filter.versioned_id,
                            filterSettings: filter.settings,
                        });
                    }
                }

                inputUuids.push({
                    configUuid: sourceConfig.uuid,
                    createdUuid: createInputReponse.inputUuid,
                });
            }

            const transform = createTransform(sceneItem);
            if (transform) {
                await obs.call("SetSceneItemTransform", {
                    sceneName: sceneId.name,
                    sceneUuid: sceneId.uuid,
                    sceneItemId: inputUuid,
                    sceneItemTransform: transform
                });
            }

            if (!sceneItem.visible) {
                console.log("Disabling item");
                await obs.call("SetSceneItemEnabled", {
                    sceneName: sceneId.name,
                    sceneUuid: sceneId.uuid,
                    sceneItemId: inputUuid,
                    sceneItemEnabled: false,
                });
            
            }
        }
    }
}

function createTransform(sceneItem) {
    const transform = {};

    if (sceneItem.align)
        transform.alignment = sceneItem.align;
    if (sceneItem.bounds_align)
        transform.boundsAlignment = sceneItem.bounds_align;

    if (sceneItem.crop_left)
        transform.cropLeft = sceneItem.crop_left;
    if (sceneItem.crop_right)
        transform.crop_right = sceneItem.crop_right
    if (sceneItem.crop_down)
        transform.cropDown = sceneItem.crop_down;
    if (sceneItem.crop_top)
        transform.cropTop = sceneItem.crop_top;
    if (sceneItem.pos?.x)
        transform.positionX = sceneItem.pos.x;
    if (sceneItem.pos?.y)
        transform.positionY = sceneItem.pos.y;
    if (sceneItem.scale?.x)
        transform.scaleX = sceneItem.scale.x;
    if (sceneItem.scale?.y)
        transform.scaleY = sceneItem.scale.y;

    if (Object.keys(transform).length === 0) {
        return null;
    }

    return transform;
}


export function StreamSetupRoute() {
    const { obs } = useStreamProps();
    const [ profileConfig, setProfileConfig ] = useState(null);

    const KEY = "4bkq-98fh-wqwv-xy9y-8v55";

    useEffect(() => {
        fetch("/controller/profileConfig.json")
            .then(r => r.json())
            .then(setProfileConfig);
    }, [setProfileConfig]);

    useEffect(() => {
        if (!profileConfig) return;

        (async function () {
            // await setupProfile(obs, KEY);
            // await obs.call("CreateSceneCollection", {
            //     sceneCollectionName: "Church stream"
            // });

            // const sceneIds = await createScenes(obs, profileConfig);
            // console.log("Scene ids", sceneIds);

            // await createSources(obs, profileConfig, sceneIds);
            
            // const { scenes } = await obs.call("GetSceneList");
            // if (scenes.find(s => s.sceneName === "Scene")) {
            //     await obs.call("RemoveScene", {
            //         sceneName: "Scene"
            //     });
            // }

            const settings = await obs.call("GetOutputList");
            console.log("Output list", settings);
        })();
    }, [obs, profileConfig]);

    return (
        <div>
            <h1>Stream Setup</h1>
            <p>Stream setup page</p>
        </div>
    );
}