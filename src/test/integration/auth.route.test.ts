import faker from "faker";
import httpStatus from "http-status";
import Joi from "joi";
import jwt from "jsonwebtoken";
import request from "supertest";
import { Connection } from "typeorm";
import app, { client } from "../../app";
import config from "../../config/config";
import { APIvertion } from "../../types/api";
import { AuthRoutes, V1Routes } from "../../types/api/v1";
import { CustomApiErrors, ErrorApiResponse } from "../../types/errors";
import { JWTPayload } from "../../types/JWTPayload";
import { tokenTypes } from "../../types/tokens";
import { hashPassword } from "../../util/hashPassword";
import { User } from "./../../entity/User";
import "./../../jestUtils/customMatchers";
import { SessionUser } from "./../../redis/SessionUser";
import { LoginSuccess } from "./../../routes/v1/auth.routes";
import { generateToken } from "./../../services/token.service";
import { RefreshTokenBody } from "./../../types/joi-interfaces/auth.schemas";
import { TestingConnection } from "./ConnectionInstance";
describe("auth rout", () => {
  test("It should response the GET method", async (done) => {
    request(await app)
      .get("/")
      .then((response) => {
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
      .then((response) => {
        expect(response.status).toBe(302); //found
        expect(response.headers.location).toEqual(
          expect.stringMatching("https://accounts.google.com/o/oauth2")
        );
        done();
      });
  });
  test("It should redirect to something", async (done) => {
    request(await app)
      .get("/v1/auth/google/callback")
      .then((response) => {
        expect(response.status).toBe(302); //found
        done();
      });
  });

  test("It should return 200 when failed", async (done) => {
    request(await app)
      .get("/v1/auth/google/failure")
      .then((response) => {
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
        .then((response) => {
          expect(response.status).toBe(httpStatus.UNAUTHORIZED); //foundd21212
          done();
        });
    });
    test("should return unautorized", async (done) => {
      request(await app)
        .get("/v1/auth/me")
        .set("authorization", "token 1234567890")
        .then((response) => {
          expect(response.status).toBe(httpStatus.UNAUTHORIZED); //foundd21212
          done();
        });
    });
    test("Should return unautorized", async (done) => {
      request(await app)
        .get("/v1/auth/me")
        .set("Authorization", "Bearer 1234567890")
        .then((response) => {
          expect(response.status).toBe(httpStatus.UNAUTHORIZED); //foundd21212
          done();
        });
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
    test("Should return authorized and object containing new user id ", async (done) => {
      const token = await generateToken(user.id, tokenTypes.ACCESS);
      if (!user) {
        throw new Error("can't test without user");
      }
      const response = await request(await app)
        .get("/v1/auth/me")
        .set("authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      const { id } = user;
      expect(response.body).toEqual(expect.objectContaining({ id }));
      done();
    });
    test("Should return unuthorized because is not a access token", async (done) => {
      const token = await generateToken(user.id, tokenTypes.REFRESH);
      if (!user) {
        throw new Error("can't test without user");
      }
      const response = await request(await app)
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
  beforeAll(async (done) => {
    conn = await TestingConnection.Instance.conn;
    done();
  });

  test("login should return not authentique code is user doest'n exist", async (done) => {
    // dont want the user to know is the user exist or not.
    const nonExistentUser = {
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
    };
    const response = await request(await app)
      .post(`${APIvertion.V1}${V1Routes.AUTH}${AuthRoutes.LOGIN}`)
      .send(nonExistentUser)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(httpStatus.UNAUTHORIZED);

    expect((response.body as ErrorApiResponse).customErrorCodes).toEqual(
      expect.arrayContaining([CustomApiErrors.USER_NOT_EXIST])
    );
    done();
  });
  test("login should return bad request if data validation fail", async () => {
    // dont want the user to know is the user exist or not.

    const invalidUser = {
      email: faker.internet.email(),
      password: "tooshort",
    };
    const response = await request(await app)
      .post(`${APIvertion.V1}${V1Routes.AUTH}${AuthRoutes.LOGIN}`)
      .send(invalidUser)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(httpStatus.BAD_REQUEST);
    expect((response.body as ErrorApiResponse).customErrorCodes).toEqual(
      expect.arrayContaining([CustomApiErrors.PASSWORD_TOO_SHORT])
    );
  });
  test("should return Unautorized is user exist but the password is incorrect", async (done) => {
    const userData = {
      firstName: faker.name.firstName(),
      email: faker.internet.email().toLowerCase(),
      lastName: faker.name.lastName(),
      phone: faker.phone.phoneNumber(),
      password: faker.internet.password(),
    };
    const existingUser = await User.create(userData).save();
    const notThePassword = {
      email: existingUser.email,
      password: "NotThePassword1234",
    };
    const response = await request(await app)
      .post(`${APIvertion.V1}${V1Routes.AUTH}${AuthRoutes.LOGIN}`)
      .send(notThePassword)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(httpStatus.UNAUTHORIZED);
    expect((response.body as ErrorApiResponse).customErrorCodes).toEqual(
      expect.arrayContaining([CustomApiErrors.INCORRECT_EMAIL_OR_PASSWORD])
    );

    await User.delete({ id: existingUser.id });
    done();
  });
  test("should return Unautorized is user does not have password and the respective custom errror code", async (done) => {
    const userData = {
      firstName: faker.name.firstName(),
      email: faker.internet.email().toLowerCase(),
      lastName: faker.name.lastName(),
      phone: faker.phone.phoneNumber(),
    };

    const existingUser = await User.create(userData).save();
    const notThePassword = {
      email: existingUser.email,
      password: "NotThePassword1234",
    };
    const response = await request(await app)
      .post(`${APIvertion.V1}${V1Routes.AUTH}${AuthRoutes.LOGIN}`)
      .send(notThePassword)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(httpStatus.UNAUTHORIZED);
    expect((response.body as ErrorApiResponse).customErrorCodes).toEqual(
      expect.arrayContaining([CustomApiErrors.USER_DOES_NOT_HAVE_PASSWORD])
    );

    await User.delete({ id: existingUser.id });
    done();
  });

  test("should return OK status code 200 and shoul return refresh token and hash token", async (done) => {
    let hash: string;

    const userData = {
      firstName: faker.name.firstName(),
      email: faker.internet.email().toLowerCase(),
      lastName: faker.name.lastName(),
      phone: faker.phone.phoneNumber(),
      password: faker.internet.password(),
    };

    hash = await hashPassword(userData.password);
    const existingUser = await User.create({
      ...userData,
      ...{ password: hash },
    }).save();
    const notThePassword = {
      email: existingUser.email,
      password: userData.password,
    };
    const response = await request(await app)
      .post(`${APIvertion.V1}${V1Routes.AUTH}${AuthRoutes.LOGIN}`)
      .send(notThePassword)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(httpStatus.OK);
    // expect((response.body as ErrorApiResponse).customErrorCodes).toEqual(
    //   expect.arrayContaining([CustomApiErrors.USER_DOES_NOT_HAVE_PASSWORD])
    // );

    expect(response.body).toMatchObject(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      } as LoginSuccess)
    );

    //// checking access token
    const { refreshToken, accessToken }: LoginSuccess = response.body;
    await checkToken(refreshToken, existingUser, tokenTypes.REFRESH);

    await checkToken(accessToken, existingUser, tokenTypes.ACCESS);
    await User.delete({ id: existingUser.id });

    const sessionUser = new SessionUser(client, existingUser.id);
    const sessionData = await sessionUser.values;
    expect(sessionData?.refreshToken).toBe(
      (response.body as LoginSuccess).refreshToken
    );
    sessionUser.client.del(existingUser.id);
    done();
  });
  //todo test user login succesfully.
});

describe(`${AuthRoutes.SIGNUP} test`, () => {
  let conn;
  beforeAll(async (done) => {
    conn = await TestingConnection.Instance.conn;
    done();
  });

  test(`${AuthRoutes.SIGNUP} should return bad request if data validation fail`, async () => {
    // dont want the user to know is the user exist or not.
    const invalidUser = {
      email: "sdfsdfds",
      password: faker.internet.password(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: Joi.number,
    };
    const response = await request(await app)
      .post(`${APIvertion.V1}${V1Routes.AUTH}${AuthRoutes.SIGNUP}`)
      .send(invalidUser)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(httpStatus.BAD_REQUEST);
    expect((response.body as ErrorApiResponse).customErrorCodes).toEqual(
      expect.arrayContaining([CustomApiErrors.DEFAULT_VALIDATION_ERROR])
    );
  });

  test(`${AuthRoutes.SIGNUP} should respond bad request if user already exist`, async (done) => {
    // dont want the user to know is the user exist or not.

    const userData = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: faker.phone.phoneNumber(),
    };

    const existingUser = await User.create(userData).save();
    const response = await request(await app)
      .post(`${APIvertion.V1}${V1Routes.AUTH}${AuthRoutes.SIGNUP}`)
      .send(userData)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(httpStatus.BAD_REQUEST);
    expect((response.body as ErrorApiResponse).customErrorCodes).toEqual(
      expect.arrayContaining([CustomApiErrors.USER_ALREADY_EXIST])
    );
    await User.delete({ id: existingUser.id });
    done();
  });
  //todo test user login succesfully.
  test(`${AuthRoutes.SIGNUP} should create a new user if validation is correct`, async (done) => {
    // dont want the user to know is the user exist or not.

    const userData = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: faker.phone.phoneNumber(),
    };

    const response = await request(await app)
      .post(`${APIvertion.V1}${V1Routes.AUTH}${AuthRoutes.SIGNUP}`)
      .send(userData)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(httpStatus.OK);
    const createdUser = await User.findOne({ email: userData.email });
    expect(createdUser).not.toBeUndefined();

    expect(response.body as ErrorApiResponse).toEqual(
      expect.objectContaining({ user: createdUser })
    );
    createdUser && (await User.delete({ id: createdUser.id }));

    done();
  });
});

const checkToken = async (
  token: string,
  user: User,
  expectedType: tokenTypes
): Promise<object> => {
  const expectedPayload: Partial<JWTPayload> = {
    sub: user.id,
    type: expectedType,
  };
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) throw new Error("jwt decoded fail");
      err && reject(err);
      expect(decoded).toEqual(expect.objectContaining(expectedPayload));
      resolve(decoded!);
    });
  });
};

describe(`${AuthRoutes.REFRESH_TOKEN} test`, () => {
  let conn;
  beforeAll(async (done) => {
    conn = await TestingConnection.Instance.conn;
    done();
  });

  test(`${AuthRoutes.REFRESH_TOKEN} if body has wrong format`, async () => {
    // dont want the user to know is the user exist or not.
    const body = {
      invalidkey: "invalidad token",
    };
    const response = await request(await app)
      .post(`${APIvertion.V1}${V1Routes.AUTH}${AuthRoutes.REFRESH_TOKEN}`)
      .send(body)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(httpStatus.BAD_REQUEST);
  });
  test(`${AuthRoutes.REFRESH_TOKEN} should return unauthorized if refresh token es invalidad`, async () => {
    // dont want the user to know is the user exist or not.
    const req: RefreshTokenBody = {
      body: {
        refreshToken: "invalidad token",
      },
    };
    const response = await request(await app)
      .post(`${APIvertion.V1}${V1Routes.AUTH}${AuthRoutes.REFRESH_TOKEN}`)
      .send(req.body)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(httpStatus.UNAUTHORIZED);
    expect((response.body as ErrorApiResponse).customErrorCodes).toEqual(
      expect.arrayContaining([CustomApiErrors.INVALID_TOKEN])
    );
  });
  test(`${AuthRoutes.REFRESH_TOKEN} should return unathorized if refresh token es valid but is not is not white listed, and also delete the white list (is posible that refresh token have been stolen)`, async (done) => {
    // dont want the user to know is the user exist or not.

    const userData = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: faker.phone.phoneNumber(),
    };
    const newUser = await User.create(userData).save();
    const refreshToken = await generateToken(newUser.id, tokenTypes.REFRESH);

    const sessionUser = new SessionUser(client, newUser.id);
    await sessionUser.set({ refreshToken: "old token" });
    const req: RefreshTokenBody = {
      body: {
        refreshToken,
      },
    };
    const response = await request(await app)
      .post(`${APIvertion.V1}${V1Routes.AUTH}${AuthRoutes.REFRESH_TOKEN}`)
      .send(req.body)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(httpStatus.UNAUTHORIZED);
    expect((response.body as ErrorApiResponse).customErrorCodes).toEqual(
      expect.arrayContaining([CustomApiErrors.INVALID_TOKEN])
    );
    expect((await sessionUser.values)?.refreshToken).toBeUndefined();
    await User.delete({ id: newUser.id });

    sessionUser.client.del(newUser.id);
    done();
  });
  test(`${AuthRoutes.REFRESH_TOKEN} shoul return ok if token is whitelisted, return new tokens, and update the new refresh token`, async () => {
    // dont want the user to know is the user exist or not.

    const userData = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: faker.phone.phoneNumber(),
    };
    const newUser = await User.create(userData).save();
    const refreshToken = await generateToken(newUser.id, tokenTypes.REFRESH);
    const session = new SessionUser(client, newUser.id);
    await session.set({ refreshToken });
    expect(await session.values).toEqual(
      expect.objectContaining({ refreshToken })
    );
    const req: RefreshTokenBody = {
      body: {
        refreshToken,
      },
    };
    const response = await request(await app)
      .post(`${APIvertion.V1}${V1Routes.AUTH}${AuthRoutes.REFRESH_TOKEN}`)
      .send(req.body)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(httpStatus.OK);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      } as LoginSuccess)
    );
    const sessionData = await session.values;
    expect(sessionData?.refreshToken).toBe(
      (response.body as LoginSuccess).refreshToken
    );
    await User.delete({ id: newUser.id });
    session.client.del(newUser.id);
  });
});
//singup
// describe("singup route", () => {
//   let conn;
//   beforeAll(async () => {
//     conn = await TestingConnection.Instance.conn;
//   });

//   test("signup should return bad request if data validation fail", async () => {
//     // dont want the user to know is the user exist or not.

//     const invalidUser = {
//       email: "invalidMail",
//       password: "tooshort",
//     };
//     const response: SuperTestResponse = await request(await app)
//       .post(`${APIvertion.V1}${V1Routes.AUTH}${AuthRoutes.SIGNUP}`)
//       .send(invalidUser)
//       .set("Accept", "application/json")
//       .expect("Content-Type", /json/)
//       .expect(httpStatus.BAD_REQUEST);
//     expect(response.body).toEqual(
//       expect.objectContaining(customApiErrors.wrongPassword)
//     );
//   });
// });
