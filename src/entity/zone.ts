import {
    BaseEntity,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId
} from "typeorm";
import { Product } from "./product";
import { User } from "./user";

@Entity()
export class Zone extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne((type) => User)
    vendor: User | null;
    @RelationId((zone: Zone) => zone.vendor)
    vendorId: string | null;

    // @OneToOne(() => User)
    // @JoinColumn()
    // vendor: User | null;

    @Column({ nullable: true, type: "varchar", length: 50 })
    title: string | null;

    // @Column("simple-json", { default: null })
    // postAddress: PostAddress | null;

    // @Column({ array: true })
    // @Column("simple-array", { default: null })
    // postCodes: string[];

    @Column({ nullable: true, type: "varchar", length: 6 })
    postCode: string | null;

    // @OneToOne(() => PostCode)
    // @JoinColumn()
    // postcode: PostCode | null;

    @ManyToMany(() => Product)
    @JoinTable()
    products: Product[]; // Its array of Product ids

    @Column({ nullable: true, type: "int" })
    deliverWeekDay: number | null; // It represents hours 0 to 6

    @Column({ nullable: true, type: "int" })
    deliverTimeFrom: number | null; // It represents hours 0 to 24

    @Column({ nullable: true, type: "int" })
    deliverTimeTo: number | null; // It represents hours 0 to 24

    @Column({ nullable: true, type: "int" })
    fee: number | null;

    @Column({ nullable: true, type: "int" })
    min: number | null;

    // Meta

    // @CreateDateColumn()
    // created?: Date;

    // @UpdateDateColumn()
    // updated?: Date;

    // @DeleteDateColumn()
    // deleted?: Date;
}
