import { createSlice } from '@reduxjs/toolkit';
type RequestType = 'ADS' | 'ORIGINALS' | 'POST' | 'STORY' | 'CATALOGUE' | 'REEL';

const initialState = {
  postList: [] as any, /* ----- post list for the brand/user ---*/
  postMetaData: {}, /* ----- postMetaData list for the brand/user ---*/
  post: {},     /* ----- post  for the brand/user ---*/
  catalogueList: [] as any,  /* ----- catalogueList list for the brand/user ---*/
  catalogueMetaData: {}, /* ----- catalogueMetaData list for the brand/user ---*/
  catalogue: {}, /* ----- catalogue  for the brand/user ---*/
  reelList: [] as any, /* ----- reelList list for the brand/user ---*/
  reelMetaData: {}, /* ----- reelMetaData list for the brand/user ---*/
  reel: {}, /* ----- reel  for the brand/user ---*/
  storyList: [] as any,       /* ----- storyList list for the brand/user ---*/
  storyMetaData: {},           /* ----- storyMetaData list for the brand/user ---*/
  story: {},                   /* ----- story  for the brand/user ---*/
  renderKey: 1,
  watchReel: {},  /* -- watching selected reel/story object ---*/
  watchStory: {},               /* -- watching selected reel/story object ---*/
  postLikesComments: [] as any, /* -- postlike commes meta data ---*/
  commentsList: [] as any,  /* --- comments box ---*/
  commentsMetaData: {}, /* --- comments meta data ---*/
  homeFeeds: [],
  homeFeedsMetaData: {},

  /**
   * Selected resources
   * ids: Product | Post | Ads
   * type: ResourceType (ad, original, promoted)
   * requestType: RequestType (ads, originals, etc.)
   */
  selectedEntity: {
    id: 0 as number | string,
    requestType: "" as RequestType,
    item: {},
    backId: null,
    hasBackId: null,
    backItem: {},
  },


};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    /* --- Post Data --- */
    setPostList: (state, action) => {
      state.postList = action.payload;

      updatePostLikesComments(state, action.payload)


    },

    setPostLikesComments: (state, action) => {
      const newPosts: any[] = action.payload;

      // Map existing likes/comments by postId
      const likesMap = new Map(state.postLikesComments.map((p: any) => [p.postId, p]));

      newPosts.forEach(post => {
        if (!likesMap.has(post.id)) {
          // Add new post likes/comments if not already present
          state.postLikesComments.push({
            postId: post.id,
            isLiked: false,
            likesCount: post._count?.likes ?? 0,
            commentsCount: post._count?.comments ?? 0,
          });
        } else {
          // Update counts for existing posts but keep isLiked as is
          const existing: any = likesMap.get(post.id)!;
          existing.likesCount = post._count?.likes ?? existing.likesCount;
          existing.commentsCount = post._count?.comments ?? existing.commentsCount;
        }
      });
    },



    setPostMetaData: (state, action) => {
      state.postMetaData = action.payload;
    },
    setSinglePost: (state, action) => {
      state.post = action.payload;
    },
    setRenderKey: (state) => {
      state.renderKey += 1;
    },
    setPost: (state, action) => {

      if (!Array.isArray(state.postList)) state.postList = [];
      const newPost = action.payload;
      const existingIndex = state.postList.findIndex((post: any) => post.id === newPost.id);
      if (existingIndex !== -1) {
        state.postList[existingIndex] = newPost;

      } else {
        state.postList.unshift(newPost);
      }
    },
    removePost: (state, action) => {
      const id = action.payload;
      state.postList = state.postList.filter((post: any) => post.id !== id);
    },

    /* --- Catalogue Data --- */
    setCatalogueList: (state, action) => {
      state.catalogueList = action.payload;
      updatePostLikesComments(state, action.payload)

    },
    setCatalogueMetaData: (state, action) => {
      state.catalogueMetaData = action.payload;
    },
    setSingleCatalogue: (state, action) => {
      state.catalogue = action.payload;
    },
    setCatalogue: (state, action) => {

      if (!Array.isArray(state.catalogueList)) state.catalogueList = [];
      const newCatalogue = action.payload;
      const existingIndex = state.catalogueList.findIndex((cat: any) => cat.id === newCatalogue.id);
      if (existingIndex !== -1) {
        state.catalogueList[existingIndex] = newCatalogue;
      } else {
        state.catalogueList.unshift(newCatalogue);
      }
    },
    removeCatalogue: (state, action) => {
      const id = action.payload;
      state.catalogueList = state.catalogueList.filter((cat: any) => cat.id !== id);
    },

    /* --- Reel Data --- */
    setReelList: (state, action) => {
      state.reelList = action.payload;
      updatePostLikesComments(state, action.payload)
      // state.postLikesComments = action.payload.map((post: any) => ({
      //   postId: post.id,
      //   isLiked: false,
      //   likesCount: post._count?.likes ?? 0,
      //   commentsCount: post._count?.comments ?? 0,
      // }));
    },
    setReelMetaData: (state, action) => {
      state.reelMetaData = action.payload;
    },
    setSingleReel: (state, action) => {
      state.reel = action.payload;
    },
    setReel: (state, action) => {
      if (!Array.isArray(state.reelList)) state.reelList = [];
      const newReel = action.payload;
      const existingIndex = state.reelList.findIndex((reel: any) => reel.id === newReel.id);
      if (existingIndex !== -1) {
        state.reelList[existingIndex] = newReel;
      } else {
        state.reelList.unshift(newReel);
      }
    },
    removeReel: (state, action) => {
      const id = action.payload;
      state.reelList = state.reelList.filter((reel: any) => reel.id !== id);
    },
    setWatchReel: (state, action) => {
      state.watchReel = action.payload;
    },

    /* --- 🆕 Story Data --- */
    setStoryList: (state, action) => {
      state.storyList = action.payload;
      updatePostLikesComments(state, action.payload)

    },
    setStoryMetaData: (state, action) => {
      state.storyMetaData = action.payload;
    },
    setSingleStory: (state, action) => {
      state.story = action.payload;
    },

    setStory: (state, action) => {
      if (!Array.isArray(state.storyList)) state.storyList = [];
      const newStory = action.payload;
      const existingIndex = state.storyList.findIndex((story: any) => story.id === newStory.id);
      if (existingIndex !== -1) {
        state.storyList[existingIndex] = newStory;
      } else {
        state.storyList.unshift(newStory);
      }
    },

    removeStory: (state, action) => {
      const id = action.payload;
      state.storyList = state.storyList.filter((story: any) => story.id !== id);
    },

    setWatchStory: (state, action) => {
      state.watchStory = action.payload;
    },


    /* -- set list post ---*/
    setLikePost: (state, action) => {
      const { postId, isLiked } = action.payload; // isLiked should be boolean

      const post: any = state.postLikesComments.find((p: any) => p.postId === postId);
      if (!post) return;

      const previousIsLiked = post.isLiked;

      post.isLiked = isLiked;

      if (!previousIsLiked && isLiked) {
        post.likesCount += 1;
      } else if (previousIsLiked && !isLiked) {
        post.likesCount = Math.max(0, post.likesCount - 1);
      }
    },

    /* --- set comments List ---*/
    setCommentList: (state, action) => {
      state.commentsList = action.payload;
    },
    /* --- set comments meta data ---*/
    setCommentMetaData: (state, action) => {
      state.commentsMetaData = action.payload;
    },
    /* --- set comments  data ---*/
    setNewComment: (state, action) => {
      const newComment = {
        ...action.payload,
        replies: [],
      };
      state.commentsList.unshift(newComment); // push at the end
    },

    /* --- set the Replies ---*/
    /* --- set the Replies ---*/
    setNewReplies: (state, action) => {
      const newReply = action.payload; // the reply object
      const parentId = newReply.parentComment.id; // the id of the parent comment

      // Find the parent comment in commentsList
      const parentIndex = state.commentsList.findIndex((c: any) => c.id === parentId);

      if (parentIndex !== -1) {
        // Initialize replies array if it doesn't exist
        if (!state.commentsList[parentIndex].replies) {
          state.commentsList[parentIndex].replies = [];
        }

        // Push the new reply into the replies array
        state.commentsList[parentIndex].replies.push({
          id: newReply.id,
          user: newReply.user, // or user object if available
          commentText: newReply.commentText,
          createdAt: newReply.createdAt,
        });
      }
    },

    /* --- set selected entity for detailing ---*/
    setSelectedEntity: (state, action) => {
      state.selectedEntity = {
        ...state.selectedEntity,   // keep existing keys
        ...action.payload          // override only keys provided in payload
      };
    },

    /* --- set home Feed ---*/
    setHomeFeedList: (state, action) => {
      state.homeFeeds = action.payload
    },
    /* --- set home Feed Meta Data ---*/
    setHomeFeedMetaData: (state, action) => {
      state.homeFeedsMetaData = action.payload
    },

  },
});

/* --- update likes ---*/
const updatePostLikesComments = (state: any, posts: any[]) => {
  const likesMap = new Map(state.postLikesComments.map((p: any) => [p.postId, p]));
  posts.forEach(post => {
    if (!likesMap.has(post.id)) {
      state.postLikesComments.push({
        postId: post.id,
        isLiked: post?.likes && post.likes.length > 0,
        likesCount: post._count?.likes ?? 0,
        commentsCount: post._count?.comments ?? 0,
      });
    }
  });
};


export const {
  /* -- selectedEntity ---*/
  setSelectedEntity,

  /* -- home feed --*/
  setHomeFeedList,
  setHomeFeedMetaData,

  /* --  Posts --*/
  setPostList,
  setPostMetaData,
  setSinglePost,
  setRenderKey,
  setPost,
  removePost,
  setLikePost,

  /* -- Catalogue --*/
  setCatalogueList,
  setCatalogueMetaData,
  setSingleCatalogue,
  setCatalogue,
  removeCatalogue,

  /* --  Reels --*/
  setReelList,
  setReelMetaData,
  setSingleReel,
  setReel,
  removeReel,
  setWatchReel,

  /* -- 🆕 Stories --*/
  setStoryList,
  setStoryMetaData,
  setSingleStory,
  setStory,
  removeStory,
  setWatchStory,


  /* -- Comments --*/
  setCommentList,
  setCommentMetaData,
  setNewComment,
  setNewReplies,
} = postSlice.actions;

export default postSlice.reducer;
