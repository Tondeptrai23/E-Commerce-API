import express from "express";
import "dotenv/config.js";
import bodyParser from "body-parser";
import cors from "cors";

import { db } from "./models/index.model.js";
import seedData from "./seedData.js";

import { router } from "./routes/index.route.js";

import swaggerUI from "swagger-ui-express";

import fs from "fs";
import YAML from "yaml";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    cors({
        origin: process.env.FRONT_END_URL,
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
swaggerDocument.servers[0].url = `http://localhost:${process.env.PORT}/api/v2`;
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use("/api/v2", router);

db.sync()
    .then(async (res) => {
        //
        // await seedData();
    })
    .catch((err) => console.log(err));

app.listen(process.env.PORT || 3000);

/*

Testing 

*/
