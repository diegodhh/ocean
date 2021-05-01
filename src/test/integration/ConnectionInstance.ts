import { Connection, createConnection } from "typeorm";
import ormconfig from "../../ormconfig";
//singleton for make posible test to run independently and create conecction only if is necessary
export class TestingConnection {
  private static _instance: TestingConnection;
  _conn: Promise<Connection> | Connection;

  private constructor() {
    this._conn = createConnection(ormconfig); //...
  }
  public get conn() {
    return this._conn;
  }

  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this());
  }
}
