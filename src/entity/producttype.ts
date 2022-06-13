import {
    BaseEntity,
    Column, Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId
} from "typeorm";
import { User } from "./user";

export enum ProductCategory {
    bread = "bread",
    vegetables = "vegetables",
    fruits = "fruits",
    beverages = "beverages"
}

export type ProductCategories = Record<ProductCategory, boolean>;

export const productCategories = Object
    .entries(ProductCategory)
    .map<ProductCategory>(([key, value]) => value);

export enum ProductAllergen {
    gluten = "gluten",
    crustacean = "crustacean",
    egg = "egg",
    fish = "fish",
    peanut = "peanut",
    soybean = "soybean",
    milk = "milk",
    nut = "nut",
    celery = "celery",
    mustard = "mustard",
    sesame = "sesame",
    sulphur = "sulphur",
    lupin = "lupin",
    mollusc = "mollusc"
}

export type ProductAllergens = Record<ProductAllergen, boolean>;

export const productAllergens = Object
    .entries(ProductAllergen)
    .map<ProductAllergen>(([key, value]) => value);

export type Days = number;

@Entity()
export class ProductType extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne((type) => User)
    vendor: User | null;
    @RelationId((productTypeEntity: ProductType) => productTypeEntity.vendor)
    vendorId: string | null;

    // ProductType attributes

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

    // @CreateDateColumn()
    // created?: Date;

    // @UpdateDateColumn()
    // updated?: Date;

    // @DeleteDateColumn()
    // deleted?: Date;
}
