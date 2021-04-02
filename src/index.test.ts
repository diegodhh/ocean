import { Server } from "node:http";
import app from "./index";

const PORT = 5000;
let server: Server | null;
const request = require("supertest");
describe("this is a test", () => {
  test("first1", () => {
    expect(1).toBe(1);
  });

  test("first1", () => {
    expect(8).toBe(8);
  });
});
beforeAll(async (done) => {
  server = await (await app).listen(PORT);
  console.log("before");

  done();
});
afterAll(() => {
  server?.close();
});

describe("Test the root path", () => {
  test("It should response the GET method", async (done) => {
    console.log("test");
    request(await app)
      .get("/")
      .then((response: Response) => {
        expect(response.status).toBe(200);

        expect(response.text).toEqual(expect.stringMatching("Hello World"));
        done();
      });
  });
});

describe("test google auth", () => {
  test("It should redirect to google auth2", async (done) => {
    console.log("test");
    request(await app)
      .get("/google")
      .then((response: Response) => {
        expect(response.status).toBe(302); //found
        expect((response.headers as any).location).toEqual(
          expect.stringMatching("https://accounts.google.com/o/oauth2")
        );
        done();
      });
  });
  test("It should redirect to something", async (done) => {
    console.log("test");
    request(await app)
      .get("/google/callback")
      .then((response: Response) => {
        expect(response.status).toBe(302); //found
        done();
      });
  });
  test("It should return 200 when call sucess", async (done) => {
    console.log("test");
    request(await app)
      .get("/google/success")
      .then((response: Response) => {
        expect(response.status).toBe(200); //found
        done();
      });
  });
  test("It should return 200 when failed", async (done) => {
    console.log("test");
    request(await app)
      .get("/google/failure")
      .then((response: Response) => {
        expect(response.status).toBe(200); //found
        done();
      });
  });
});
