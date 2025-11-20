import { router } from "expo-router";
import { useEffect } from "react";

export default function RedirectToCart() {
    useEffect(() => {
        console.log("FIRED");

        router.replace("/(home)/cart");
    }, []);

    return null; // no UI
}
