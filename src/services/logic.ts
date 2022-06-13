import { Conf } from "../conf";
import { User } from "../entity/user";

export class Logic {
    static instance: Logic;

    static init(conf: Conf): void {
        Logic.instance = new Logic(conf);
    }

    static async addUser(user: User): Promise<User> {
        return user;
    }

    conf: Conf;

    constructor(conf: Conf) {
        this.conf = conf;
    }
}
