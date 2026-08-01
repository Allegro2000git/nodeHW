import { db } from '../../db/db';
import type { PostViewModel } from '../types/post.interface';
import { ObjectId, type WithId } from 'mongodb';
import type { PostDb } from '../types/post.db.interface';
import type { PostQueryParamsSanitized } from '../../common/types/sortQueryFields.type';
import type { IPagination } from '../../common/types/paginationAndSorting';

export const postsQueryRepository = {
  _getInView(post: WithId<PostDb>): PostViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
  },
  async findAllPosts(queriesDto: PostQueryParamsSanitized, blogId?: string): Promise<IPagination<PostViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queriesDto;
    const filter: any = {};
    if (blogId) {
      filter.blogId = blogId;
    }

    const totalCount = await db.collections.postsCollection.countDocuments(filter);
    const skipCount = (pageNumber - 1) * pageSize;

    const posts = await db.collections.postsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skipCount)
      .limit(pageSize)
      .toArray();

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pagesCount === 0 ? 1 : pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: posts.map((p) => this._getInView(p)),
    };
  },

  async findPostById(id: string): Promise<PostViewModel | null> {
    const actualPost = await db.collections.postsCollection.findOne({ _id: new ObjectId(id) });
    return actualPost ? this._getInView(actualPost) : null;
  },
};
