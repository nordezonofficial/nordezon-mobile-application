import { useGetCitiesListQuery } from '@/store/api/v1/cites';
import { setCityList } from '@/store/slices/cities';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ModalDialog from './common/CModal';
import CText from './common/CText';
import CTouchableOpacity from './common/CTouchableOpacity';
const { height } = Dimensions.get('window')


const CityPicker = ({
    setCity,
    city
}: {
    setCity: (param: any) => void
    city: string | null
}) => {
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { data } = useGetCitiesListQuery({});
    const { cities } = useSelector((state: any) => state.city)
    const [selectedCityName, setSelectedCityName] = useState("")
    useEffect(() => {
        if (data) {
            dispatch(setCityList(data.data))
        }
    }, [data])

    const filteredCities = cities.filter((city: any) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectCity = (city: { name: string, id: number }) => {
        setCity(city.id);
        setSelectedCityName(city.name)
        setModalVisible(false);
        setSearchQuery('');
    };

    return (
        <>

            <CText>City</CText>
            <CTouchableOpacity style={styles.inputContainer} onPress={() => setModalVisible(true)}>
                <Ionicons name="business-outline" size={22} color="#999" style={styles.icon} />
                <CText style={[styles.inputText, {
                    color: city ? '#333' : '#999'
                }]}>{city ? selectedCityName : 'Select City'}</CText>
            </CTouchableOpacity>


            <ModalDialog visible={modalVisible} onClose={() => { }}>
                <View style={styles.modal}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search city..."
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <FlatList
                        data={filteredCities}
                        keyExtractor={(item, index) => `${item.name}-${index}`}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => selectCity(item)}
                            >
                                <Text style={styles.itemText}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </ModalDialog>

        </>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.5,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
        width: "100%",
        marginBottom: 15,
        borderColor: "#555"
    },
    icon: {
        marginRight: 8,
    },
    inputText: {
        color: '#999', // Softer, placeholder-like color
        fontSize: 14,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginTop: 10,
    },
    dropdownText: {
        color: '#000',
        fontSize: 14,
    },
    modal: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    searchInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
        marginTop: 15,
        fontSize: 14,
        color: '#000',
    },
    item: {
        paddingVertical: 12,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    itemText: {
        color: '#000',
        fontSize: 16,
    },
});

export default CityPicker;
