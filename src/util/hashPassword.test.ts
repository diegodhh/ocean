import bcrypt from "bcrypt";
import faker from "faker";
import { hashPassword } from "./hashPassword";

describe("hashPassword util unit testing", () => {
  test("should fail is the password doesn't match", async (done) => {
    const password1 = faker.internet.password();

    const password2 = faker.internet.password();
    const hash = await hashPassword(password1);
    const match = await bcrypt.compare(password2, hash);
    expect(match).toBe(false);
    done();
  });
  test("should succed if password mathc", async (done) => {
    const password1 = faker.internet.password();

    const hash = await hashPassword(password1);
    const match = await bcrypt.compare(password1, hash);
    expect(match).toBe(true);
    done();
  });
});
