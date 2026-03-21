import type { Models } from "appwrite"  

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};
export type IContextType = {
  user: IUser
  isLoading: boolean
  setUser: React.Dispatch<React.SetStateAction<IUser>>
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  checkAuthUser: () => Promise<boolean>
}

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string[];
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
 imageUrl: URL | string;
  file: File[];
  location?: string;
  tags?: string[];
};
export interface IUser extends Models.Document {
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
  accountId: string;

  save?: {
    $id: string;
    post: {
      $id: string;
    };
  }[];
}

export interface IPost extends Models.Document {
  caption: string;
  location?: string;
  tags: string[];
  imageUrl: string;
  imageId: string;
  creator: IUser;
  likes: string[];
}

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

