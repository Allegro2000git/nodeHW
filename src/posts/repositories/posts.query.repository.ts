import { db } from '../../db/db';
import type { PostViewModel } from '../types/post.interface';
import { ObjectId, type WithId } from 'mongodb';
import type { PostDb } from '../types/post.db.interface';

export const postsQueryRepository = {
  _getInView(post: WithId<PostDb>): PostViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
    };
  },
  async findAllPosts(): Promise<PostViewModel[]> {
    const posts = await db.collections.postsCollection.find().toArray();
    return posts.map((p) => this._getInView(p));
  },

  async findPostById(id: string): Promise<PostViewModel | null> {
    const actualPost = await db.collections.postsCollection.findOne({ _id: new ObjectId(id) });
    return actualPost ? this._getInView(actualPost) : null;
  },
};
