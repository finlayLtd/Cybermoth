import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId
} from "typeorm";
import {
    Days, ProductAllergen, ProductCategory
} from "./producttype";
import { User } from "./user";

export enum ProductUnit {
    kilogram = "kilogram",
    mikrometer = "mikrometer"
}

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne((type) => User)
    vendor: User | null;
    @RelationId((productEntity: Product) => productEntity.vendor)
    vendorId: string | null;

    // @ManyToOne((type) => ProductType)
    // type: ProductType | null;
    // @RelationId((productEntity: Product) => productEntity.type)
    // productId: string | null;

    // ProductType attributes

    @Column({ nullable: true, type: "varchar", length: 40 })
    productId: string | null;

    @Column({ nullable: true, type: "varchar", length: 20 })
    name: string | null;

    @Column({ nullable: true, type: "varchar", length: 100 })
    description: string | null;

    @Column({ nullable: true, type: "varchar", length: 100 })
    details: string | null;

    @Column({ type: "enum", enum: ProductCategory, nullable: true })
    category: ProductCategory | null;

    // @Column({ type: "enum", enum: ProductAllergen, nullable: true })
    @Column({ type: "simple-array", default: null })
    allergens: ProductAllergen[] | null;

    @Column({ type: "boolean", nullable: true, default: false })
    bio: boolean;

    @Column({ type: "boolean", nullable: true, default: false })
    gmo: boolean;

    // @Column({ type: "int", nullable: true })
    // max: number | null;

    /** Austrian tax rate */
    @Column({ nullable: true, type: "float" })
    tax: number | null;

    /** Time in days */
    @Column({ nullable: true, type: "double" })
    productionTime: Days | null;

    // Product attributes

    @Column({ nullable: true, type: "int" })
    amount: number | null;

    @Column({ type: "enum", enum: ProductUnit, nullable: true })
    unit: ProductUnit | null;

    @Column({ nullable: true, type: "int" })
    price: number | null;

    @Column({ nullable: true, type: "int" })
    min: number | null;

    @Column({ nullable: true, type: "int" })
    max: number | null;

    // @CreateDateColumn()
    // created?: Date;

    // @UpdateDateColumn()
    // updated?: Date;

    // @DeleteDateColumn()
    // deleted?: Date;
}
