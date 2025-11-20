import { router } from "expo-router";
import { useEffect } from "react";

export default function RedirectToChat() {
    useEffect(() => {
        router.replace("/(chat)/chatlist");
    }, []);

    return null; // no UI
}
