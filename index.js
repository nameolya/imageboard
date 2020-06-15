const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("./public"));

app.get("/images", (req, res) => {
    db.getImages()
        .then((results) => {
            console.log("results before json", results);
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("err in getImages:", err);
        });
});

app.listen(8080, () => console.log("imageboard server up and running"));
