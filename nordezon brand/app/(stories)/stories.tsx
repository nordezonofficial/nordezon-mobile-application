import BackgroundContainer from '@/components/common/BackgroundContainer'
import ReelWatchings from '@/components/reels/ReelWatchings'
import React from 'react'

const stories = () => {
    return (
        <BackgroundContainer paddingHorizontal={0} paddingVertical={0}>
                <ReelWatchings isFromStory={true} isFromBrand={true}></ReelWatchings>
        </BackgroundContainer>
    )
}

export default stories;