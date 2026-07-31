import { db } from '../../db/db';
import type { BlogViewModel } from '../types/blog.interface';
import { ObjectId, type WithId } from 'mongodb';
import type { BlogDb } from '../types/blog.db.interface';

export const blogsQueryRepository = {
  _getInView(blog: WithId<BlogDb>): BlogViewModel {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  },
  async findAllBlogs(): Promise<BlogViewModel[]> {
    const blogs = await db.collections.blogsCollection.find().toArray();
    return blogs.map((b) => this._getInView(b));
  },

  async findBlogById(id: string): Promise<BlogViewModel | null> {
    const blog = await db.collections.blogsCollection.findOne({ _id: new ObjectId(id) });
    return blog ? this._getInView(blog) : null;
  },
};
