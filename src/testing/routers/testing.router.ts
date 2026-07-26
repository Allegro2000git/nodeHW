import { Router, Request, Response } from 'express';
import { HttpStatuses } from '../../common/types/httpStatuses';
import { db } from '../../db/ in-memory.db';

export const testingRouter = Router();

testingRouter.delete('/all-data', (req: Request, res: Response) => {
  db.videos = [];
  res.sendStatus(HttpStatuses.NoContent);
});
