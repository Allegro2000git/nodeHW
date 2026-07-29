import { ObjectId } from 'mongodb';
import { ADMIN_LOGIN, ADMIN_PASS } from '../../../src/auth/api/guards/base.auth.guard';

export const testAuthHeader = {
  Authorization: 'Basic ' + Buffer.from(`${ADMIN_LOGIN}:${ADMIN_PASS}`).toString('base64'),
};

export const getNonExistentId = (): string => new ObjectId().toString();
