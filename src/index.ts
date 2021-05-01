import { Application } from "express";
import { Express } from "express-serve-static-core";
import { createConnection } from "typeorm";
import app from "./app";
import config from "./config/config";
import ormconfig from "./ormconfig";
import { Env } from "./types/Env";
async function main(Application: Express): Promise<Application> {
  let conn;
  try {
    if (config.env === Env.PRODUCTION) {
    }
    //coment
  } catch (err) {
    console.log(err);
  }

  if (config.env === Env.TEST) {
    await app.listen(config.port);
    conn = await createConnection(ormconfig);
  }
  return app;
}
export default main(app);
