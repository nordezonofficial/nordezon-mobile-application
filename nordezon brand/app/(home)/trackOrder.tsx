import BackgroundContainer from '@/components/common/BackgroundContainer'
import OrderGroup from '@/components/home/order/OrderGroup'
import OrderTrackItem from '@/components/home/order/OrderTrack'
import { useGetOrderGroupByIdQuery } from '@/store/api/v1/orders'
import { setOrderTracking } from '@/store/slices/orders'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const TrackOrder = () => {
    const router = useRouter()
    const { orderId, order, orderItems, orderTracking } = useSelector((state: any) => state.order)
    const { data, isLoading } = useGetOrderGroupByIdQuery({
        orderId: orderId
    });

    const dispatch = useDispatch();

    useEffect(() => {
        if (data && data.status == "success") {
            dispatch(setOrderTracking(data.data))
        }
    }, [data])

    return (
        <BackgroundContainer>
            {/* Back Button and Title Row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 8, paddingLeft: 5, paddingBottom: 8 }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: '#f5f5f5',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 8,
                    }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={26} color="#222" />
                </TouchableOpacity>
                <Text
                    style={{
                        fontSize: 20,
                        fontFamily: 'PoppinsSemiBold',
                        color: "#222",
                        textAlign: 'left',
                    }}
                >
                    Track Order
                </Text>

            </View>
            <OrderGroup hasShowImages={false} item={orderTracking || {}}></OrderGroup>
            <OrderTrackItem />
        </BackgroundContainer>
    )
}

export default TrackOrder