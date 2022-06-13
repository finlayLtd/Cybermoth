import { getConnection } from "typeorm";
import { configInit } from "../config";
import { Kistl } from "../entity/kistl";
import { User, UserRole } from "../entity/user";
import { ormInit } from "../orm";
import { KistlService } from "./kistl-service";

describe("KistlService", () => {

    let user: User;

    beforeAll(async () => {
        const conf = configInit();
        await ormInit(conf.orm);

        user = await User.create({
            username: "test",
            role: UserRole.customer
        }).save();
    });

    afterAll(async () => {
        await user.remove();
        await getConnection().close();
    });

    let kistl: Kistl;

    test("KistlService.create", async () => {
        kistl = await KistlService.create(user.id, {
            name: "Kistl1",
            category: null,
            description: "Description",
            products: []
        });
        expect(kistl.name).toBe("Kistl1");
    });

    test("KistlService.update", async () => {
        const updatedKistl = await KistlService.update(user.id, kistl.id, {
            name: "Kistl2",
            category: null,
            description: "Description",
            products: []
        });
        expect(updatedKistl.name).toBe("Kistl2");
    });

    test("KistlService.selectAll", async () => {
        const selectedKistl = await KistlService.readAll(user.id);
        expect(selectedKistl.length).toBe(1);
        expect(selectedKistl[0].name).toBe("Kistl2");
    });

    test("KistlService.kistl", async () => {
        const readKistl = await KistlService.readById(user.id, kistl.id);
        expect(readKistl.description).toBe("Description");
    });

    test("KistlService.delete", async () => {
        const deleted = await KistlService.delete(user.id, kistl.id);
        expect(deleted.name).toBe("Kistl2");
    });

});
