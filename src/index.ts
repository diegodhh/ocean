import { Application } from "express";
import { Express } from "express-serve-static-core";
import { createConnection } from "typeorm";
import app from "./app";
import ormconfig from "./ormconfig";
async function main(Application: Express): Promise<Application> {
  try {
    let conn;

    conn = await createConnection(ormconfig);
    if (process.env.NODE_ENV === "production") {
    }
    //coment
  } catch (err) {
    console.log(err);
  }

  if (process.env.NODE_ENV !== "test") {
    await app.listen(process.env.PORT);
  }
  return app;
}
export default main(app);
