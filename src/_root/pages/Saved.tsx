import GridPostList from "@/components/shared/GridPostList"
import { useUserContext } from "@/context/AuthContext"
import Loader from "@/components/shared/Loader"

const Saved = () => {
  const { user } = useUserContext()

  const savedPosts = (user.save ?? [])
    .filter(
      (saveRecord: any) =>
        saveRecord.post && typeof saveRecord.post === "object",
    )
    .map((saveRecord: any) => ({
      ...saveRecord.post,
      creator: {
        imageUrl: user.imageUrl,
      },
    }))
    .reverse()

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {!user ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savedPosts.length === 0 ? (
            <p className="text-light-4">No saved posts</p>
          ) : (
            <GridPostList posts={savedPosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  )
}

export default Saved
