import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import CText from './CText';
import CTouchableOpacity from './CTouchableOpacity';

type SnackbarProps = {
    visible: boolean;
    message: string;
    onClose: () => void;
    type?: 'success' | 'error' | 'info';
    duration?: number;
    bottom?: number;
};

const CSnackbar = ({
    visible,
    bottom = 40,
    message,
    onClose,
    type = 'info',
    duration = 3000,
}: SnackbarProps) => {
    const slideAnim: any = useRef(new Animated.Value(100)).current; // slide from bottom

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();

            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        } else {
            Animated.timing(slideAnim, {
                toValue: 100,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleClose = () => {
        Animated.timing(slideAnim, {
            toValue: 100,
            duration: 200,
            useNativeDriver: true,
        }).start(() => onClose());
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return '#4BB543'; // Green
            case 'error':
                return '#D32F2F'; // Red
            default:
                return '#333'; // Neutral gray
        }
    };

    if (!visible && slideAnim.__getValue() === 100) return null;

    return (
        <Animated.View
            style={{
                position: 'absolute',
                bottom: bottom,
                left: 20,
                right: 20,
                backgroundColor: getBackgroundColor(),
                borderRadius: 10,
                paddingVertical: 14,
                paddingHorizontal: 20,
                transform: [{ translateY: slideAnim }],
                elevation: 5,
                zIndex: 99,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <CText
                    style={{
                        color: '#fff',
                        fontSize: 15,
                        flex: 1,
                        fontFamily: 'PoppinsMedium',
                    }}
                >
                    {message}
                </CText>
                <CTouchableOpacity onPress={handleClose}>
                    <CText style={{ color: '#fff', fontSize: 16, marginLeft: 10 }}>✕</CText>
                </CTouchableOpacity>
            </View>
        </Animated.View>
    );
};

export default CSnackbar;
