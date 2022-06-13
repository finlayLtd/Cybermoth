import { getConnection } from "typeorm";
import { configInit } from "../config";
import { Product, ProductUnit } from "../entity/product";
import { ProductAllergen, ProductCategory } from "../entity/producttype";
import { User, UserRole } from "../entity/user";
import { ormInit } from "../orm";
import { ProductService } from "./product-service";

describe("ProductService", () => {

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

    let product: Product;

    test("ProductService.create", async () => {
        product = await ProductService.create(user.id, {
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
        });
        expect(product.name).toBe("product");
    });

    test("ProductService.update", async () => {
        const updateProduct = await ProductService.update(user.id, product.id, {
            name: "updatedProduct",
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
        });
        expect(updateProduct.name).toBe("updatedProduct");
    });

    test("ProductService.readVendorAll", async () => {
        const products = await ProductService.readVendorAll(user.id);
        expect(products.length).toBe(1);
        expect(products[0].name).toBe("updatedProduct");
    });

    test("ProductService.delete", async () => {
        const deleted = await ProductService.delete(user.id, product.id);
        expect(deleted.name).toBe("updatedProduct");
    });
});
