import * as log4js from "log4js";
import { basename, extname } from "path";
import { app } from "./app";
import { AddressInfo } from "net";
import * as http from "http";
// import * as https from "https";
// import * as fs from "fs";

const log = log4js.getLogger(basename(__filename, extname(__filename)));

const port = app.conf.server.port;
const host = app.conf.server.host;

const httpServer = http.createServer(app);
httpServer.listen(port, host, () => {
    const addr = httpServer.address() as AddressInfo;
    log.info("listening: http://%s:%s", addr.address, addr.port);
});

// const privateKey = fs.readFileSync(__dirname + "/../ssl/key.pem", "utf8");
// const certificate = fs.readFileSync(__dirname + "/../ssl/cert.pem", "utf8");
// const sslOptions = {
//     key: privateKey,
//     cert: certificate,
//     passphrase: "rybar"
// };
// const httpsServer = https.createServer(sslOptions, app);
// httpsServer.listen(8443, host, () => {
//     const addr = httpsServer.address() as AddressInfo;
//     log.info("listening: https://%s:%s", addr.address, addr.port);
// });

// process.on("SIGTERM", shutdown);
// process.on("SIGINT", shutdown);

// function shutdown(signals: NodeJS.Signals) {
//     log.info("Shutdown", signals);
//     httpServer.close(async () => {
//         log.info("Closed remaining connections");
//         await app.logic.close();
//         process.exit(0);
//     });
//     // db.stop(function(err) {
//     //   process.exit(err ? 1 : 0);
//     // });
//  }
