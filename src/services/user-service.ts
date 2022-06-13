import { User, UserDietType, UserRole } from "../entity/user";
import { PostAddress } from "../models/postaddress";

export interface UserAttrs {
    nameFirst?: string;
    nameLast?: string;
    email?: string;
    phone?: string;
    address?: PostAddress;

    username?: string;
    password?: string;

    role?: UserRole;

    vendorOrderConfirmation?: number;
    vendorMin?: number;
    vendorDisclaimer?: string;

    customerTitle?: string;
    customerDietType?: UserDietType[];
}

export class UserService {
    static async readAll(): Promise<User[]> {
        return await User.find();
    }

    static async readById(userId: string): Promise<User> {
        const user = await User.findOne({ where: { id: userId } });
        if (user) {
            return user;
        } else {
            throw new Error("No such user id");
        }
    }

    static async readByUsername(username: string): Promise<User> {
        const user = await User.findOne({ where: { username } });
        if (user) {
            return user;
        } else {
            throw new Error("No such username");
        }
    }

    static async readByUsernameAndPassword(
        username: string,
        password: string
    ): Promise<User> {
        const user = await User.findOne({ where: { username, password } });
        if (user) {
            return user;
        } else {
            throw new Error("Invalid username or password");
        }
    }

    static async create(userAttrs: UserAttrs): Promise<User> {
        const user = User.create(userAttrs);
        return await user.save();
    }

    static async update(userId: string, userAttrs: UserAttrs): Promise<User> {
        const user = await User.findOne({ id: userId });
        if (user) {
            User.merge(user, userAttrs);
            return await user.save();
        } else {
            throw new Error("No such username");
        }
    }

    static async delete(userId: string): Promise<User> {
        const user = await User.findOne({ id: userId });
        if (user) {
            return await User.softRemove(user);
        } else {
            throw new Error("Customer doesnt exist");
        }
    }
}
