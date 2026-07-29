import { db } from '../../db/db';
import { ObjectId, type WithId } from 'mongodb';
import type { PostDb } from '../types/post.db.interface';

export const postsRepository = {
  async findPostById(id: string): Promise<WithId<PostDb> | null> {
    return await db.collections.postsCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newPostData: PostDb): Promise<string> {
    const newPost = await db.collections.postsCollection.insertOne({ ...newPostData });
    return newPost.insertedId.toString();
  },

  async update(id: string, updatedPostData: PostDb): Promise<boolean> {
    const updateResult = await db.collections.postsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedPostData }
    );

    return updateResult.matchedCount > 0;
  },

  async delete(id: string): Promise<boolean> {
    const isDeleted = await db.collections.postsCollection.deleteOne({ _id: new ObjectId(id) });
    return isDeleted.deletedCount === 1;
  },
};
