import { db } from '../../db/db';
import { ObjectId, WithId } from 'mongodb';
import type { BlogDb } from '../types/blog.db.interface';

export const blogsRepository = {
  async findBlogById(id: string): Promise<WithId<BlogDb> | null> {
    return await db.collections.blogsCollection.findOne({ _id: new ObjectId(id) });
  },
  async create(newBlogData: BlogDb): Promise<string> {
    const newBlog = await db.collections.blogsCollection.insertOne({ ...newBlogData });
    return newBlog.insertedId.toString();
  },
  async update(id: string, updatedBlogData: BlogDb): Promise<boolean> {
    const updateResult = await db.collections.blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedBlogData }
    );

    return updateResult.matchedCount > 0;
  },
  async delete(id: string): Promise<boolean> {
    const isDeleted = await db.collections.blogsCollection.deleteOne({ _id: new ObjectId(id) });
    return isDeleted.deletedCount === 1;
  },
};
