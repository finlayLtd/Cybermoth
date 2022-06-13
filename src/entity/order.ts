import {
    BaseEntity,
    Column, Entity, ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    RelationId
} from "typeorm";
import { PostAddress } from "../models/postaddress";
import { User } from "./user";

export interface OrderProduct {
    vendorId: string;
    productId: string;
    productName: string;
    count: number;
    price: number;
    note: string;
}

// export interface Category {
//     default: OrderListCategory | null;
//     custom: string;
// }

export enum OrderCategory {
    bread = "bread",
    vegetables = "vegetables",
    fruits = "fruits",
    herbs = "herbs",
    seafood = "seafood",
    dairy = "dairy"
}

export enum OrderState {
    pending = "pending",
    approved = "approved",
    shipped = "shipped",
    delivered = "delivered"
}

@Entity()
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne((type) => User)
    customer: User | null;
    @RelationId((order: Order) => order.customer)
    customerId: string | null;

    @OneToMany((type) => SubOrder, (orderlist) => orderlist.order)
    subOrders: SubOrder[] | null;

    @Column("simple-json", { default: null })
    deliveryAddress: PostAddress;

    @Column({ nullable: true, type: "varchar", length: 100 })
    note: string | null;

    @Column({ nullable: true, type: "double" })
    price: number | null;

    @Column({ nullable: true, type: "double" })
    tip: number | null;

    @Column({ type: "enum", enum: OrderState, nullable: true })
    state: OrderState | null;

    // @CreateDateColumn()
    // created?: Date;

    // @UpdateDateColumn()
    // updated?: Date;

    // @DeleteDateColumn()
    // deleted?: Date;
}

@Entity()
export class SubOrder extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User)
    vendor: User | null;
    @RelationId((subOrder: SubOrder) => subOrder.vendor)
    vendorId: string | null;

    @ManyToOne(() => Order, (order) => order.subOrders)
    order: Order;
    @RelationId((subOrder: SubOrder) => subOrder.order)
    orderId: string | null;

    @Column({ nullable: true, type: "varchar", length: 20 })
    name: string | null;

    @Column({ nullable: true, type: "varchar", length: 100 })
    description: string | null;

    @Column({ nullable: true, type: "varchar", length: 20 })
    category: string | null;
    // category: Category | null;

    @Column("simple-json", { default: null })
    products: OrderProduct[] | null;

    @Column({ nullable: true, type: "int" })
    price: number | null;

    @Column({ type: "enum", enum: OrderState, nullable: true })
    state: OrderState | null;

    // @CreateDateColumn()
    // created?: Date;

    // @UpdateDateColumn()
    // updated?: Date;

    // @DeleteDateColumn()
    // deleted?: Date;
}
