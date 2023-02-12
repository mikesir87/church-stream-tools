import { FC } from "react";
import { Dashboard } from "./stream/Dashboard";
import { StreamContextProvider } from "./stream/StreamContext";

export const StreamControlRoute : FC = () => {
    return (
        <StreamContextProvider>
            <Dashboard />
        </StreamContextProvider>
    );
}