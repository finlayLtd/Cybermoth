import { getConnection } from "typeorm";
import { configInit } from "../config";
import { User } from "../entity/user";
import { ormInit } from "../orm";

describe("Logic", () => {
    beforeAll(async () => {
        const conf = configInit();
        await ormInit(conf.orm);
    });

    afterAll(async () => {
        await getConnection().close();
    });

    test("TypeORM", async () => {
        const user = await User.count();
        expect(user).toBe(0);
    });
});
