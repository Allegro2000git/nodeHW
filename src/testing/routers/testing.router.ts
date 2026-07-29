import { Router, Request, Response } from 'express';
import { HttpStatuses } from '../../common/types/httpStatuses';
import { db } from '../../db/db';

export const testingRouter = Router();

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
  try {
    await db.drop();
    res.sendStatus(HttpStatuses.NoContent);
  } catch (e) {
    console.error('Error during testing clear data:', e);
    res.sendStatus(HttpStatuses.ServerError);
  }
});
