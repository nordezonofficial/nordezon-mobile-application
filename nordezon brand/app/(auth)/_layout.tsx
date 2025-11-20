import { Stack } from "expo-router";


/**
 * _layout is a special component that is used as the layout
 * component for the /auth route.
 *
 * It renders a Stack.Navigator with a single screen
 * named "index" and sets the headerShown property to
 * false so that the header is not shown.
 */
export default function _layout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
        </Stack>
    );
}