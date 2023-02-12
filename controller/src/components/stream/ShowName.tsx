import { FC, useCallback } from "react";
import { SCENE_CAMERA, SOURCE_SPEAKER_NAME, SOURCE_SPEAKER_NAME_GROUP, SOURCE_SPEAKER_TITLE } from "../../consts";
import { useStreamProps } from "./StreamContext";
import { BigButton } from "./BigButton";

export const ShowName : FC = () => {
    const { obs } = useStreamProps();

    const handleClick = useCallback(() => {
        const name = prompt("What's the person's name?");
        // const title = prompt("What's the person's title?");

        async function run() {
            const speakerName = await obs.call("GetInputSettings", { inputName: SOURCE_SPEAKER_NAME });
            const speakerDetails = { ...speakerName.inputSettings, text: name };
            await obs.call("SetInputSettings", { inputName: SOURCE_SPEAKER_NAME, inputSettings: speakerDetails });

            const speakerTitle = await obs.call("GetInputSettings", { inputName: SOURCE_SPEAKER_TITLE });
            // const speakerTitleDetails = { ...speakerTitle.inputSettings, text: name };
            await obs.call("SetInputSettings", { inputName: SOURCE_SPEAKER_TITLE, inputSettings: speakerTitle });

            const group = await obs.call("GetSceneItemId", { sceneName: SCENE_CAMERA, sourceName: SOURCE_SPEAKER_NAME_GROUP });
            await obs.call("SetSceneItemEnabled", { sceneName: SCENE_CAMERA, sceneItemId: group.sceneItemId, sceneItemEnabled: true});
            
            await wait(6000);
            await obs.call("SetSceneItemEnabled", { sceneName: SCENE_CAMERA, sceneItemId: group.sceneItemId, sceneItemEnabled: false});            
        }

        async function wait(millis: number) {
            return new Promise((acc) => setTimeout(acc, millis));
        }

        run();
    }, [obs]);

    return (
        <>
            <BigButton text="Show Name" onClick={handleClick} />
        </>
    );
}