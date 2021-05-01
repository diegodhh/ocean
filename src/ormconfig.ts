import { join } from "path";
import { ConnectionOptions } from "typeorm";
import config from "./config/config";
import { User } from "./entity/User";
const ormConfig: ConnectionOptions = {
  type: config.orm.type,
  ...(config.orm.databaseURL
    ? {
        url: config.orm.databaseURL,
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

export default ormConfig;
