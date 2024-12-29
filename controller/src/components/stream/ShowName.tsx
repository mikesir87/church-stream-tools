import { FC, useCallback } from "react";
import { SCENE_CAMERA, SOURCE_SPEAKER_NAME } from "../../consts";
import { useStreamProps } from "./StreamContext";
import { BigButton } from "./BigButton";

export const ShowName : FC = () => {
    const { obs } = useStreamProps();

    const handleClick = useCallback(() => {
        const name = prompt("What's the person's name?");
        if (!name)
            return;
        
        // const title = prompt("What's the person's title?");

        async function run() {
            const speakerName = await obs.call("GetInputSettings", { inputName: SOURCE_SPEAKER_NAME });
            const speakerDetails = { ...speakerName.inputSettings, text: name };
            await obs.call("SetInputSettings", { inputName: SOURCE_SPEAKER_NAME, inputSettings: speakerDetails });

            const nameItem = await obs.call("GetSceneItemId", { sceneName: SCENE_CAMERA, sourceName: "Speaker Name" });
            const gradientItem = await obs.call("GetSceneItemId", { sceneName: SCENE_CAMERA, sourceName: "Bottom bar gradient" });
            await obs.call("SetSceneItemEnabled", { sceneName: SCENE_CAMERA, sceneItemId: nameItem.sceneItemId, sceneItemEnabled: true});
            await obs.call("SetSceneItemEnabled", { sceneName: SCENE_CAMERA, sceneItemId: gradientItem.sceneItemId, sceneItemEnabled: true});
            
            await wait(6000);
            await obs.call("SetSceneItemEnabled", { sceneName: SCENE_CAMERA, sceneItemId: nameItem.sceneItemId, sceneItemEnabled: false});
            await obs.call("SetSceneItemEnabled", { sceneName: SCENE_CAMERA, sceneItemId: gradientItem.sceneItemId, sceneItemEnabled: false});
        }

        async function wait(millis: number) {
            return new Promise((acc) => setTimeout(acc, millis));
        }

        run();
    }, [obs]);

    return (
        <>
            <BigButton text="Show name" onClick={handleClick} />
        </>
    );
}