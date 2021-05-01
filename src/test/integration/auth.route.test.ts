import { Response } from "express";
import faker from "faker";
import httpStatus from "http-status";
import { Server } from "node:http";
import { Connection } from "typeorm";
import app from "../../app";
import { APIvertion } from "../../types/api";
import { AuthRoutes, V1Routes } from "../../types/api/v1";
import { tokenTypes } from "../../types/tokens";
import { User } from "./../../entity/User";
import "./../../jestUtils/customMatchers";
import { generateToken } from "./../../services/token.service";
import { customApiErrors } from "./../../types/errors/index";
import { TestingConnection } from "./ConnectionInstance";
const PORT = 5000;
let server: Server | null;
const request = require("supertest");
interface SuperTestResponse extends Response {
  body: any;
  headers: any;
  text: string;
}
describe("Test the root path", () => {
  test("It should response the GET method", async (done) => {
    request(await app)
      .get("/")
      .then((response: SuperTestResponse) => {
        expect(response.status).toBe(200);

        expect(response.text).toEqual(expect.stringMatching("Hello World"));
        done();
      });
  });
});

describe("test google auth", () => {
  test("It should redirect to google auth2", async (done) => {
    request(await app)
      .get("/v1/auth/google")
      .then((response: SuperTestResponse) => {
        expect(response.status).toBe(302); //found
        expect((response.headers as any).location).toEqual(
          expect.stringMatching("https://accounts.google.com/o/oauth2")
        );
        done();
      });
  });
  test("It should redirect to something", async (done) => {
    request(await app)
      .get("/v1/auth/google/callback")
      .then((response: SuperTestResponse) => {
        expect(response.status).toBe(302); //found
        done();
      });
  });

  test("It should return 200 when failed", async (done) => {
    request(await app)
      .get("/v1/auth/google/failure")
      .then((response: SuperTestResponse) => {
        expect(response.status).toBe(200); //foundd21212
        done();
      });
  });

  describe("me path", () => {
    let conn: Connection;
    beforeAll(async () => {
      conn = await TestingConnection.Instance.conn;
    });
    test("Should return unautorized", async (done) => {
      request(await app)
        .get("/v1/auth/me")
        .then((response: SuperTestResponse) => {
          expect(response.status).toBe(httpStatus.UNAUTHORIZED); //foundd21212
          done();
        });
    });
    test("should return unautorized", async (done) => {
      request(await app)
        .get("/v1/auth/me")
        .set("authorization", "token 1234567890")
        .then((response: SuperTestResponse) => {
          expect(response.status).toBe(httpStatus.UNAUTHORIZED); //foundd21212
          done();
        });
    });
    test("Should return unautorized", async (done) => {
      request(await app)
        .get("/v1/auth/me")
        .set("Authorization", "Bearer 1234567890")
        .then((response: SuperTestResponse) => {
          expect(response.status).toBe(httpStatus.UNAUTHORIZED); //foundd21212
          done();
        });
    });
    describe("create and delete user on database", () => {
      let user: User, userData;
      beforeEach(async () => {
        userData = {
          firstName: faker.name.firstName(),
          email: faker.internet.email().toLowerCase(),
          lastName: faker.name.lastName(),
          phone: faker.phone.phoneNumber(),
        };

        user = await User.create(userData).save();
      });
      afterEach(async () => {
        if (user) {
          await User.delete({ id: user.id });
        }
      });
      test("Should return authorized and object containing new user id and email", async (done) => {
        const token = await generateToken(user.id, tokenTypes.ACCESS);
        if (!user) {
          throw new Error("can't test without user");
        }
        const response: SuperTestResponse = await request(await app)
          .get("/v1/auth/me")
          .set("authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        const { id, email } = user;
        expect(response.body).toEqual(expect.objectContaining({ id, email }));
        done();
      });
      test("Should return unuthorized because is not a access token", async (done) => {
        const token = await generateToken(user.id, tokenTypes.REFRESH);
        if (!user) {
          throw new Error("can't test without user");
        }
        const response: SuperTestResponse = await request(await app)
          .get(`${APIvertion.V1}${V1Routes.AUTH}${AuthRoutes.ME}`)
          .set("authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        const { id, email } = user;
        done();
      });
    });
  });
  ///login
  describe("login route", () => {
    let conn;
    beforeAll(async () => {
      conn = await TestingConnection.Instance.conn;
    });

    test("login should return not authentique code is user doest'n exist", async (done) => {
      // dont want the user to know is the user exist or not.
      const nonExistentUser = {
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password(),
      };
      const response: SuperTestResponse = await request(await app)
        .post(`${APIvertion.V1}${V1Routes.AUTH}${AuthRoutes.LOGIN}`)
        .send(nonExistentUser)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(httpStatus.UNAUTHORIZED);
      done();
    });
    test("login should return bad request if data validation fail", async () => {
      // dont want the user to know is the user exist or not.

      const invalidUser = {
        email: "invalidMail",
        password: "tooshort",
      };
      const response: SuperTestResponse = await request(await app)
        .post(`${APIvertion.V1}${V1Routes.AUTH}${AuthRoutes.LOGIN}`)
        .send(invalidUser)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
//singup
describe("singup route", () => {
  let conn;
  beforeAll(async () => {
    conn = await TestingConnection.Instance.conn;
  });

  test("signup should return bad request if data validation fail", async () => {
    // dont want the user to know is the user exist or not.

    const invalidUser = {
      email: "invalidMail",
      password: "tooshort",
    };
    const response: SuperTestResponse = await request(await app)
      .post(`${APIvertion.V1}${V1Routes.AUTH}${AuthRoutes.SIGNUP}`)
      .send(invalidUser)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(httpStatus.BAD_REQUEST);
    expect(response.body).toEqual(
      expect.objectContaining(customApiErrors.wrongPassword)
    );
  });
});
