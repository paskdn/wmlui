var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Fastify from "fastify";
import cors from "@fastify/cors";
import { execa } from "execa";
const server = Fastify({});
server.register(cors, (instance) => {
    return (req, callback) => {
        const corsOptions = {
            // This is NOT recommended for production as it enables reflection exploits
            origin: true,
        };
        // do not include CORS headers for requests from localhost
        if (/^localhost$/m.test(req.headers.origin)) {
            corsOptions.origin = false;
        }
        // callback expects two parameters: error and options
        callback(null, corsOptions);
    };
});
// const opts: RouteShorthandOptions = {
//   schema: {
//     response: {
//       200: {
//         type: "object",
//         properties: {
//           pong: {
//             type: "string",
//           },
//           stdout: {
//             type: "string",
//           },
//         },
//       },
//     },
//   },
// };
const getLinksJson = () => __awaiter(void 0, void 0, void 0, function* () {
    let { stdout: globalNodeModulesPath } = yield execa("npm", ["root", "-g"]);
    const linksPath = `${globalNodeModulesPath}/wml/src/links.json`;
    const { stdout } = yield execa("cat", [linksPath]);
    return JSON.parse(stdout);
});
const isWmlInstalled = () => __awaiter(void 0, void 0, void 0, function* () {
    let isInstalled = false;
    try {
        yield execa("wml");
        isInstalled = true;
    }
    catch (error) {
        console.log(error);
    }
    finally {
        return isInstalled;
    }
});
server.get("/ping", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    let isInstalled = yield isWmlInstalled();
    if (!isInstalled) {
        return { isInstalled, links: {} };
    }
    const links = yield getLinksJson();
    return { isInstalled, links };
}));
server.patch("/ping", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(request.body);
    const { key, toggleTo } = request.body;
    let isInstalled = yield isWmlInstalled();
    if (!isInstalled) {
        return { isInstalled, json: {} };
    }
    const { stdout } = yield execa("wml", [toggleTo, key]);
    const json = yield getLinksJson();
    return { msg: stdout, json };
    // return { msg: "hello", json: {} };
}));
server.post("/link", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { paths } = request.body;
    let isInstalled = yield isWmlInstalled();
    if (!isInstalled) {
        return { isInstalled, json: {} };
    }
    const { stdout } = yield execa("wml", ["add"].concat(paths));
    const json = yield getLinksJson();
    return { msg: stdout, json };
    // return { msg: "hello", json: {} };
}));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield server.listen({ port: 8080 });
        const address = server.server.address();
        const port = typeof address === "string" ? address : address === null || address === void 0 ? void 0 : address.port;
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
});
start();
