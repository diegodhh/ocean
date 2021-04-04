import { join } from "path";
import { ConnectionOptions } from "typeorm";
import { User } from "./entity/User";
console.log(process.env.DATABASE_URL);
const config: ConnectionOptions = {
  type: "postgres",
  ...(process.env.DATABASE_URL
    ? {
        url: process.env.DATABASE_URL,
        ssl: true,
        logging: false,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }
    : {
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "Secreta1234abcd",
        database: "ships-test",
        logging: true,
      }),
  entities: [User],

  synchronize: false,
  dropSchema: false,
  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: true,
  migrations: [join(__dirname, "/migrations/*{.ts,.js}")],
  cli: {
    migrationsDir: "src/migrations",
  },
};

export default config;
