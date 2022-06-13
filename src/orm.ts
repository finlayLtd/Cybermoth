import { ConnectionOptions, createConnection } from "typeorm";
import { Conf } from "./conf";

export function ormInit(conf: Conf["orm"]) {
    return createConnection({
        type: "mysql",
        host: "localhost",
        port: 3306,

        username: "root",
        password: "testpwd",
        database: "test",

        synchronize: true,

        logging: true,

        ...conf,

        // Can be 'local', 'Z', or an offset in the form '+HH:MM' or '-HH:MM'. (Default: local)
        timezone: "-02:00",

        entities: ["src/entity/**/*.ts"],
        migrations: ["migration/**/*.ts"],
        subscribers: ["subscriber/**/*.ts"],
        cli: {
            entitiesDir: "src/entity",
            migrationsDir: "migration",
            subscribersDir: "subscriber"
        }
    } as ConnectionOptions);
}
