import { Kistl, KistlProduct } from "../entity/kistl";
import { Order, OrderProduct, OrderState, SubOrder } from "../entity/order";
import { User, UserRole } from "../entity/user";
import { PostAddress } from "../models/postaddress";

export interface OrderAttrs {
    subOrders: SubOrder[];
    deliveryAddress: PostAddress;
    note: string;
    tip: number;
    state: OrderState;
}

export interface SubOrderAttrs {
    name: string;
    description: string;
    category: string;
    products: OrderProduct[];
    price: number;
    state: OrderState;
}

export class OrderService {
    static async readAll(customerId: string): Promise<Order[]> {
        const customer = await User.findOne({where: { id: customerId, role: UserRole.customer }});
        if (customer) {
            return await Order.find({
                relations: ["subOrders"],
                where: { customer: customer.id }
            });
        } else {
            throw new Error("No such customer");
        }
    }

    static async read(customerId: string, orderId: string): Promise<Order> {
        const customer = await User.findOne({ where: { id: customerId, role: UserRole.customer }});
        if (customer) {
            return await Order.findOne({
                relations: ["subOrders"],
                where: { id: orderId, customer: { id: customer.id } }
            });
        } else {
            throw new Error("No such customer");
        }
    }

    static async create(
        customerId: string,
        orderCreate: OrderAttrs
    ): Promise<Order> {
        const customer = await User.findOne({
            where: { id: customerId, role: UserRole.customer }
        });
        if (customer) {
            const o = Order.create({
                customer: customer,
                subOrders: orderCreate.subOrders,
                deliveryAddress: orderCreate.deliveryAddress,
                note: orderCreate.note,
                price: orderCreate.subOrders.reduce<number>(
                    (p, c) => p + c.price,
                    0
                ),
                tip: orderCreate.tip,
                state: OrderState.pending
            });
            return await o.save();
        } else {
            throw new Error("No such customer");
        }
    }

    static async update(
        customerId: string,
        orderId: string,
        updatedOrder: OrderAttrs
    ): Promise<Order> {
        const customer = await User.findOne({
            where: { id: customerId, role: UserRole.customer }
        });
        if (customer) {
            const order = await Order.findOne({
                where: { id: orderId, customer: { id: customer.id } }
            });
            if (order) {
                Order.merge(order, {
                    subOrders: updatedOrder.subOrders,
                    deliveryAddress: updatedOrder.deliveryAddress,
                    note: updatedOrder.note,
                    price: updatedOrder.subOrders.reduce<number>(
                        (p, c) => p + c.price,
                        0
                    ),
                    tip: updatedOrder.tip,
                    state: updatedOrder.state
                });
                return await order.save();
            } else {
                throw new Error("Order doesnt exist");
            }
        } else {
            throw new Error("No such customer");
        }
    }

    static async delete(customerId: string, orderId: string): Promise<Order> {
        const customer = await User.findOne({
            where: { id: customerId, role: UserRole.customer }
        });
        if (customer) {
            const order = await Order.findOne({
                relations: ["subOrders"],
                where: { id: orderId, customer: { id: customer.id } }
            });
            if (order) {
                try {
                    await SubOrder.remove(order.subOrders || []);
                } catch (error) {
                    throw new Error("error suborder");
                }
                try {
                    return await order.remove();
                } catch (error) {
                    throw new Error(error.toString());
                }
            } else {
                throw new Error("No such order");
            }
        } else {
            throw new Error("No such customer");
        }
    }

    static async subOrderAdd(
        vendorId: string,
        orderId: string,
        subOrderAttrs: SubOrderAttrs
    ): Promise<Order> {
        const vendor = await User.findOne({ where: { id: vendorId }});
        if (!vendor) {
            throw new Error("No such vendor");
        }
        let order = await Order.findOne({
            relations: ["subOrders"],
            where: { id: orderId }
        });
        if (!order) {
            throw new Error("No such order");
        }
        const subOrder = SubOrder.create(subOrderAttrs);
        subOrder.vendor = vendor;
        subOrder.order = order;
        await subOrder.save();

        order.subOrders.push(subOrder);
        await order.save();
        return order;
    }

    static async subOrderRemove(
        orderId: string,
        subOrderId: string
    ): Promise<SubOrder> {
        const order = await Order.findOne({ where: { id: orderId }});
        if (!order) {
            throw new Error("No such order");
        }
        const subOrder = await SubOrder.findOne({ where: { id: subOrderId, order: { id: orderId } }});
        if (!subOrder) {
            throw new Error("No such suborder");
        }
        return await subOrder.remove();
    }

    static async createOrderFromKistls(
        customerId: string,
        kistls: Kistl[],
        orderAttrs: OrderAttrs
    ): Promise<Order> {
        const customer = await User.findOne({ where: { id: customerId, role: UserRole.customer }});
        if (!customer) {
            throw new Error("No such customer");
        }

        const order = await OrderService.create(customerId, orderAttrs);

        for (const kistl of kistls) {
            const vendorProducts = kistl.products.reduce<Map<string, KistlProduct[]>>((prev, kistlProduct, _) => {
                const prevProducts = prev.get(kistlProduct.vendorId) || [] ;
                prevProducts.push(kistlProduct);
                prev.set(kistlProduct.vendorId, prevProducts);
                return prev;
            }, new Map<string, KistlProduct[]>());


            for (const vendorId in vendorProducts.keys()) {
                const kistlProducts = vendorProducts.get(vendorId);
                await OrderService.subOrderAdd(vendorId, order.id, {
                    name: kistl.name,
                    description: kistl.description,
                    category: kistl.category,
                    products: kistlProducts.map<OrderProduct>((kistlProduct) => kistlProduct),
                    price: kistlProducts.reduce<number>((some, product, _) => some + product.price, 0),
                    state: OrderState.pending
                });
            }
        }

        return order;
    }
}
