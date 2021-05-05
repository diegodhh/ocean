import app from "../../app";

const PORT = 5000;
const request = require("supertest");

describe("Test the root path", () => {
  test("It should response the GET method", async (done) => {
    request(await app)
      .get("/")
      .then((response: Response) => {
        expect(response.status).toBe(200);

        expect(response.text).toEqual(expect.stringMatching("Hello World"));
        done();
      });
  });
  // test("It should return not found error", async (done) => {
  //   request(await app)
  //     .get("/not-suported-route-string")
  //     .then((response: Response) => {
  //       expect(httpStatus.NOT_FOUND).toBe(404);
  //       expect(response.status).toBe(httpStatus.NOT_FOUND);

  //       done();
  //     });
  // });
});
const juan = new Error();
