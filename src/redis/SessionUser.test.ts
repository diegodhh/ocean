import { tokenTypes } from "../types/tokens";
import { client } from "./../app";
import { JWTPayload } from "./../types/JWTPayload";
import { SessionUser } from "./SessionUser";

describe("unit test SessionUser", () => {
  test("should set refresh token key correctrly", async () => {
    const sessionUser = new SessionUser(client, "userId2");

    const mockRefreshToken = "sdfsdfsdfsdfsdfsdfsd";

    await sessionUser.set({ refreshToken: mockRefreshToken });

    expect((await sessionUser.values)?.refreshToken).toBe(mockRefreshToken);
  });
  test("should check is token existe", async () => {
    const sessionUser2 = new SessionUser(client, "userId3");
    const mockRefreshToken = "sdfsdfsdfsdfsdfsdfsd";

    await sessionUser2.set({ refreshToken: mockRefreshToken });
    expect(
      await sessionUser2.isTokenWhisteListed(mockRefreshToken)
    ).toBeTruthy();
  });
  test("should check is token existe", async () => {
    const sessionUser3 = new SessionUser(client, "userId3");
    const mockRefreshToken = "sdfsdfsdfsdfsdfsdfsd";

    expect(await sessionUser3.isTokenWhisteListed(mockRefreshToken)).toBeFalsy;
  });
  test("should delete key", async () => {
    const sessionUser = new SessionUser(client, "userId4");
    const mockRefreshToken = "sdfsdfsdfsdfsdfsdfsd";
    const payload: JWTPayload = {
      sub: "userid",
      iat: 123245,
      type: tokenTypes.REFRESH,
      exp: 121345,
    };
    await sessionUser.set({ refreshToken: mockRefreshToken, payload });
    await sessionUser.delete(["refreshToken"]);
    const values = await sessionUser.values;
    expect(values?.refreshToken).toBeUndefined();
  });
  test("should return client", async () => {
    const sessionUser = new SessionUser(client, "userId4");
    expect(sessionUser.client).toEqual(client);
  });
});
