const con = require("../config");
const asyncHandler = require("express-async-handler");

// get all blogs
const getAllBlog = (req, res) => {
    con.query("SELECT * FROM `blog` ORDER BY blogdate DESC", (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
};

//Add blog
const addBlog = asyncHandler(async (req, res) => {

    const { blog_title, seo_title, slug,blog_desc, author, review, parentcategory, subcategory,content,reference, blogdate, status, publishdate } = req.body;

    const feature_image = req.file ? req.file.filename : req.body.image
    con.query(
        "INSERT INTO blog ( blog_title, seo_title, slug, blog_desc, author, review, feature_image, parentcategory, subcategory,content,reference, blogdate, status, publishdate) value (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [blog_title, seo_title, slug, blog_desc, author, review, feature_image, parentcategory, subcategory,content,reference, blogdate, status, publishdate],
        (err, result) => {
            if (err) console.log(err);
        }
    );
    res.status(200).json({ message: "successfully created" });
});   

const updateBlog = asyncHandler(async (req, res) => {
    const { blog_title, seo_title, slug,blog_desc, author, review, parentcategory, subcategory,content,reference, blogdate, status, publishdate } = req.body;
    const id = req.params.id;
    const feature_image = req.file ? req.file.filename : req.body.image
    con.query('UPDATE `blog` SET  blog_title=?, seo_title=?, slug=?,blog_desc=?, author=?, review=?, feature_image=?, parentcategory=?, subcategory=?,content=?,reference=?, blogdate=?, status=?, publishdate=? WHERE id IN (?)',
        [blog_title, seo_title, slug, blog_desc, author, review, feature_image, parentcategory, subcategory,content,reference, blogdate, status, publishdate, id], (err, result) => {
            if (err) console.log(err)
            //  res.send(result)
        })
    res.status(200).json({ message: "blog updated" });
})

const deleteBlog = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const newid = JSON.parse(`[${id}]`)

    con.query('DELETE FROM blog WHERE id IN (?)', [newid], (err, result) => {
        if (err) console.log(err)
        res.send(result)
    })
    // res.status(200).json({ message: "Category deleted" });
})

// updateblogStatus
const updateblogStatus = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const status = req.body.status
    con.query(`UPDATE blog SET status=${status} WHERE id=?`, [id], (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
    // res.status(200).json({ message: "Category deleted" });
});



// blogs in descending order

const getdescBlog = (req, res) => {
    con.query("SELECT `blog_title`,`feature_image`, `blogdate` FROM `blog` ORDER BY id DESC LIMIT 10", (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
};



module.exports = {
    getAllBlog,
    addBlog,
    updateBlog,
    deleteBlog,
    updateblogStatus,
    getdescBlog
};
