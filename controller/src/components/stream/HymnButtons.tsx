import { FC, useCallback } from "react";
import { useStreamProps } from "./StreamContext";
import { BigButton } from "./BigButton";

export const HymnButtons : FC = () => {
    const { obs, forceScreenshotUpdate } = useStreamProps();

    const handlePrevClick = useCallback(() => {
        async function run() {
            const event = {
                event_name: "obs-websocket-hymn-event",
                event_data: { direction: -1, },
            };

            await obs.call("CallVendorRequest", { vendorName: "obs-browser", requestType: "emit_event", requestData: event});
            setTimeout(() => forceScreenshotUpdate(), 500);
        }

        run();
    }, [forceScreenshotUpdate, obs]);

    const handleNextClick = useCallback(() => {
        async function run() {
            const event = {
                event_name: "obs-websocket-hymn-event",
                event_data: { direction: 1, },
            };

            await obs.call("CallVendorRequest", { vendorName: "obs-browser", requestType: "emit_event", requestData: event});
            setTimeout(() => forceScreenshotUpdate(), 500);
        }

        run();
    }, [forceScreenshotUpdate, obs]);

    return (
        <>
            <BigButton text="Prev verse" onClick={handlePrevClick} variant="secondary" />
            <BigButton text="Next verse" onClick={handleNextClick} />
        </>
    )
}