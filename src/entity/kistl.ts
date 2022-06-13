import {
    BaseEntity,
    Column,
    Entity, ManyToOne,
    PrimaryGeneratedColumn,
    RelationId
} from "typeorm";
import { User } from "./user";

export interface KistlProduct {
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

// export enum OrderListCategory {
//     bread = "bread",
//     vegetables = "vegetables",
//     fruits = "fruits",
//     herbs = "herbs",
//     seafood = "seafood",
//     dairy = "dairy"
// }

@Entity()
export class Kistl extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne((type) => User)
    customer: User | null;
    @RelationId((kistl: Kistl) => kistl.customer)
    customerId: string | null;

    @Column({ nullable: true, type: "varchar", length: 20 })
    name: string | null;

    @Column({ nullable: true, type: "varchar", length: 100 })
    description: string | null;

    @Column({ nullable: true, type: "varchar", length: 20 })
    category: string | null;
    // category: Category | null;

    @Column("simple-json", { default: null })
    products: KistlProduct[] | null;

    @Column({ nullable: true, type: "int" })
    price: number | null;

    // @CreateDateColumn()
    // created?: Date;

    // @UpdateDateColumn()
    // updated?: Date;

    // @DeleteDateColumn()
    // deleted?: Date;
}
