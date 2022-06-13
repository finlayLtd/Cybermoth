import bodyParser from "body-parser";
import { NextFunction, Request, Response, Router } from "express";
import swaggerUi from "swagger-ui-express";
import { initAuthentication, ResolveApiKey, ResolveUser } from "./api/authentication";
import { Conf } from "./conf";
import { RegisterRoutes } from "./generated/routes";
import { errorHandler } from "./middleware/error-handler";

function basicAuthChallenge(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        res.setHeader("WWW-Authenticate", `Basic realm="API"`);
        res.sendStatus(401);
    } else {
        next();
    }
}

export function api(resolveUser: ResolveUser, resolveApiKey: ResolveApiKey, conf: Conf): Router {
    const router: Router = Router();

    initAuthentication(conf.auth, resolveUser, resolveApiKey);

    // Use body parser to read sent json payloads
    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(bodyParser.json());

    RegisterRoutes(router);

    router.use(
        "/",
        basicAuthChallenge,
        swaggerUi.serve, swaggerUi.setup(undefined, undefined, undefined, undefined, undefined, "swagger.json")
    );

    router.use(function notFoundHandler(_req: Request, res: Response) {
        res.status(404).send({ message: "Not Found" });
    });

    router.use(errorHandler);

    return router;
}
