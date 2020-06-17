const spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images`);
};

module.exports.addImage = (fullUrl, username, title, description) => {
    return db.query(
        `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING id, url, username, title, description`,
        [fullUrl, username, title, description]
    );
};

module.exports.getImage = (imageId) => {
    return db.query(`SELECT * FROM images WHERE id=$1`, [imageId]);
};

module.exports.getComments = (imageId) => {
    return db.query(`SELECT * FROM comments WHERE id=$1`, [imageId]);
};
