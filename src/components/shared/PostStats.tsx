import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"

import { checkIsLiked } from "@/lib/utils"
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetCurrentUser,
} from "@/lib/react-query/queriesAndMutation"
import type { IPost, IUser } from "@/types"
import Loader from "./Loader"

type PostStatsProps = {
  post: IPost
  userId: string
}

const PostStats = ({ post, userId }: PostStatsProps) => {
  const location = useLocation()

  const likesList = post?.likes?.map((user: any) => user.$id || user) || []

  const [likes, setLikes] = useState<string[]>(likesList)
  const [isSaved, setIsSaved] = useState(false)
  const [savedRecordId, setSavedRecordId] = useState<string | null>(null)

  const { mutate: likePost } = useLikePost()
  const { mutate: savePost, isPending: isSavingPost } = useSavePost()
  const { mutate: deleteSavePost, isPending: isDeletingSaved } =
    useDeleteSavedPost()

  const { data: currentUser } = useGetCurrentUser()

  const savedPostRecord = currentUser?.save?.find(
    (record: NonNullable<IUser["save"]>[number]) => {
      const savedPostId =
        typeof record.post === "string" ? record.post : record.post?.$id

      return savedPostId === post.$id
    },
  )

  useEffect(() => {
    setIsSaved(!!savedPostRecord)
    setSavedRecordId(savedPostRecord?.$id ?? null)
  }, [savedPostRecord])

  useEffect(() => {
    setLikes(post?.likes?.map((user: any) => user.$id || user) || [])
  }, [post])

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation()

    let newLikes = [...likes]

    if (newLikes.includes(userId)) {
      newLikes = newLikes.filter((Id) => Id !== userId)
    } else {
      newLikes.push(userId)
    }

    setLikes(newLikes)
    likePost({ postId: post?.$id || "", likesArray: newLikes })
  }

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (isSavingPost || isDeletingSaved) return

    if (savedRecordId) {
      setIsSaved(false)
      const currentSavedRecordId = savedRecordId
      setSavedRecordId(null)

      return deleteSavePost(currentSavedRecordId, {
        onError: () => {
          setIsSaved(true)
          setSavedRecordId(currentSavedRecordId)
        },
      })
    }

    setIsSaved(true)
    savePost(
      { postId: post?.$id || "", userId: userId },
      {
        onSuccess: (data) => {
          if (data) {
            setSavedRecordId(data.$id)
          }
        },
        onError: () => {
          setIsSaved(false)
        },
      },
    )
  }

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : ""

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}
    >
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes?.length}</p>
      </div>

      <div className="flex gap-2">
        {isSavingPost || isDeletingSaved ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="share"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={handleSavePost}
          />
        )}
      </div>
    </div>
  )
}

export default PostStats
