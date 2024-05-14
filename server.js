import express from "express";
import "dotenv/config.js";
import bodyParser from "body-parser";

import { db } from "./models/database/Database.js";

import { productRoute } from "./routes/ProductRoute.js";

import { User } from "./models/UserModel.js";
import { Product } from "./models/ProductModel.js";
import { cartRoute } from "./routes/CartRoute.js";

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Create dummy user/admin
app.use("/", async (req, res, next) => {
    const user = await User.findOrCreate({
        where: {
            name: "admin",
        },
        defaults: {
            name: "admin",
            email: "admin@example.com",
            password: "example",
        },
    });

    req.user = user[0];

    next();
});

app.use("/api/products", productRoute);
app.use(cartRoute);

db.sync()
    .then((res) => {
        //
    })
    .catch((err) => console.log(err));

app.listen(process.env.PORT || 3000);
