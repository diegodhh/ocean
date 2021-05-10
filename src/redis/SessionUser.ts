import { RedisClient } from "redis";
import { JWTPayload } from "../types/JWTPayload";

export class SessionUser {
  constructor(private _client: RedisClient, private userid: string) {}

  private static _instance: SessionUser;

  public get values(): Promise<SessionData> | null | undefined {
    return new Promise((resolve, reject) => {
      this._client.get(this.userid, (err, value) => {
        if (err) {
          reject(err);
        }
        resolve(value && JSON.parse(value));
      });
    });
  }
  public set(newValues: Partial<SessionData>, userId: string = this.userid) {
    return new Promise((resolve, reject) => {
      this._client.get(userId, (err, value) => {
        if (err) {
          return reject(err);
        }
        const parsedValue: SessionUser = value ? JSON.parse(value) : {};
        const data: Partial<SessionData> = { ...parsedValue, ...newValues };
        this._client.set(userId, JSON.stringify(data), (err, value) => {
          if (err) {
            return reject(err);
          }

          return resolve(value);
        });
      });
    });
  }
  public setAndReplace(
    newValues: Partial<SessionData>,
    userId: string = this.userid
  ) {
    return new Promise((resolve, reject) => {
      this._client.set(userId, JSON.stringify(newValues), (err, value) => {
        if (err) {
          return reject(err);
        }

        return resolve(value);
      });
    });
  }
  public async delete(params: Array<keyof SessionData>) {
    const values = await this.values;

    if (!values) {
      return undefined;
    }
    let hasDeleted = false;
    params.forEach((key) => {
      hasDeleted = hasDeleted || !!values[key];
      delete values[key];
    });
    if (!hasDeleted) {
      return values;
    }
    return this.setAndReplace(values);
  }
  public async isTokenWhisteListed(refreshToken: string) {
    const values = await this.values;
    return values?.refreshToken && values.refreshToken === refreshToken;
  }
  public get client() {
    return this._client;
  }
}

export interface SessionData {
  refreshToken: string;
  payload: JWTPayload;
}
