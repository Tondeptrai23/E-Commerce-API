import express from "express";
import "dotenv/config.js";
import bodyParser from "body-parser";

import { db } from "./models/database/Database.js";

import { productRoute } from "./routes/ProductRoute.js";

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/products", productRoute);

db.sync()
    .then((res) => {
        //
    })
    .catch((err) => console.log(err));

app.listen(process.env.PORT || 3000);
