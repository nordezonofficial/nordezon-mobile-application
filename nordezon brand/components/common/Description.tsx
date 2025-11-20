import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import CText from '../common/CText';

const Description = ({ text, style }: { text: string, style?: any }) => {
    const [expanded, setExpanded] = useState(false);
    const MAX_LENGTH = 70; // number of characters to show before truncating

    if (!text) return null;

    const shouldShowSeeMore = text.length > MAX_LENGTH;
    const displayText = expanded ? text : text.slice(0, MAX_LENGTH) + (shouldShowSeeMore ? '...' : '');

    return (
        <View>
            <CText style={[styles.description, {
                ...style
            }]}>{displayText}</CText>

            {shouldShowSeeMore && (
                <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                    <CText style={[styles.seeMore, {
                        ...style
                    }]}>
                        {expanded ? 'See less' : 'read more'}
                    </CText>
                </TouchableOpacity>
            )}
        </View>
    );
};


export default Description;

const styles = StyleSheet.create({
    description: {
        fontSize: 12,
        color: '#555',
        marginTop: 4,
        lineHeight: 18,
        fontFamily: 'PoppinsRegular',
    },
    seeMore: {
        fontSize: 12,
        color: '#000', // blue link-like color
        marginTop: 3,
        marginBottom: 3,
        fontFamily: 'PoppinsSemiBold',
    },
});
