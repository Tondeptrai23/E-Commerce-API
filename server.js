import express from "express";
import "dotenv/config.js";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

app.get("/api/testing", (req, res) => {
    console.log(req);
    const data = {
        name: "test",
    };
    res.json(data);
});

app.listen(process.env.PORT || 3000);
