import React, { useEffect, useRef } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
} from 'react-native';

interface KeyboardAvoidingProps {
    children: React.ReactNode;
    scrollToTopOnStepChange?: number | null; // pass a step number to trigger scroll-to-top
    scrollToBottomOnStepChange?: number | null; // pass a step number to trigger scroll-to-bottom
}

export default function KeyboardAvoiding({
    children,
    scrollToTopOnStepChange = null,
    scrollToBottomOnStepChange = null,
}: KeyboardAvoidingProps) {
    const scrollRef = useRef<ScrollView>(null);

    // Scroll to top when `scrollToTopOnStepChange` changes
    useEffect(() => {
        if (scrollToTopOnStepChange != null) {
            scrollRef.current?.scrollTo({ y: 0, animated: true });
        }
    }, [scrollToTopOnStepChange]);

    // Scroll to bottom when `scrollToBottomOnStepChange` changes
    useEffect(() => {
        if (scrollToBottomOnStepChange != null && scrollRef.current) {
            scrollRef.current.scrollToEnd({ animated: true });
        }
    }, [scrollToBottomOnStepChange]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{
                flex: 1,
            }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    ref={scrollRef}
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    {children}
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
})