import { TestingConnection } from "./ConnectionInstance";

describe("is a singleton should return always  the same istance", () => {
  test("firstcall and second call should be exactly te same of object", async (done) => {
    const firstCall = TestingConnection.Instance;
    const firstConn = await firstCall.conn;
    const secondCall = TestingConnection.Instance;
    const secondConn = await secondCall.conn;
    expect(firstCall).toBe(secondCall);
    expect(firstConn).toBe(secondConn);
    done();
  });
});
