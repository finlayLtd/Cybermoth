import { Kistl, KistlProduct } from "../entity/kistl";
import { User, UserRole } from "../entity/user";

export interface KistlAttrs {
    name: string;
    category: string;
    description: string;
    products: KistlProduct[];
}

export class KistlService {
    static async readAll(customerId: string): Promise<Kistl[]> {
        const customer = await User.findOne({
            where: { id: customerId, role: UserRole.customer }
        });
        if (customer) {
            return Kistl.find({ where: { customer: customer.id } });
        } else {
            throw new Error(`Invalid customer ${customerId}`);
        }
    }

    static async readById(customerId: string, kistlId: string): Promise<Kistl> {
        const customer = await User.findOne({
            where: { id: customerId, role: UserRole.customer }
        });
        if (customer) {
            const kistl = await Kistl.findOne({
                where: { id: kistlId, customer: { id: customer.id } }
            });
            if (kistl) {
                return kistl;
            } else {
                throw new Error("Kistl doesn't exist");
            }
        } else {
            throw new Error(`Invalid customer ${customerId}`);
        }
    }

    static async create(
        customerId: string,
        kistlAttrs: KistlAttrs
    ): Promise<Kistl> {
        const customer = await User.findOne({
            where: { id: customerId, role: UserRole.customer }
        });
        if (customer) {
            const kistl = Kistl.create(kistlAttrs);
            kistl.customer = customer;
            kistl.price = kistlAttrs.products.reduce<number>(
                (p, c) => p + c.price,
                0
            );
            const k = await kistl.save();
            return await Kistl.findOne({ id: k.id });
        } else {
            throw new Error(`Invalid customer ${customerId}`);
        }
    }

    static async update(
        customerId: string,
        kistlId: string,
        kistlUpdate: KistlAttrs
    ): Promise<Kistl> {
        const customer = await User.findOne({
            where: { id: customerId, role: UserRole.customer }
        });
        if (customer) {
            const kistl = await Kistl.findOne({
                where: { id: kistlId, customer: { id: customer.id } }
            });
            if (kistl) {
                Kistl.merge(kistl, kistlUpdate);
                kistl.price = kistlUpdate.products.reduce<number>(
                    (p, c) => p + c.price,
                    0
                );
                const k = await kistl.save();
                return await Kistl.findOne({ id: k.id });
            } else {
                throw new Error("Kistl doesn't exist");
            }
        } else {
            throw new Error(`Invalid customer ${customerId}`);
        }
    }

    static async delete(customerId: string, kistlId: string): Promise<Kistl> {
        const customer = await User.findOne({
            where: { id: customerId, role: UserRole.customer }
        });
        if (customer) {
            const kistl = await Kistl.findOne({
                where: { id: kistlId, customer: { id: customer.id } }
            });
            if (kistl) {
                return await kistl.remove();
            } else {
                throw new Error("Kistl doesnt exist");
            }
        } else {
            throw new Error(`Invalid customer ${customerId}`);
        }
    }
}
