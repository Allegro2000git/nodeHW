import { setupApp } from './setup-app';
import { appConfig } from './common/config/config';
import { db } from './db/db';

setupApp();

const startApp = async () => {
  await db.run(appConfig.MONGO_URL!);
  console.log(`Example app listening on port ${appConfig.PORT}`);
};

startApp();
