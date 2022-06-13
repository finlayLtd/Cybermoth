import { configInit } from "../config";
import { EuroSms } from "./eurosms";

describe("EuroSMS", () => {

    const conf = configInit();

    const msg = {
        sndr: "1234567",
        rcpt: "1234567",
        txt: "Test test"
    };

    test.skip("Send (instance)", async () => {
        const sms = new EuroSms(conf.eurosms);
        const res = await sms.send(msg);
        console.log(res);
    });

    test.skip("Send (static)", async () => {
        EuroSms.init(conf.eurosms);
        const res = await EuroSms.send(msg);
        console.log(res);
    });

});
