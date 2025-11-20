import HomeHeader from '@/components/home/HomeHeader';
import OrderHeader from '@/components/home/order/OrderHeader';
import SearchHeader from '@/components/home/search/SearchHeader';
import { Stack } from 'expo-router';

// Note: 'animation' controls the forward (push) transition, 
// while 'animationTypeForReplace' and 'gestureDirection' can help configure more complex behaviors.
// Expo Router/React Navigation uses 'animation' for both enter and exit (push/pop) transitions
// when using stack navigation with 'react-navigation-stack' under the hood.

export default function HomeStackLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="(tabs)"
                options={{
                    headerShown: false,
                    animation: 'default',
                    animationTypeForReplace: 'push',
                    gestureDirection: 'horizontal',
                }}
            />

            <Stack.Screen
                name="search"
                options={{
                    headerShown: true,
                    animation: 'slide_from_right',
                    animationTypeForReplace: 'push',
                    gestureDirection: 'horizontal',
                    header: () => <SearchHeader />,
                }}
            />

            <Stack.Screen
                name="brandProfileVisit"
                options={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    animationTypeForReplace: 'push',
                    gestureDirection: 'horizontal',
                }}
            />
            <Stack.Screen
                name="productDetail"
                options={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    animationTypeForReplace: 'push',
                    gestureDirection: 'horizontal',
                }}
            />
            <Stack.Screen
                name="cart"
                options={{
                    headerShown: false,
                    animation: 'slide_from_bottom',
                    animationTypeForReplace: 'push',
                    gestureDirection: 'vertical',
                    header: () => <HomeHeader />,
                }}
            />
            <Stack.Screen
                name="order"
                options={{
                    headerShown: true,
                    animation: 'slide_from_bottom',
                    animationTypeForReplace: 'push',
                    gestureDirection: 'vertical',
                    header: () => <OrderHeader />,
                }}
            />
            <Stack.Screen
                name="checkout"
                options={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    animationTypeForReplace: 'push',
                    gestureDirection: 'horizontal',
                }}
            />
            <Stack.Screen
                name="successOrder"
                options={{
                    headerShown: true,
                    animation: 'fade',
                    animationTypeForReplace: 'push',
                    gestureDirection: 'vertical',
                    header: () => <OrderHeader />,
                }}
            />
            <Stack.Screen
                name="orderDetail"
                options={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    animationTypeForReplace: 'push',
                    gestureDirection: 'horizontal',
                    header: () => <OrderHeader />,
                }}
            />
            <Stack.Screen
                name="trackOrder"
                options={{
                    headerShown: true,
                    animation: 'slide_from_bottom',
                    animationTypeForReplace: 'push',
                    gestureDirection: 'vertical',
                    header: () => <OrderHeader />,
                }}
            />
            <Stack.Screen
                name="shopTheWholeLook"
                options={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    animationTypeForReplace: 'push',
                    gestureDirection: 'horizontal',
                    header: () => <OrderHeader />,
                }}
            />
            <Stack.Screen
                name="bazarList"
                options={{
                    headerShown: true,
                    animation: 'slide_from_right',
                    animationTypeForReplace: 'push',
                    gestureDirection: 'horizontal',
                    header: () => <OrderHeader />,
                }}
            />
        </Stack>
    );
}
