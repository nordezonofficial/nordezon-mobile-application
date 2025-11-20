import React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import CText from '../../common/CText';

interface CatalogItem {
    id: string;
    title: string;
    banner: any; // URL or local image
    onPress?: () => void;
}

interface CatalogListProps {
    catalogs: CatalogItem[];
    onEndReached: any;
}

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width * 2 - CARD_MARGIN * 8) / 2;

const CatalogList: React.FC<CatalogListProps> = ({ catalogs, onEndReached }) => {
    return (
        <FlatList
            data={catalogs}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContainer}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.card} onPress={item.onPress}>
                    <Image source={item.banner} style={styles.banner} />
                    <View style={styles.overlay}>
                        <CText style={styles.title}>{item.title}</CText>
                    </View>
                </TouchableOpacity>
            )}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingTop: 10,
    },
    row: {
        flexDirection: "column",
    },
    card: {
        width: CARD_WIDTH,
        marginBottom: 16,
        borderRadius: 12,
        // overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        left: 0,


    },
    banner: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingVertical: 5,
        paddingHorizontal: 6,
    },
    title: {
        fontSize: 14,
        fontFamily: 'PoppinsSemiBold',
        color: '#fff',
    },
});

export default CatalogList;
