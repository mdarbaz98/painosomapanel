const { data, map } = require("jquery");
const con = require("../config");
var fs = require("fs");
const getAllImage = (req, resp) => {
    con.query("select * from image", (err, res) => {
        if (err) {
            resp.send(err);
        } else {
            resp.send(res);
        }
    });
};

const addImage = (req, resp) => {
    const images = req.files;
    images.map((image) => {
        var name = image.filename.split(".")[0];
        con.query("INSERT INTO image (`image`, `title`, `alt_title`) values(?,?,?)", [image.filename, name, name], (err, result) => {
            if (err) console.log(err);
        });
        // resp.send(image.filename);
    });
};

const updateImage = (req, resp) => {
    const image = req.file ? req.file.filename : req.body.image;
    const { title, alt_title } = req.body;
    const id = req.params.id;
    con.query("UPDATE image SET imagetitle = ? , title = ? , alt_title = ? WHERE id=?", [title, alt_title, id], (err, result) => {
        if (err) console.log(err);
    });
    resp.status(200).send("working");
};

const deleteImage = (req, resp) => {
    const id = req.params.id;
    var arrayIds = JSON.parse(`[${id}]`);
    con.query(`SELECT image FROM image WHERE id IN (?)`, [arrayIds], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            result.map((data) => {
                try {
                    fs.unlinkSync(`../public/assets/demo/images/gallery/${data.image}`);
                    con.query("DELETE FROM image WHERE id IN (?)", [arrayIds], (err, result) => {
                        if (err) console.log(err);
                    });
                } catch (error) {
                    console.log(error);
                }
            });
            resp.status(200).send("Delete Image successfully");
            console.log("Delete Image successfully.");
        }
    });
};

module.exports = {
    getAllImage,
    addImage,
    updateImage,
    deleteImage,
};
