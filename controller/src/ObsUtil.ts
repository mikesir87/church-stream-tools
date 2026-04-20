import type OBSWebSocket from "obs-websocket-js";
import type { JsonObject } from "type-fest";

interface ProfileFilter {
    name: string;
    versioned_id: string;
    settings: JsonObject;
}

interface ProfileSource {
    id: string;
    uuid: string;
    name: string;
    versioned_id: string;
    settings: JsonObject & { items?: ProfileSceneItem[] };
    filters?: ProfileFilter[];
}

interface ProfileSceneItem {
    source_uuid: string;
    visible: boolean;
    align?: number;
    bounds_align?: number;
    crop_left?: number;
    crop_right?: number;
    crop_down?: number;
    crop_top?: number;
    pos?: { x: number; y: number };
    scale?: { x: number; y: number };
}

interface ProfileConfig {
    sources: ProfileSource[];
    scene_order: { name: string }[];
}

interface SceneId {
    name: string;
    uuid: string;
    oldUuid: string;
}

interface InputUuidEntry {
    configUuid: string;
    createdUuid: string;
}

interface SceneItemTransform {
    alignment?: number;
    boundsAlignment?: number;
    cropLeft?: number;
    cropRight?: number;
    cropDown?: number;
    cropTop?: number;
    positionX?: number;
    positionY?: number;
    scaleX?: number;
    scaleY?: number;
}

export async function createAndSetupProfile(obs: OBSWebSocket, profileName: string, youtubeKey: string | null) {
    try {
        console.log("Creating profile", profileName);
        await obs.call("CreateProfile", {
            profileName,
        });
        console.log("-- Done creating profile");

        console.log("Setting stream settings");
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
        console.log("-- Done setting stream settings");

        console.log("Setting video settings");
        await obs.call("SetVideoSettings", {
            fpsNumerator: 30,
            fpsDenominator: 1,
            baseWidth: 1920,
            baseHeight: 1080,
            outputWidth: 1920,
            outputHeight: 1080,
        });
        console.log("-- Done setting video settings");
    } catch (e) {
        console.error("Error creating profile", e);
    }
}

export async function createScenes(obs: OBSWebSocket, profileConfig: ProfileConfig): Promise<SceneId[]> {
    const scenes: SceneId[] = [];

    const { scenes: currentSceneList } = await obs.call("GetSceneList");

    const allScenesConfig = profileConfig.sources
        .filter(s => s.id === "scene");

    const sceneNamesToCreate = profileConfig.scene_order
        .map(s => s.name)
        .reverse();

    for (const name of sceneNamesToCreate) {
        const sceneConfig = allScenesConfig.find(s => s.name === name);

        const matchingScene = currentSceneList.find(s => s.sceneName === name);

        if (matchingScene) {
            scenes.push({
                name,
                uuid: matchingScene.sceneUuid as string,
                oldUuid: sceneConfig!.uuid,
            });
            continue;
        }

        const { sceneUuid } = await obs.call("CreateScene", {
            sceneName: name,
        });

        scenes.push({
            name,
            uuid: sceneUuid,
            oldUuid: sceneConfig!.uuid,
        });
    }

    return scenes;
}

export async function populateAndConfigureSources(obs: OBSWebSocket, profileConfig: ProfileConfig, sceneIds: SceneId[]) {
    const inputUuids: InputUuidEntry[] = [];

    const sceneConfigs = profileConfig.sources
        .filter(s => s.id === "scene");

    for (const sceneId of sceneIds) {
        const sceneConfig = sceneConfigs
            .find(s => s.uuid === sceneId.oldUuid);

        for (const sceneItem of sceneConfig!.settings.items ?? []) {
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

            let inputUuid: number | null = null;

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
                const createInputResponse = await obs.call("CreateInput", options);
                inputUuid = createInputResponse.sceneItemId;

                if (sourceConfig.filters) {
                    for (const filter of sourceConfig.filters) {
                        console.log("Creating filter", filter);
                        await obs.call("CreateSourceFilter", {
                            sourceName: sourceConfig.name,
                            sourceUuid: String(inputUuid),
                            filterName: filter.name,
                            filterKind: filter.versioned_id,
                            filterSettings: filter.settings,
                        });
                    }
                }

                inputUuids.push({
                    configUuid: sourceConfig.uuid,
                    createdUuid: createInputResponse.inputUuid,
                });
            }

            const transform = createTransform(sceneItem);
            if (transform) {
                await obs.call("SetSceneItemTransform", {
                    sceneName: sceneId.name,
                    sceneUuid: sceneId.uuid,
                    sceneItemId: inputUuid!,
                    sceneItemTransform: transform as JsonObject
                });
            }

            if (!sceneItem.visible) {
                console.log("Disabling item");
                await obs.call("SetSceneItemEnabled", {
                    sceneName: sceneId.name,
                    sceneUuid: sceneId.uuid,
                    sceneItemId: inputUuid!,
                    sceneItemEnabled: false,
                });
            }
        }
    }
}

function createTransform(sceneItem: ProfileSceneItem): SceneItemTransform | null {
    const transform: SceneItemTransform = {};

    if (sceneItem.align)
        transform.alignment = sceneItem.align;
    if (sceneItem.bounds_align)
        transform.boundsAlignment = sceneItem.bounds_align;

    if (sceneItem.crop_left)
        transform.cropLeft = sceneItem.crop_left;
    if (sceneItem.crop_right)
        transform.cropRight = sceneItem.crop_right;
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
