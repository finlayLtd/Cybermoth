import { configInit } from "../config";
import { TwilioSms, TwilioSmsMsg } from "./twiliosms";

describe.skip("TwilioSMS", () => {

    const conf = configInit();

    const msg: TwilioSmsMsg = {
        // phone: "+421905542489",
        phone: "+421905542",
        text: "Test Twilio"
    };

    test("Send (instance)", async () => {
        const sms = new TwilioSms(conf.twiliosms);
        try {
            const res = await sms.send(msg);
            console.log(res);
        } catch (error) {
            // console.log(error);
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty("message", "The 'To' number +421905542 is not a valid phone number.");
        }
    });

    test("Send (static)", async () => {
        TwilioSms.init(conf.twiliosms);
        try {
            const res = await TwilioSms.send(msg);
            console.log(res);
        } catch (error) {
            // console.log(error);
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty("message", "The 'To' number +421905542 is not a valid phone number.");
        }
    });

});
