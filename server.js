import express from "express";
import "dotenv/config.js";
import bodyParser from "body-parser";
import cors from "cors";

import { db } from "./models/index.js";

import { router } from "./routes/index.js";

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

app.use(router);

db.sync()
    .then((res) => {
        //
    })
    .catch((err) => console.log(err));

app.listen(process.env.PORT || 3000);

/*

Testing 

*/
