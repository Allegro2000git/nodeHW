import { blogsRepository } from '../repositories/blogs.repository';
import type { BlogInputModel } from '../types/blog.interface';
import type { BlogDb } from '../types/blog.db.interface';

export const blogsService = {
  async create(dto: BlogInputModel): Promise<string> {
    const blogCreatedData: BlogDb = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    };

    return await blogsRepository.create(blogCreatedData);
  },

  async update(id: string, dto: BlogInputModel): Promise<boolean> {
    const updatedBlogData: BlogDb = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    };

    return await blogsRepository.update(id, updatedBlogData);
  },

  async delete(id: string): Promise<boolean> {
    return await blogsRepository.delete(id);
  },
};
