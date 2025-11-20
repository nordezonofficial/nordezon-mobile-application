import { router } from "expo-router";
import { useEffect } from "react";

export default function RedirectToOrder() {
    useEffect(() => {
        console.log("FIRED");

        router.replace("/(home)/order");
    }, []);

    return null; // no UI
}
