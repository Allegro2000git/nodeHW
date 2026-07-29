import { body } from 'express-validator';

export const blogNameValidation = body('name')
  .isString()
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage('blogs name length is not correct');

export const blogDescriptionValidation = body('description')
  .isString()
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage('blog description length is not correct');

export const blogWebsiteUrlValidation = body('websiteUrl')
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('Website URL length must be between 1 and 100 characters')
  .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
  .withMessage('Website URL does not match required pattern');
