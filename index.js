const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer"); //npm pkg for handling multipart/form data on server side, adds the file and the body to the request object
const uidSafe = require("uid-safe"); // npm pkg that generates random and unique string
const path = require("path"); // core module, helps with handling files by providing path
const s3 = require("./s3");
const s3Url = require("./config.json");
//
app.use(express.static("./public"));
app.use(express.json());

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.get("/images", (req, res) => {
    db.getImages()
        .then((results) => {
            console.log("results before json", results.rows);
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("err in getImages:", err);
        });
});

app.get("/image/:id", (req, res) => {
    console.log("req.params:", req.params);
    db.getImage(req.params.id)
        .then((results) => {
            console.log("image, results.rows[0]:", results.rows[0]);
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("err in getImage:", err);
        });
});

app.get("/more/:id", (req, res) => {
    console.log("get more, req.params:", req.params);
    db.getMoreImages(req.params.id)
        .then((results) => {
            console.log("results.rows:", results.rows);
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("err in getMoreImages:", err);
        });
});

app.get("/comments/:id", (req, res) => {
    console.log("comments requested");
    console.log("req.params:", req.params);
    db.getComments(req.params.id)
        .then((results) => {
            console.log("comments, results.rows:", results.rows);
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("err in getComments:", err);
        });
});
// uploader triggers  multer boilerplate that handles that files are being stored on  harddisk,
//in the uploads folder, single is a method of uploader
//'file' comes from the property that was  set on formData
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("congrats!");
    // console.log("req.file:", req.file);
    // console.log("req.body", req.body);
    console.log("s3Url:", s3Url);
    console.log("req.file.filename:", req.file.filename);
    if (req.file) {
        let s3UrlProperty;
        s3UrlProperty = s3Url.s3Url;
        db.addImage(
            `${s3UrlProperty}${req.file.filename}`,
            req.body.username,
            req.body.title,
            req.body.description
        )
            .then((results) => {
                console.log("addImage results.rows[0]:", results.rows[0]);
                res.json(results.rows[0]);
            })
            .catch((err) => {
                console.log("err in addImage:", err);
            });
    } else {
        res.json({ success: false });
    }
});

app.post("/comment", (req, res) => {
    console.log("req.body:", req.body);
    if (req.body.comment && req.body.username) {
        db.addComment(req.body.image_id, req.body.comment, req.body.username)
            .then((results) => {
                console.log("addComment results.rows[0]:", results.rows[0]);
                res.json(results.rows[0]);
            })
            .catch((err) => {
                console.log("err in addComment:", err);
            });
    } else {
        res.json({ success: false });
    }
});

app.listen(8080, () => console.log("imageboard server up and running"));
