import { Totp } from "./totp";

describe("TOTP", () => {

    test("Verify", async () => {
        const secret = Totp.secret();
        const token = Totp.token(secret);
        const verified = Totp.verify(secret, token);

        // console.log(secret, token, verified);
        expect(verified).toBe(true);
    });

});
