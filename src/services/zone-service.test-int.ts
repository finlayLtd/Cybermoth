import { getConnection } from "typeorm";
import { configInit } from "../config";
import { Product, ProductUnit } from "../entity/product";
import { ProductAllergen, ProductCategory } from "../entity/producttype";
import { User, UserRole } from "../entity/user";
import { Zone } from "../entity/zone";
import { ormInit } from "../orm";
import { ZoneService } from "./zone-service";

describe("ZoneService", () => {

    let vendor: User;
    let product: Product;

    beforeAll(async () => {
        const conf = configInit();
        await ormInit(conf.orm);
        vendor = await User.create({
            username: "jin",
            role: UserRole.vendor
        }).save();
        product = await Product.create({
            vendor,
            name: "product",
            description: "description",
            details: "details",
            category: ProductCategory.beverages,
            allergens: [ProductAllergen.celery],
            bio: true,
            gmo: false,
            tax: 8,
            productionTime: 5,

            amount: 5,
            unit: ProductUnit.kilogram,
            price: 100,
            min: 1,
            max: 10
        }).save();

    });

    afterAll(async () => {
        await product.remove();
        await vendor.remove();
        await getConnection().close();
    });

    let zone: Zone;

    test("ZoneService.create", async () => {
        zone = await ZoneService.create(vendor.id, {
            title: "test",
            postCode: "123456",
            deliverWeekDay: 1,
            deliverTimeFrom: 2,
            deliverTimeTo: 3,
            fee: 3,
            min: 3
        });
        expect(zone.title).toBe("test");
        expect(zone.products.length).toBe(0);

        zone = await ZoneService.productAdd(vendor.id, zone.id, product.id);
        expect(zone.products.length).toBe(1);

        zone = await ZoneService.productRemove(vendor.id, zone.id, product.id);
        expect(zone.products.length).toBe(0);
    });

    test("ZoneService.update", async () => {
        const updatedZone = await ZoneService.update(vendor.id, zone.id, {
            title: "updatedTest",
            postCode: "123456",
            deliverWeekDay: 1,
            deliverTimeFrom: 2,
            deliverTimeTo: 3,
            fee: 3,
            min: 3
        });
        expect(updatedZone.title).toBe("updatedTest");
    });

    test("ZoneService.readAll", async () => {
        const zones = await ZoneService.readAll(vendor.id);
        expect(zones.length).toBe(1);
        expect(zones[0].title).toBe("updatedTest");
    });

    test("ZoneService.read", async () => {
        const zones = await ZoneService.read("123456");
        // console.log(zones);

        expect(zones.length).toBe(1);
        // expect(zones).toBe("updatedTest");
    });

    test("ZoneService.delete", async () => {
        const deleted = await ZoneService.delete(vendor.id, zone.id);
        expect(deleted.title).toBe("updatedTest");
    });

});
