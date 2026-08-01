import { blogsRepository } from '../repositories/blogs.repository';
import type { BlogInputModel, CreatePostByBlogInputModel } from '../types/blog.interface';
import type { BlogDb } from '../types/blog.db.interface';
import { postsService } from '../../posts/domain/posts.service';

export const blogsService = {
  async create(dto: BlogInputModel): Promise<string> {
    const blogCreatedData: BlogDb = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    return await blogsRepository.create(blogCreatedData);
  },

  async createPostForBlog(blogId: string, newPostForBlogDto: CreatePostByBlogInputModel): Promise<string | null> {
    const blog = await blogsRepository.findBlogById(blogId);
    if (!blog) return null;

    const postWithBlogId = {
      title: newPostForBlogDto.title,
      shortDescription: newPostForBlogDto.shortDescription,
      content: newPostForBlogDto.content,
      blogId,
    };

    return await postsService.create(postWithBlogId);
  },

  async update(id: string, dto: BlogInputModel): Promise<boolean> {
    const currentBlog = await blogsRepository.findBlogById(id);
    if (!currentBlog) return false;

    const updatedBlogData: BlogDb = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: currentBlog.createdAt,
      isMembership: currentBlog.isMembership,
    };

    return await blogsRepository.update(id, updatedBlogData);
  },

  async delete(id: string): Promise<boolean> {
    return await blogsRepository.delete(id);
  },
};
