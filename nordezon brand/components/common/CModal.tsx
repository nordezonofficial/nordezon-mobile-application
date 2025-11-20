import React from 'react';
import { Dimensions, Modal, Platform, StyleSheet, View } from 'react-native';

const { height, width } = Dimensions.get('window');

export default function ModalDialog({
    visible,
    onClose,
    children,
    overLayPadding = 0,
}: {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    overLayPadding?: number;
}) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.backdrop}>
                <View
                    style={[
                        styles.bottomContainer,
                        { padding: overLayPadding },
                    ]}
                >
                    <View style={styles.modalContent}>{children}</View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    bottomContainer: {
        width: '100%',
        position: 'absolute',
        height: "100%",
        bottom: Platform.OS === 'ios' ? 0 : -1, // forces true bottom on Android
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: width,
        minHeight: height * 0.3,
        overflow: 'hidden',
    },
});
