import { ID, Query } from "appwrite"
import { mapPost, mapPosts, mapUser } from "./mappers";

import type { INewPost, INewUser, IUpdatePost, IPost, IUser } from "@/types"
import { account, appwriteConfig, avatars, databases, storage } from "./config"

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name,
    )

    if (!newAccount) throw Error

    const avatarUrl = avatars.getInitials(user.name)

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl.toString(),
    })

    return newUser
  } catch (error) {
    console.log(error)
    return error
  }
}

export async function saveUserToDB(user: {
  accountId: string
  email: string
  name: string
  imageUrl: string
  username?: string
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user,
    )

    return newUser
  } catch (error) {
    console.log(error)
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password,
    )
    return session
  } catch (error) {
    console.log(error)
  }
}

export async function getCurrentUser(): Promise<IUser> {
  const accountData = await account.get();

  const res = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [Query.equal("accountId", accountData.$id)]
  );

  if (!res.documents.length) {
    throw new Error("User not found");
  }

  return mapUser(res.documents[0]);
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current")

    return session
  } catch (error) {
    console.log(error)
  }
}

export async function createPost(post: INewPost): Promise<IPost> {
  const uploadedFile = await uploadFile(post.file[0]);
  if (!uploadedFile) throw new Error("Upload failed");

  const fileUrl = getFilePreview(uploadedFile.$id);
  if (!fileUrl) throw new Error("Preview failed");

  const tags = post.tags
    ? post.tags.replace(/ /g, "").split(",")
    : [];

  const newPost = await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    ID.unique(),
    {
      creator: post.userId,
      caption: post.caption,
      imageUrl: fileUrl,
      imageId: uploadedFile.$id,
      location: post.location,
      tags,
    }
  );

  return mapPost(newPost);
}
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file,
    )

    return uploadedFile
  } catch (error) {
    console.log(error)
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFileView(appwriteConfig.storageId, fileId)

    return String(fileUrl)
  } catch (error) {
    console.log(error)
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId)

    return { status: "ok" }
  } catch (error) {
    console.log(error)
  }
}

export async function getRecentPosts(): Promise<IPost[]> {
  const res = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [
      Query.orderDesc("$createdAt"),
      Query.limit(20),
      Query.select(["*", "creator.*", "likes.*"]),
    ]
  );

  return mapPosts(res.documents);
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      },
    )

    return updatedPost
  } catch (error) {
    console.log(error)
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        users: userId,
        post: postId,
      },
    )

    if (!updatedPost) throw Error
    return updatedPost
  } catch (error) {
    console.log(error)
  }
}

export async function deletedSavePost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId,
    )

    if (!statusCode) throw Error
    return { status: "ok" }
  } catch (error) {
    console.log(error)
  }
}

export async function getPostById(postId: string): Promise<IPost> {
  const doc = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    postId,
    [Query.select(["*", "creator.*", "likes.*"])]
  );

  return mapPost(doc);
}

export async function updatePost(post: IUpdatePost) {
  const hasFileUpdate = post.file.length > 0

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    }
    if (hasFileUpdate) {
      const uploadedFile = await uploadFile(post.file[0])
      if (!uploadedFile) throw Error

      const fileUrl = getFilePreview(uploadedFile.$id)

      if (!fileUrl) {
        deleteFile(uploadedFile.$id)
        throw Error
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || []

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      },
    )

    if (!updatedPost) {
      await deleteFile(post.imageId)
      throw Error
    }

    return updatedPost
  } catch (error) {
    console.log(error)
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
    )

    return { status: "ok" }
  } catch (error) {
    console.log(error)
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: string }) {
  const querys: any[] = [
    Query.orderDesc("$updatedAt"),
    Query.limit(10),
    Query.select(["*", "creator.*", "likes.*"]),
  ]

  if (pageParam) {
    querys.push(Query.cursorAfter(pageParam))
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      querys,
    )

    if (!posts) throw Error

    return {
      ...posts,
      documents: mapPosts(posts.documents),
    }
  } catch (error) {
    console.log(error)
  }
}
export async function SearchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [
        Query.search("caption", searchTerm),
        Query.select(["*", "creator.*", "likes.*"]),
      ],
    )

    if (!posts) throw Error

    return {
      ...posts,
      documents: mapPosts(posts.documents),
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}
