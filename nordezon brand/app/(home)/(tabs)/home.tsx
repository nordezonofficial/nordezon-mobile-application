import CText from '@/components/common/CText'
import FullScreenPopup from '@/components/common/FullScreen'
import Ads from '@/components/home/Ads'
import Bazar from '@/components/home/Bazar'
import BrandsLogoSlider from '@/components/home/BrandsLogoSlider'
import HomePost from '@/components/home/Post'
import Stories from '@/components/home/Stories'
import { dummyPosts } from '@/constants/common'
import { useGetBrandListByUserCategoriesQuery, useGetBrandListNotInIdsByUserCategoriesQuery } from '@/store/api/v1/user'
import { setBrandList, setBrandListMetaData, setBrandListNotInIds, setBrandListNotInMetaData } from '@/store/slices/user'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { ImageBackground, RefreshControl, ScrollView, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const Home = () => {
    const [fullImageVisible, setFullImageVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useDispatch();

    const [page, setPage] = useState(1)
    const [pageNotIn, setNotInPage] = useState(1);

    const { data, isLoading: isBrandListLoading } = useGetBrandListByUserCategoriesQuery({
        page: page
    })
    const { brandList, brandListNotIn, brandListMeta,
        brandListNotIntMeta } = useSelector((state: any) => state.user)

    const { data: brandListNotInData, isLoading: isBrandListNotInLoading } = useGetBrandListNotInIdsByUserCategoriesQuery({
        page: pageNotIn,
        notIn: brandList.map((item: any) => item.id),
    });




    useEffect(() => {
        if (data && data.status == 'success') {
            if (page === 1) {
                /* --- First page - replace the list --- */
                dispatch(setBrandList(data.data.users))
            } else {
                /* ---  Subsequent pages - append to existing list t --- */
                dispatch(setBrandList([...brandList, ...data.data.users]))
            }
            dispatch(setBrandListMetaData(data.data.meta))
        }
        if (brandListNotInData && brandListNotInData.status == 'success') {
            if (pageNotIn === 1) {
                /* --- First page - replace the list --- */
                dispatch(setBrandListNotInIds(brandListNotInData.data.users))
            } else {
                /* ---  Subsequent pages - append to existing list t --- */
                dispatch(setBrandListNotInIds([...brandListNotIn, ...brandListNotInData.data.users]))
            }
            dispatch(setBrandListNotInMetaData(brandListNotInData.data.meta))
        }
    }, [data, brandListNotInData])

    // Dummy refresh logic to simulate pull-to-refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Simulate a network request:
        setTimeout(() => {
            setRefreshing(false);
        }, 1200);
    }, []);

    const handlePress = (param: string) => {
        if (param == "ORIGNALS") {
            router.push('/(home)/shopTheWholeLook')
        }
        if (param == "WATCH_STORY") {
            router.push('/(stories)/stories')
        }
    }

    // Handle load more for both sliders
    const handleLoadMore = (param: string) => {
        if (param == "BRAND") {
            if (brandListMeta && brandListMeta.currentPage < brandListMeta.totalPages) {
                setPage((prevPage) => prevPage + 1);
            }
        } else {
            if (brandListNotIntMeta && brandListNotIntMeta.currentPage < brandListNotIntMeta.totalPages) {
                setNotInPage((prevPage) => prevPage + 1);
            }
        }
    };

    // Derived: Only show the slider if NOT loading AND there is data (so, hide when 0 records after loading)
    const shouldShowBrandListSlider = !isBrandListLoading && Array.isArray(brandList) && brandList.length > 0;
    const shouldShowBrandListNotInSlider = !isBrandListNotInLoading && Array.isArray(brandListNotIn) && brandListNotIn.length > 0;

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#ff8600']}
                    tintColor="#ff8600"
                />
            }
        >
            <ImageBackground
                source={require("@/assets/images/homebg.png")}
                style={styles.background}
            >
                <Stories
                    onPress={() => {
                        handlePress("WATCH_STORY")
                    }}
                ></Stories>

                <View style={styles.container}>
                    <CText style={styles.title}>From Your Favorite Categories</CText>
                    {isBrandListLoading ? (
                        <BrandsLogoSlider onLoadMore={() => handleLoadMore("BRAND")} list={[]} />
                    ) : (
                        shouldShowBrandListSlider && (
                            <BrandsLogoSlider onLoadMore={() => handleLoadMore("BRAND")} list={brandList}></BrandsLogoSlider>
                        )
                    )}
                    {isBrandListNotInLoading ? (
                        <BrandsLogoSlider poppedOut={true} onLoadMore={() => handleLoadMore("BRAND_NOT_IN")} list={[]} />
                    ) : (
                        shouldShowBrandListNotInSlider && (
                            <BrandsLogoSlider poppedOut={true} onLoadMore={() => handleLoadMore("BRAND_NOT_IN")} list={brandListNotIn} />
                        )
                    )}
                </View>

            </ImageBackground>
            <View style={{
                backgroundColor: "#fff"
            }}>
                <Ads></Ads>
                <Bazar></Bazar>
                <CText style={styles.title}>Farokht Orignals</CText>
                <Stories
                    isOriginals={true}
                    isFromOriginal={true}
                    onPress={() => handlePress("ORIGNALS")}
                    height={150}
                    image={{
                        width: 180,
                        height: 120,
                    }}
                    top={0}
                ></Stories>
                <View style={{ height: 120 }} />
                {dummyPosts.map((post, index: number) => (
                    <HomePost
                        key={index}
                        onPress={() => {
                            setFullImageVisible(true)
                        }}
                        username={post.username}
                        userAvatar={post.userAvatar}
                        postImage={post.postImage}
                        likes={post.likes}
                        caption={post.caption}
                        timeAgo={post.timeAgo}
                        price={post.price}
                        discountPrice={post.discountPrice}
                    />
                ))}
            </View>
            <FullScreenPopup
                brand={true}
                title={"Track Your Order"}
                oneLineDescription={"Stay updated with real-time order status from each vendor."}
                fullImageVisible={fullImageVisible}
                setFullImageVisible={setFullImageVisible}
                image={require('@/assets/images/post.jpg')}
            ></FullScreenPopup>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        height: 390,
        resizeMode: "contain",
        backgroundColor: "#fff",

    },
    overlay: {
        width: '90%',
        height: '90%',
        // You can use this for layering over the image if needed
    },
    container: {
        top: 60,
    },
    scrollContainer: {
        paddingBottom: 10000, // gives smooth end scroll
    },
    title: {
        fontSize: 15,
        fontFamily: "PoppinsSemiBold",
        color: "#000",
        marginBottom: 10,
        letterSpacing: 0.8,
        paddingHorizontal: 15,
        // textTransform: 'uppercase',
        // textAlign: 'center',
    },
})

export default Home
