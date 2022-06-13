import { Product } from "../entity/product";
import { User } from "../entity/user";
import { Zone } from "../entity/zone";

export interface ZoneAttrs {
    title?: string;
    postCode?: string;
    // products?: Product[];

    deliverWeekDay?: number;
    deliverTimeFrom?: number;
    deliverTimeTo?: number;
    fee?: number;
    min?: number;
}

export class ZoneService {
    static async readAll(vendorId: string): Promise<Zone[]> {
        return await Zone.find({
            relations: ["products"],
            where: { vendor: { id: vendorId } }
        });
    }

    static async readById(vendorId: string, zoneId: string): Promise<Zone> {
        return await Zone.findOneOrFail({
            relations: ["products"],
            where: { id: zoneId, vendor: { id: vendorId } }
        });
    }

    static async read(postCode: string): Promise<Zone[]> {
        return await Zone.find({
            relations: ["products"],
            where: { postCode }
        });
    }

    static async productAdd(
        vendorId: string,
        zoneId: string,
        productId: string
    ): Promise<Zone> {
        const zone = await Zone.findOne({
            relations: ["products"],
            where: { id: zoneId, vendor: { id: vendorId } }
        });
        if (!zone) {
            throw new Error("Invalid zone");
        }
        const product = await Product.findOne({
            where: { id: productId, vendor: { id: vendorId } }
        });
        if (!product) {
            throw new Error("Invalid product");
        }
        zone.products.push(product);
        await zone.save();
        return zone;
    }

    static async productRemove(
        vendorId: string,
        zoneId: string,
        productId: string
    ): Promise<Zone> {
        const zone = await Zone.findOne({
            relations: ["products"],
            where: { id: zoneId, vendor: { id: vendorId } }
        });
        if (!zone) {
            throw new Error("Invalid zone");
        }
        zone.products = zone.products.filter((p) => p.id !== productId);
        await zone.save();
        return zone;
    }

    static async create(vendorId: string, zoneAttrs: ZoneAttrs): Promise<Zone> {
        const vendor = await User.findOne({ where: { id: vendorId } });
        const zone = Zone.create(zoneAttrs);
        zone.vendor = vendor;
        zone.products = [];
        return await zone.save();
    }

    static async update(
        vendorId: string,
        zoneId: string,
        zoneAttrs: ZoneAttrs
    ): Promise<Zone> {
        const zone = await Zone.findOne({
            relations: ["products"],
            where: { id: zoneId, vendor: { id: vendorId } }
        });
        if (zone) {
            Zone.merge(zone, zoneAttrs);
            return await zone.save();
        } else {
            throw new Error("Invalid Zone");
        }
    }

    static async delete(vendorId: string, zoneId: string): Promise<Zone> {
        const zone = await Zone.findOne({
            relations: ["products"],
            where: { id: zoneId, vendor: { id: vendorId } }
        });
        if (zone) {
            return await zone.remove();
        } else {
            throw new Error("Zone doesn't exist");
        }
    }
}
