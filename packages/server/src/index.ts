import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { execa } from "execa";

const server: FastifyInstance = Fastify({});
server.register(cors, (instance) => {
  return (req: any, callback: any) => {
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

const getLinksJson = async () => {
  let { stdout: globalNodeModulesPath } = await execa("npm", ["root", "-g"]);
  const linksPath = `${globalNodeModulesPath}/wml/src/links.json`;
  const { stdout } = await execa("cat", [linksPath]);
  return JSON.parse(stdout);
};

const isWmlInstalled = async () => {
  let isInstalled = false;
  try {
    await execa("wml");
    isInstalled = true;
  } catch (error) {
    console.log(error);
  } finally {
    return isInstalled;
  }
};

server.get("/", async (request, reply) => {
  let isInstalled = await isWmlInstalled();

  if (!isInstalled) {
    return { isInstalled, links: {} };
  }

  const links = await getLinksJson();
  return { isInstalled, links };
});

server.patch("/", async (request, reply) => {
  const { key, toggleTo } = request.body as any;
  let isInstalled = await isWmlInstalled();

  if (!isInstalled) {
    return { isInstalled, links: {} };
  }

  const { stdout } = await execa("wml", [toggleTo, key]);
  const links = await getLinksJson();
  return { msg: stdout, links };
});

server.post("/link", async (request, reply) => {
  const { paths } = request.body as { paths: string[] };
  let isInstalled = await isWmlInstalled();

  if (!isInstalled) {
    return { isInstalled, links: {} };
  }

  const { stdout } = await execa("wml", ["add"].concat(paths));
  const links = await getLinksJson();
  return { msg: stdout, links };
});

server.patch("/link", async (request, reply) => {
  const { id } = request.body as { id: string };
  let isInstalled = await isWmlInstalled();

  if (!isInstalled) {
    return { isInstalled, links: {} };
  }

  const { stdout } = await execa("wml", ["rm", id]);
  const links = await getLinksJson();
  return { msg: stdout, links };
});

const start = async () => {
  try {
    await server.listen({ port: 8080 });

    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
