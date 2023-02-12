import { FC } from "react";
import { useStreamProps } from "./StreamContext";

export const StreamStatusDisplay : FC = () => {
    const { streamStatus } = useStreamProps();

    return (
        <p>
            YouTube Streaming Status:&nbsp; 
            <span className={`fw-bold ${streamStatus.active ? "text-success" : "text-danger"}`}>{ streamStatus.active ? "Live" : "Not streaming" }</span>
        </p>
    )
}