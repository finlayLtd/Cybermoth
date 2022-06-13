import { Mailer, MailerMessage } from "./mailer";

describe("Mailer", () => {

    test.skip("Send message via instance", async () => {
        const m = new Mailer({
            name: "Ovservis",
            address: "Ovservis11@gmail.com",
            password: "Ovservis#123"
        });

        m.openTransport();

        const message: MailerMessage = {
            to: "pr.rybar@gmail.com",
            // bcc: "peter.rybar@naytrolabs.com",
            subject: "Email Using Node.js",
            text: "Node.js New world for me",
            html: "<b>Node.js</b> New world for me"
        };
        const status = await m.sendMessage(message);
        // console.log(status);
        expect(status.accepted.length).toBe(1);

        m.closeTransport();
    });

    test.skip("Send message via singletton", async () => {
        Mailer.init({
            name: "Ovservis",
            address: "Ovservis11@gmail.com",
            password: "Ovservis#123"
        });

        const logoDataUri = "data:image/png;base64,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";

        const status = await Mailer.send({
            // from: "info@ovservis.sk",
            // sender: "info@ovservis.sk",
            // replyTo: "info@ovservis.sk",
            // to: "pr.rybar@gmail.com",
            to: { name: "Peter Rybar", address: "pr.rybar@gmail.com" },
            // bcc: "peter.rybar@naytrolabs.com",
            subject: "Email Using Node.js",
            text: "Mailer test message",
            html: `<b>Mailer</b>  test message<br/><img src="cid:logo"/>`,
            attachments: [
                {
                    path: logoDataUri,
                    // path: __dirname + "/../../static/assets/ovservis-mail-signature.jpg",
                    cid: "logo"
                }
            ]
        });
        // console.log(status);
        expect(status.accepted.length).toBe(1);
    });

});
