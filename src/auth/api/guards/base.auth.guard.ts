import { Request, Response, NextFunction } from 'express';
import { HttpStatuses } from '../../../common/types/httpStatuses';

export const ADMIN_LOGIN = 'admin';
export const ADMIN_PASS = 'qwerty';

export const baseAuthGuard = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.sendStatus(HttpStatuses.Unauthorized);
  }

  const [authType, token] = authHeader.split(' ');

  if (!authType || !token || authType.toLowerCase() !== 'basic') {
    return res.sendStatus(HttpStatuses.Unauthorized);
  }

  try {
    const credentials = Buffer.from(token, 'base64').toString('utf-8');
    const [username, ...passwordParts] = credentials.split(':');

    const password = passwordParts.join(':');

    if (username !== ADMIN_LOGIN || password !== ADMIN_PASS) {
      return res.sendStatus(HttpStatuses.Unauthorized);
    }

    return next();
  } catch (error) {
    return res.sendStatus(HttpStatuses.Unauthorized);
  }
};
