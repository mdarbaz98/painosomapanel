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
         about_soma
    } = req.body;

    const imageName = req.file.filename;

    const q = "INSERT INTO author (name, image, position, slug, degree, seo_title, seo_description, linkedin, highlight, experience, education, about_soma) value (?,?,?,?,?,?,?,?,?,?,?,?)"
    const values = [name, imageName, position, slug, degree, seo_title, seo_description, linkedin, highlight, experience, education, about_soma]
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
    const { name, image, position, slug, degree, seo_title, seo_description, linkedin, highlight, experience, education, about_soma } = req.body;
    const id = req.params.id;
    const imageName = req.file.filename;
    con.query(
        "UPDATE `author` SET  name=?,imageName=?, image=?, reviewed_by=?, written_by=?, position=?, slug=?, degree=?, seo_title=?, seo_description=?, linkedin=?, highlight=?, experience=?, education=?, about_soma=? WHERE id IN (?)",
        [name, image,imageName, position, slug, degree, seo_title, seo_description, linkedin, highlight, experience, education, about_soma, id],
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

module.exports = {
    getAllAuthor,
    addAuthor,
    updateAuthor,
    deleteAuthor,
};
