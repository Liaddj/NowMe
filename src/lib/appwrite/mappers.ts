import type { Models } from "appwrite";
import type { IPost, IUser } from "@/types";

export function mapPost(doc: Models.Document): IPost {
  return doc as unknown as IPost;
}

export function mapPosts(docs: Models.Document[]): IPost[] {
  return docs.map(mapPost);
}

export function mapUser(doc: Models.Document): IUser {
  return doc as unknown as IUser;
}