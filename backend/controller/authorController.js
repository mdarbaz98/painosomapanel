const con = require("../config");
const asyncHandler = require("express-async-handler");

// get all Author
const getAllAuthor = (req, res) => {
    con.query("select * from author", (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
};

//Add Author
const addAuthor = asyncHandler(async (req, res) => {
    const { 
        name,
        position,
        slug,
        degree,
        seo_title,
        seo_description,
        linkedin,
        highlight, 
        experience, 
        education,
         about_soma,
         status
    } = req.body;

    const imageName = req.file.filename;

    const q = "INSERT INTO author (name, image, position, slug, degree, seo_title, seo_description, linkedin, highlight, experience, education, about_soma,status) value (?,?,?,?,?,?,?,?,?,?,?,?,?)"
    const values = [name, imageName, position, slug, degree, seo_title, seo_description, linkedin, highlight, experience, education, about_soma,status]
    try {
        con.query(q,values,(err, result) => {
                if (err) console.log(err);
            }
        );
        res.status(200).json({ message: "successfully created" });
    } catch (error) {
        console.log(error)
    }
});

// update

const updateAuthor = asyncHandler(async (req, res) => {
    const { name, position, slug, degree, seo_title, seo_description, linkedin, highlight, experience, education, about_soma,status } = req.body;
    const id = req.params.id;

    const imageName = req.file ? req.file.filename : req.body.image;
    con.query(
        "UPDATE `author` SET  name=?, image=?, position=?, slug=?, degree=?, seo_title=?, seo_description=?, linkedin=?, highlight=?, experience=?, education=?, about_soma=? , status=? WHERE id IN (?)",
        [name,imageName, position, slug, degree, seo_title, seo_description, linkedin, highlight, experience, education, about_soma,status, id],
        (err, result) => {
            if (err) console.log(err);
            //  res.send(result)
        }
    );
    res.status(200).json({ message: "blog updated" });
});

// delete
const deleteAuthor = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const newid = JSON.parse(`[${id}]`);

    con.query("DELETE FROM author WHERE id IN (?)", [newid], (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
    // res.status(200).json({ message: "Category deleted" });
});

// updateAuthorStatus
const updateAuthorStatus = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const status = req.body.status
    con.query(`UPDATE author SET status=${status} WHERE id=?`, [id], (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
    // res.status(200).json({ message: "Category deleted" });
});

module.exports = {
    getAllAuthor,
    addAuthor,
    updateAuthor,
    deleteAuthor,
    updateAuthorStatus
};
