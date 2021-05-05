import bcrypt from "bcrypt";
export const hashPassword = (
  password: string,
  saltRounds: number = 10
): Promise<string> =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) {
        reject(err);
        return;
      }
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) {
          reject(err);
          return;
        }
        resolve(hash); // Store hash in hyour password DB.
      });
    });
  });
