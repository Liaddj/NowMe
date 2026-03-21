import { useUserContext } from "@/context/AuthContext";
import { useGetUserPosts } from "@/lib/react-query/queriesAndMutation";
import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";

 const Profile = () => {
  const { user } = useUserContext()

  const { data: posts, isLoading } = useGetUserPosts(user.$id)

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex gap-7 items-center">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-24 h-24 lg:w-32 lg:h-32 rounded-full"
          />
          <div className="flex flex-col">
            <h2 className="h2-bold w-full">{user.name}</h2>
            <p className="text-light-3">@{user.username}</p>
            <p className="mt-5 text-light-2">{user.bio}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full max-w-5xl gap-9">
        <hr className="border-dark-4 w-full" />
        
        {isLoading && !posts ? (
          <Loader />
        ) : (
          <GridPostList posts={posts?.documents || []} showUser={false} />
        )}
      </div>
    </div>
  );
};

export default Profile;