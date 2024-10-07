import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import fs from "fs";
import YAML from "yaml";

import { router } from "./routes/index.route.js";
import { serverConfig } from "./config/config.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    cors({
        origin: serverConfig.FRONT_END_URL,
    })
);

app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );

    next();
});

const file = fs.readFileSync("./openapi.yaml", "utf8");
const swaggerDocument = YAML.parse(file);
swaggerDocument.servers[0].url = `${serverConfig.SERVER_URL}/api/v2`;
app.use(
    "/docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument, {
        customCss:
            ".swagger-ui { font-family: Verdana; } .parameters-col_description p { font-size: 0.8em}",
    })
);
app.use("/api/v2", router);

app.use(errorHandler);

export default app;
