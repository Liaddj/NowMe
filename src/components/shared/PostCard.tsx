import { useUserContext } from "@/context/AuthContext"
import { formatDateStringAgo } from "@/lib/utils"
import type { Models } from "appwrite"
import { Link } from "react-router-dom"

export type IPostDocument = Models.Document & {
  creator: {
    $id: string
    name: string
    imageUrl: string
  }
  location: string
  caption?: string
  imageUrl?: string
  imageId?: string
}

type PostCardProps = {
  post: IPostDocument
}

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext()

  
  if (!post.creator) return
  console.log(post.creator)
 
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post?.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="rounded0full w-12 lg:h-12"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:bofy-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtitle-semibold lg:small-regular">
                {formatDateStringAgo(post.$createdAt)}
              </p>
              -
              <p className="subtitle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>
        <Link
          to={`/update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id ? "hidden" : ""}`}
        >
          <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
        </Link>
      </div>
    </div>
  )
}

export default PostCard
