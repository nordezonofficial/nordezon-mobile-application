import PostForm from '@/components/brands/posts/PostForm'
import BackgroundContainer from '@/components/common/BackgroundContainer'
import React from 'react'

const editPost = () => {
    return (
        <BackgroundContainer>
           <PostForm isEdit={true}></PostForm>
        </BackgroundContainer>
    )
}

export default editPost