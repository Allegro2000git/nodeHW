import { postsRepository } from '../repositories/posts.repository';
import type { PostInputModel } from '../types/post.interface';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';
import type { PostDb } from '../types/post.db.interface';

export const postsService = {
  async create(dto: PostInputModel): Promise<string | null> {
    const blog = await blogsRepository.findBlogById(dto.blogId);
    if (!blog) return null;

    const postCreatedData: PostDb = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name,
    };

    return await postsRepository.create(postCreatedData);
  },

  async update(id: string, dto: PostInputModel): Promise<boolean> {
    const blog = await blogsRepository.findBlogById(dto.blogId);
    if (!blog) return false;

    const updatedPostData: PostDb = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name,
    };

    return await postsRepository.update(id, updatedPostData);
  },

  async delete(id: string): Promise<boolean> {
    return await postsRepository.delete(id);
  },
};
