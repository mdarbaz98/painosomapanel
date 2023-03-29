const con = require("../config");

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
    // const image = req.file ? req.file.filename : req.body.image;
    console.log(req)
    // var name = image.split('.')[0]
    // con.query('INSERT INTO image (`imagetitle`, `title`, `alt_title`) values(?,?,?)',[image,name,name],(err,result) => {
    //     if(err) console.log(err);
    // })
    // resp.status(200).send(image);
};

const updateImage = (req, resp) => {
    // const image = req.file ? req.file.filename : req.body.image;
    const {title, alt_title} = req.body;
    const id = req.params.id;
    con.query('UPDATE image SET imagetitle = ? , title = ? , alt_title = ? WHERE id=?',[imagetitle,title,alt_title,id],(err, result) => {
        if(err) console.log(err)
    })
    resp.status(200).send('working');
};

const deleteImage = (req, resp) => {
    const id = req.params.id
    var arrayIds = JSON.parse(`[${id}]`);
    con.query('DELETE FROM image WHERE id IN (?)',[arrayIds],(err, result) => {
        if(err) console.log(err)
    })
    resp.status(200).send('working');
};

module.exports = {
    getAllImage,
    addImage,
    updateImage,
    deleteImage,
};
