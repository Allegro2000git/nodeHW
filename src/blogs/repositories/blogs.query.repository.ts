import { db } from '../../db/db';
import type { BlogViewModel } from '../types/blog.interface';
import { ObjectId, type WithId } from 'mongodb';
import type { BlogDb } from '../types/blog.db.interface';
import type { IPagination } from '../../common/types/paginationAndSorting';
import type { BlogQueryParamsSanitized } from '../../common/types/sortQueryFields.type';

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
  async findAllBlogs(queriesDto: BlogQueryParamsSanitized): Promise<IPagination<BlogViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = queriesDto;

    const searchNameTermFilter: any = {};

    if (searchNameTerm) {
      searchNameTermFilter.name = { $regex: searchNameTerm, $options: 'i' };
    }

    const totalCount = await db.collections.blogsCollection.countDocuments(searchNameTermFilter);
    const skipCount = (pageNumber - 1) * pageSize;

    const blogs = await db.collections.blogsCollection
      .find(searchNameTermFilter)
      .sort({ [sortBy]: sortDirection })
      .skip(skipCount)
      .limit(pageSize)
      .toArray();

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      page: pageNumber,
      pageSize,
      pagesCount: pagesCount === 0 ? 1 : pagesCount,
      totalCount,
      items: blogs.map((b) => this._getInView(b)),
    };
  },

  async findBlogById(id: string): Promise<BlogViewModel | null> {
    const blog = await db.collections.blogsCollection.findOne({ _id: new ObjectId(id) });
    return blog ? this._getInView(blog) : null;
  },


};
