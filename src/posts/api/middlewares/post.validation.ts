import { body } from 'express-validator';
import { blogsRepository } from '../../../blogs/repositories/blogs.repository';

export const postTitleValidation = body('title')
  .isString()
  .withMessage('title must be a string')
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage('post title name length is not correct');

export const postShortDescriptionValidation = body('shortDescription')
  .isString()
  .withMessage('short description must be a string')
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('post description length is not correct');

export const postContentValidation = body('content')
  .isString()
  .withMessage('content must be a string')
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage('content length must be between 1 and 1000 characters');

export const postBlogIdValidation = body('blogId')
  .isString()
  .withMessage('BlogId must be a string')
  .trim()
  .custom(async (blogId: string) => {
    const blog = await blogsRepository.findBlogById(blogId);
    if (!blog) {
      throw new Error('Blog with provided id does not exist');
    }
    return true;
  });
