import express from 'express';
import { setupApp } from './setup-app';
import { appConfig } from './common/config/config';

const app = express();
setupApp(app);

app.listen(appConfig.PORT, () => {
  console.log(`Example app listening on port ${appConfig.PORT}`);
});
