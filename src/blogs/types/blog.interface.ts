import type { PostInputModel } from '../../posts/types/post.interface';

export interface BlogViewModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export type BlogInputModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type CreatePostByBlogInputModel = Omit<PostInputModel, 'blogId'>; //Create new post for specific blog
