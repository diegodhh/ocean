import { join } from "path";
import { ConnectionOptions } from "typeorm";
import { User } from "./entity/User";

export default {
  type: "postgres",
  ...(process.env.DATABASE_URL
    ? { url: process.env.DATABASE_URL }
    : {
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "Secreta1234abcd",
        database: "ships-test",
      }),
  entities: [User],
  logging: true,
  synchronize: false,
  dropSchema: false,
  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: true,
  migrations: [join(__dirname, "/migrations/*{.ts,.js}")],
  cli: {
    migrationsDir: "src/migrations",
  },
} as ConnectionOptions;
