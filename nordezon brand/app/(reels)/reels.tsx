import BackgroundContainer from '@/components/common/BackgroundContainer'
import ReelWatchings from '@/components/reels/ReelWatchings'
import React from 'react'

const reels = () => {
    return (
        <BackgroundContainer paddingHorizontal={0} paddingVertical={0}>
                <ReelWatchings isFromBrand={true}></ReelWatchings>
        </BackgroundContainer>
    )
}

export default reels