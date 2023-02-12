import { FC, useCallback } from "react";
import { useStreamProps } from "./StreamContext";
import { BigButton } from "./BigButton";

export const FixCameraDisplay : FC = () => {
    const { obs } = useStreamProps();

    const handleClick = useCallback(() => {
        async function reset() {
            const originalData = await obs.call("GetInputSettings", { inputName: "Camera input" });

            const newData = { ...originalData.inputSettings } as any;
            newData.device = "obs-virtual-cam-device";
            newData.device_name = "OBS Virtual Camera";
            await obs.call("SetInputSettings", { inputName: "Camera input", inputSettings: newData });

            await waitForTime(500);
            
            await obs.call("SetInputSettings", { inputName: "Camera input", inputSettings: originalData.inputSettings });
        }

        async function waitForTime(millis: number) {
            return new Promise((acc) => setTimeout(acc, millis));
        }

        reset();
    }, [obs]);

    return (
        <BigButton text="Bounce Camera Settings" variant="warning" onClick={handleClick} />
    )
};