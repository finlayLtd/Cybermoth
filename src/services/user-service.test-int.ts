import { getConnection } from "typeorm";
import { configInit } from "../config";
import { User, UserRole } from "../entity/user";
import { ormInit } from "../orm";
import { UserService } from "./user-service";

describe("UserService", () => {
    beforeAll(async () => {
        const conf = configInit();
        await ormInit(conf.orm);
    });

    afterAll(async () => {
        await getConnection().close();
    });

    let user: User;

    test("UserService.create", async () => {
        user = await UserService.create({
            username: "Username",
            nameFirst: "name",
            nameLast: "Last",
            email: "email@xyz.com",
            phone: "9876536789",
            role: UserRole.customer
        });
        expect(user.email).toBe("email@xyz.com");
    });

    test("UserService.update", async () => {
        user = await UserService.update(user.id, {
            username: "Username",
            nameFirst: "name22",
            nameLast: "Last22",
            email: "email@xyz.com",
            phone: "9876536789",
            role: UserRole.customer
        });
        expect(user.nameFirst).toBe("name22");
    });

    test("UserService.readAll", async () => {
        const users = await UserService.readAll();
        expect(users.length).toBe(1);
    });

    test("UserService.selectUsername", async () => {
        const selectedUser = await UserService.readByUsername(user.username);
        expect(selectedUser.username).toBe(user.username);
        expect(selectedUser.email).toBe(user.email);
    });

    test("UserService.delete", async () => {
        const deletedUser = await UserService.delete(user.id);
        expect(deletedUser.username).toBe("Username");
    });
});
