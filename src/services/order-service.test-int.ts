import { getConnection } from "typeorm";
import { configInit } from "../config";
import { Kistl } from "../entity/kistl";
import { Order, OrderState } from "../entity/order";
import { Product } from "../entity/product";
import { ProductCategory } from "../entity/producttype";
import { User, UserRole } from "../entity/user";
import { ormInit } from "../orm";
import { KistlService } from "./kistl-service";
import { OrderService } from "./order-service";
import { ProductService } from "./product-service";

describe("OrderService", () => {
    beforeAll(async () => {
        const conf = configInit();
        await ormInit(conf.orm);

        vendor = await User.create({
            username: "vendor",
            role: UserRole.vendor
        }).save();
        customer = await User.create({
            username: "customer",
            role: UserRole.customer
        }).save();
        product = await ProductService.create(vendor.id, {
            name: "KistlProduct",
            description: "KistlDesc",
            details: "details",
            category: ProductCategory.beverages
        });
        kistl = await KistlService.create(customer.id, {
            name: "Kistl",
            category: "category",
            description: "description",
            products: [
                {
                    vendorId: product.vendor.id,
                    productId: product.id,
                    productName: product.name,
                    count: 0,
                    price: 5,
                    note: "kistlnote"
                }
            ]
        });
        kistls = [kistl];
    });

    afterAll(async () => {
        await product.remove();
        await kistl.remove();
        await vendor.remove();
        await customer.remove();
        await getConnection().close();
    });

    let order: Order;
    let vendor: User;
    let customer: User;
    let product: Product;
    let kistl: Kistl;
    let kistlOrder: Order;
    let kistls: Kistl[] = [];

    test("OrderService.create", async () => {
        order = await OrderService.create(customer.id, {
            subOrders: [],
            deliveryAddress: null,
            note: "ItsOrder",
            tip: 0.0,
            state: OrderState.pending
        });
        expect(order.note).toBe("ItsOrder");
    });

    test("OrderService.update", async () => {
        order = await OrderService.update(customer.id, order.id, {
            subOrders: [],
            deliveryAddress: null,
            note: "updatedOrder",
            tip: 0.0,
            state: OrderState.delivered
        });
        expect(order.note).toBe("updatedOrder");
        expect(order.state).toBe(OrderState.delivered);
    });

    test("OrderService.subOrderAdd", async () => {
        const updatedOrder = await OrderService.subOrderAdd(
            vendor.id,
            order.id,
            {
                name: "SubOrder",
                description: "Add suborder",
                category: "category",
                products: [],
                price: 5.0,
                state: OrderState.pending
            }
        );
        expect(updatedOrder.subOrders.length).toBe(1);
        expect(updatedOrder.subOrders[0].name).toBe("SubOrder");
    });

    test("OrderService.createOrderFromKistls", async () => {
        kistlOrder = await OrderService.createOrderFromKistls(customer.id, kistls, {
            subOrders: [],
            deliveryAddress: null,
            note: "KistleOrder",
            tip: 0.0,
            state: OrderState.pending
        });
        expect(kistlOrder.note).toBe("KistleOrder");
    });


    test("OrderService.selectAll", async () => {
        const order = await OrderService.readAll(customer.id);
        expect(order.length).toBe(2);
    });

    test("OrderService.select", async () => {
        const selecOrder = await OrderService.read(customer.id, order.id);
        expect(selecOrder.note).toBe("updatedOrder");
    });

    test("OrderService.delete", async () => {
        const deletedOrder = await OrderService.delete(customer.id, order.id);
        expect(deletedOrder.note).toBe("updatedOrder");

        const deletedKistlOrder = await OrderService.delete(customer.id, kistlOrder.id);
        expect(deletedKistlOrder.note).toBe("KistleOrder");
    });
});
