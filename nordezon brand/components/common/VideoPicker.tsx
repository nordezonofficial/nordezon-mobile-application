import { primaryOrange } from '@/constants/colors';
import { useEvent } from 'expo';
import * as ImagePicker from 'expo-image-picker';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
interface CImagePickerProps {
    value: string | null; // current image URI
    onChange: (uri: string | null) => void; // callback to update image
    aspect?: [number, number]; // aspect ratio, default to 16:9
    height?: number; // optional custom height
    label?: string; // optional label/title
    isPost?: boolean; // optional label/title
    mediaTypes?: any[]; // optional label/title
}

const VideoPicker: React.FC<CImagePickerProps> = ({
    value,
    onChange,
    aspect = [16, 9],
    height = 150,
    label,
    isPost,
    mediaTypes = ['images']
}) => {
    const [video, setVideo] = useState("file:///data/user/0/host.exp.exponent/cache/ImagePicker/38fa174b-484a-455c-b23c-ac970b146d05.mp4")

    const player = useVideoPlayer(video, player => {
        player.loop = false;
        player.pause();
    });

    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission required', 'Please allow access to your gallery.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes,
            allowsEditing: true,
            aspect,
            quality: 0.8,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            console.log(uri);

            onChange(uri);
        }
    };

    const removeImage = () => {
        onChange(null);
        if (player) {
            player.pause();         
        }
    };



    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <VideoView style={styles.video} player={player} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 50,
    },
    video: {
        width: 350,
        height: 275,
    },
    container: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 12,
    },
    box: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#fafafa',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: primaryOrange,
        borderRadius: 20,
        padding: 2,
    },
    placeholderText: {
        marginTop: 8,
        fontSize: 13,
        color: '#999',
        textAlign: "center"
    },
    labelBelow: {
        marginTop: 8,
        fontSize: 14,
        color: '#444',
        fontFamily: 'PoppinsMedium',
        textAlign: 'center',
    },
});

export default VideoPicker;
