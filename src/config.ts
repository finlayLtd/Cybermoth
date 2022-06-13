import nconf from "nconf";
import path from "path";
import { objPaths } from "peryl/dist/objpaths";
import { Conf, confDefault } from "./conf";

export function configInit(): Conf {
    nconf
        .argv()
        .env({
            separator: "_",
            lowerCase: false,
            whitelist: objPaths(confDefault).map((c) => c.join("__")),
            parseValues: true
        })
        .file(path.join(__dirname, "..", "conf.json"))
        .defaults(confDefault);
    return nconf.get() as Conf;
}
