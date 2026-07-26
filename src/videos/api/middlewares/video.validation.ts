import { body } from 'express-validator';
import { Resolution } from '../../types/video.interface';

export const titleValidation = body('title')
  .isString()
  .trim()
  .isLength({ min: 1, max: 40 })
  .withMessage('title length is not correct');

export const authorValidation = body('author')
  .isString()
  .trim()
  .isLength({ min: 1, max: 20 })
  .withMessage('author length is not correct');

const validResolutions = Object.values(Resolution);

export const availableResolutionsValidation = body('availableResolutions')
  .isArray({ min: 1 })
  .withMessage('availableResolutions must be an array')
  .custom((resolutions: any[]) => {
    const isValid = resolutions.every((res) => validResolutions.includes(res));
    if (!isValid) {
      throw new Error('Some of the resolutions are incorrect');
    }
    return true;
  });

export const minAgeRestrictionValidation = body('minAgeRestriction').custom((value) => {
  if (value === null) return true;
  if (!Number.isInteger(value) || value < 1 || value > 18) {
    throw new Error('minAgeRestriction must be an integer between 1 and 18, or null');
  }
  return true;
});

export const canBeDownloadedValidation = body('canBeDownloaded')
  .isBoolean()
  .withMessage('canBeDownloaded must be a boolean');

export const publicationDateValidation = body('publicationDate')
  .isString()
  .isISO8601()
  .withMessage('publicationDate must be a valid ISO8601 string');
