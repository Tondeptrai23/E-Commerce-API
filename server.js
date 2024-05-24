import express from "express";
import "dotenv/config.js";
import bodyParser from "body-parser";
import cors from "cors";

import { db } from "./models/index.js";

import { productRoute } from "./routes/productRoute.js";
import { cartRoute } from "./routes/cartRoute.js";
import { orderRoute } from "./routes/orderRoute.js";
import { authRoute } from "./routes/authRoute.js";

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

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);

db.sync({ force: true })
    .then((res) => {
        //
    })
    .catch((err) => console.log(err));

app.listen(process.env.PORT || 3000);

/*

Testing 

*/
