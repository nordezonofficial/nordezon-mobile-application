import BackgroundContainer from '@/components/common/BackgroundContainer'
import CText from '@/components/common/CText'
import CTouchableOpacity from '@/components/common/CTouchableOpacity'
import OrderGroup from '@/components/home/order/OrderGroup'
import { useGetOrderGroupListByUserIdQuery } from '@/store/api/v1/orders'
import { setOrderList } from '@/store/slices/orders'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const PAGE_SIZE = 10

const SkeletonOrder = () => (
  <View style={{
    backgroundColor: '#fff',
    borderRadius: 13,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    minHeight: 160,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1
  }}>
    <View style={{ width: "85%", height: 18, backgroundColor: "#eee", borderRadius: 5, marginBottom: 9 }} />
    <View style={{ width: "55%", height: 14, backgroundColor: "#eee", borderRadius: 4 }} />
    <View style={{ width: "100%", height: 60, backgroundColor: "#f6f6f6", borderRadius: 7, marginTop: 16 }} />
    <View style={{ flexDirection: 'row', marginTop: 12 }}>
      <View style={{ flex: 1, height: 14, backgroundColor: "#eee", borderRadius: 4 }} />
      <View style={{ width: 60, height: 14, backgroundColor: "#eee", borderRadius: 4, marginLeft: 15 }} />
    </View>
  </View>
);

const ListEmpty = () => (
  <View style={{ marginTop: 80, alignItems: 'center', opacity: 0.7 }}>
    <ActivityIndicator size="small" color="#f88a25" />
    {/* Replace with nice Empty-State if you want */}
  </View>
);

const OrderScreen = () => {
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, isFetching, isSuccess } = useGetOrderGroupListByUserIdQuery({
    page: page,
    status: '', // status param to satisfy endpoint, or remove if not necessary
  });

  const dispatch = useDispatch();
  const { orderList } = useSelector((state: any) => state.order)
  const router = useRouter();

  useEffect(() => {
    if (data && data.status === 'success') {
      if (page === 1) {
        dispatch(setOrderList(data.data))
      } else {
        // Pagination: append new data
        dispatch(setOrderList([...orderList, ...data.data]))
      }
    }
    // eslint-disable-next-line
  }, [data])

  const handleLoadMore = () => {
    // Check if more data is available (assuming 0-length or less than page size = end)
    if (!isFetching && data && data.data && data.data.length >= PAGE_SIZE) {
      setPage(prev => prev + 1)
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setTimeout(() => setRefreshing(false), 900); // Give load time for API
  }, []);

  return (
    <BackgroundContainer paddingVertical={0}>
      {/* Header Bar with Back Button & Title */}
      <View style={styles.headerBarWithBack}>
        <CTouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#212" />
        </CTouchableOpacity>
        <View style={{ flex: 1 }}>
          <CText style={[styles.heading, styles.headingCentered]}>
            My Orders
          </CText>
        </View>
        {/* Placeholder for spacing, to keep title centered */}
        <View style={{ width: 32 }} />
      </View>
      {isLoading && page === 1 ? (
        <>
          {/* Skeleton loading for first fetch */}
          {[...Array(3)].map((_, idx) => <SkeletonOrder key={idx} />)}
        </>
      ) : (
        <FlatList
          data={orderList || []}
          renderItem={({ item }) => <OrderGroup item={item} />}
          keyExtractor={(item: any, idx) => item?.orderId?.toString() || idx.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={isFetching && page > 1 ? <ActivityIndicator size="small" color="#f88a25" style={{ margin: 16 }} /> : null}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#f88a25"
            />
          }
          ListEmptyComponent={!isLoading ? ListEmpty : null}
        />
      )}
    </BackgroundContainer>
  )
}

const styles = StyleSheet.create({
  headerBarWithBack: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 2,
    backgroundColor: 'transparent',
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    backgroundColor: '#f5f5f5'
  },
  headingCentered: {
    textAlign: 'center',
    marginLeft: 0,
  },
  heading: {
    fontSize: 20,
    fontFamily: 'PoppinsSemiBold',
    color: "#222",
    marginLeft: 5,
  },
});

export default OrderScreen