const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer"); //npm pkg for handling multipart/form data on server side, adds the file and the body to the request object
const uidSafe = require("uid-safe"); // npm pkg that generates random and unique string
const path = require("path"); // core module, helps with handling files by providing path

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
            console.log("results before json", results);
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("err in getImages:", err);
        });
});
// uploader triggers  multer boilerplate that handles that files are being stored on  harddisk,
//in the uploads folder, single is a method of uploader
//'file' comes from the property that was  set on formData
app.post("/upload", uploader.single("file"), (req, res) => {
    console.log("file:", req.file);
    console.log("req.body", req.body);
    if (req.file) {
        // we will eventually want to make a db insert query where we insert all image information into our database, but before doing this we need to talk about how to get our images up into the cloud
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});
app.listen(8080, () => console.log("imageboard server up and running"));
