import { getConnection } from "typeorm";
import { configInit } from "../config";
import { ProductAllergen, ProductCategory, ProductType } from "../entity/producttype";
import { User, UserRole } from "../entity/user";
import { ormInit } from "../orm";
import { ProductTypeService } from "./producttype-service";

describe("ProductTypeService", () => {

    let user: User;

    beforeAll(async () => {
        const conf = configInit();
        await ormInit(conf.orm);
        user = await User.create({
            username: "test",
            role: UserRole.vendor
        }).save();
    });

    afterAll(async () => {
        await user.remove();
        await getConnection().close();
    });

    let productType: ProductType;

    test("ProductTypeService.create", async () => {
        productType = await ProductTypeService.create(user.id, {
            name: "type1",
            description: "description",
            details: "details",
            category: ProductCategory.bread,
            allergens: [ProductAllergen.milk, ProductAllergen.soybean],
            bio: true,
            gmo: false,
            tax: 8,
            productionTime: 5
        });
        expect(productType.name).toBe("type1");
        expect(productType.allergens.length).toBe(2);
    });

    test("ProductTypeService.update", async () => {
        const updatedProductType = await ProductTypeService.update(user.id, productType.id, {
            name: "type2",
            description: "description",
            details: "details",
            category: ProductCategory.bread,
            allergens: [ProductAllergen.milk, ProductAllergen.soybean],
            bio: true,
            gmo: false,
            tax: 8,
            productionTime: 5
        });
        expect(updatedProductType.name).toBe("type2");
    });

    test("ProductTypeService.selectAll", async () => {
        const productTypes = await ProductTypeService.readAll(user.id);
        expect(productTypes.length).toBe(1);
        expect(productTypes[0].name).toBe("type2");
    });

    test("ProductTypeService.delete", async () => {
        const deleted = await ProductTypeService.delete(user.id, productType.id);
        expect(deleted.name).toBe("type2");
    });
});
