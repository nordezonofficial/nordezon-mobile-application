import CText from '@/components/common/CText';
import CTouchableOpacity from '@/components/common/CTouchableOpacity';
import React, { useCallback, useEffect } from 'react';
import { Dimensions, FlatList, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const { height } = Dimensions.get('window');

interface Comment {
    id: string;
    user: string;
    text: string;
}

interface CommentBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    comments: Comment[];
}

export default function CommentBottomSheet({
    visible,
    onClose,
    comments,
}: CommentBottomSheetProps) {
    const translateY = useSharedValue(height);

    useEffect(() => {
        translateY.value = visible ? withSpring(0, { damping: 20 }) : withTiming(height, { duration: 300 });
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const handleGesture = useCallback((event: any) => {
        if (event.nativeEvent.translationY > 100) {
            onClose();
        }
    }, []);

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <Animated.View style={styles.sheet}>
                <View style={styles.headerBar} />

                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.commentRow}>
                            <CText style={styles.username}>{item.user}</CText>
                            <CText style={styles.commentText}>{item.text}</CText>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 80 }}
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.inputContainer}
                >
                    <TextInput
                        placeholder="Add a comment..."
                        placeholderTextColor="#888"
                        style={styles.input}
                    />
                    <CTouchableOpacity onPress={() => { }}>
                        <CText style={styles.postButton}>Post</CText>
                    </CTouchableOpacity>
                </KeyboardAvoidingView>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: height,
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#000',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: height * 0.6,
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    headerBar: {
        width: 60,
        height: 5,
        backgroundColor: '#555',
        alignSelf: 'center',
        borderRadius: 2.5,
        marginBottom: 10,
    },
    commentRow: {
        flexDirection: 'row',
        marginVertical: 8,
    },
    username: {
        fontWeight: 'bold',
        color: '#fff',
        marginRight: 8,
    },
    commentText: {
        color: '#ddd',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 0.5,
        borderTopColor: '#444',
        paddingVertical: 10,
    },
    input: {
        flex: 1,
        color: '#fff',
        paddingHorizontal: 12,
    },
    postButton: {
        color: '#cffa41',
        fontWeight: 'bold',
    },
});
