const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    if (!req.file) {
        return res.sendStatus(500);
    }

    // provides additional info about the uploaded file
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            // it worked!!!
            console.log("amazon upload is complete!!!");
            next();
            // this will delete the img you just uploaded to aws from uploads folder - this is optional!
            fs.unlink(path, () => {});
        })
        .catch((err) => {
            // uh oh
            console.log(err);
        });
};
