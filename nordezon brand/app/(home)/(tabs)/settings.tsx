import { router } from "expo-router";
import { useEffect } from "react";

export default function RedirectToChat() {
    useEffect(() => {
        router.replace("/(brand)/settings");
    }, []);

    return null; // no UI
}
