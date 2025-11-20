import BackgroundContainer from '@/components/common/BackgroundContainer'
import React from 'react'
import AuthSelection from './AuthSelection'

const Auth = ({
    authLanding
}: {
    authLanding: boolean | null
}) => {
    return (
        <BackgroundContainer>
            <AuthSelection></AuthSelection>
        </BackgroundContainer>
    )
}

export default Auth