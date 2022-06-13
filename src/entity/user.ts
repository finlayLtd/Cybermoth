import {
    BaseEntity,
    Column, CreateDateColumn, DeleteDateColumn, Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { PostAddress } from "../models/postaddress";

// export interface Vendor {
//     orderConfirmation: number;
//     min: number;
//     disclaimer: string;
// }

// export interface Customer {
//     title: string;
// }

export enum UserRole {
    admin = "admin",
    customer = "customer",
    vendor = "vendor"
}

export enum UserDietType {
    all = "all",
    vegan = "vegan",
    vegetarian = "vegetarian",
    gluten_free = "gluten_free",
    lactose_free = "lactose_free",
    organic = "organic",
    gmo_free = "gmo_free"
}

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    // Profile info

    @Column({ nullable: true, type: "varchar", length: 50 })
    nameFirst: string | null;

    @Column({ nullable: true, type: "varchar", length: 50 })
    nameLast: string | null;

    @Column({ nullable: true, type: "varchar", length: 30 })
    email: string | null;

    @Column({ nullable: true, type: "varchar", length: 20 })
    phone: string | null;

    @Column("simple-json", { default: null })
    address: PostAddress | null;

    // Credentials

    @Column({ nullable: false, type: "varchar", length: 10 })
    username: string;

    @Column({ nullable: true, type: "varchar", length: 20 })
    password: string | null;

    @Column({ nullable: true, type: "varchar", length: 30 })
    totpSecret: string | null;

    @Column({ nullable: true, type: "varchar", length: 6 })
    totpToken: string | null;

    @Column({ nullable: true })
    totpVerified: Date | null;

    // @Column({ nullable: true, type: "varchar", length: 30 })
    // secret: string | null;

    // @Column({ nullable: true, type: "varchar", length: 30 })
    // tokens: string | null;

    // @Column({ nullable: true, type: "varchar", length: 30 })
    // registrationToken: string | null;

    // @Column({ nullable: true, type: "varchar", length: 30 })
    // resetPasswordToken: string | null;

    // Custommer/Vendor

    @Column({ type: "enum", enum: UserRole, nullable: true })
    role: UserRole | null;

    // @Column("simple-json", { default: null })
    // vendor: Vendor | null;

    // @Column("simple-json", { default: null })
    // customer: Customer | null;

    // Vendor

    // @Column({ type: "boolean", default: false })
    // vendor: boolean;

    @Column({ nullable: true, type: "int" })
    vendorOrderConfirmation: number | null;

    @Column({ nullable: true, type: "int" })
    vendorMin: number | null;

    @Column({ nullable: true, type: "varchar", length: 30 })
    vendorDisclaimer: string;

    // Customer

    // @Column({ type: "boolean", default: false })
    // customer: boolean;

    @Column({ nullable: true, type: "varchar", length: 20 })
    customerTitle: string | null;

    @Column({ type: "simple-array", default: null })
    customerDietType: UserDietType[] | null;

    // Meta

    @CreateDateColumn()
    created?: Date;

    @UpdateDateColumn()
    updated?: Date;

    @DeleteDateColumn()
    deleted?: Date;
}
