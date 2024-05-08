import express from "express";
import "dotenv/config.js";
import bodyParser from "body-parser";

import { db } from "./models/database/Database.js";

const app = express();

app.use(bodyParser.json());

app.get("/api/testing", (req, res) => {
    console.log(req);
    const data = {
        name: "test",
    };
    res.json(data);
});

db.sync({ force: true })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

app.listen(process.env.PORT || 3000);
