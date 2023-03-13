const con = require("../config");
const asyncHandler = require("express-async-handler");

// get all blogs
const getAllBlog = (req, res) => {
    con.query("select * from blog", (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
};

//
const getBlogById = (req, res) => {
    res.send("working");
};

//create new blog
const addBlog = asyncHandler(async (req, res) => {

    const { blogTitle, seo_title, blog_slug, keywords, meta_desc, author_name, image, parent_category,category, excerpt, content } = req.body;



    con.query(
        "INSERT INTO blog (blog_title,seo_title,blog_slug,keywords,meta_desc,author_name, image, excerpt,parent_category, category, content) value (?,?,?,?,?,?,?,?,?,?,?)",
        [blogTitle, seo_title, blog_slug, keywords, meta_desc, author_name, image, excerpt, parent_category, JSON.stringify(category) , content],
        (err, result) => {
            if (err) console.log(err);
        }
    );
    res.status(200).json({ message: "successfully created" });
});

//update blog
const updateBlog = asyncHandler(async (req, res) => {

    const updatedImg = req.file ? req.file.filename : req.body.image;

    const id = req.params.id;

    const { blogTitle, seo_title, blog_slug, keywords, meta_desc, author_name, parent_category,category, excerpt, content } = req.body;

    const upCategory = typeof category === "object" ? JSON.stringify(category) : category


    con.query('UPDATE blog SET blog_title = ?, seo_title = ?, blog_slug = ?, keywords = ?, meta_desc = ?, author_name = ?, image = ?, parent_category = ?, category =? , excerpt = ? , content = ? WHERE id = ?',
    [blogTitle, seo_title, blog_slug, keywords, meta_desc, author_name, updatedImg, parent_category,upCategory, excerpt, content,id],(err, result) => {
        if (err) console.log(err);
    });

    res.status(200).json({ message: "successfully Updated" });

});

// delete blog
const deleteBlog = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (id) {
        var arrayIds = JSON.parse(`[${id}]`);
        con.query(`DELETE FROM blog WHERE id IN (?)`, [arrayIds], (err, result) => {
            if (err) console.log(err);
        });
        res.status(200).json({ message: "successfully deleted" });
    } else {
        res.status(500).json({ message: "something went wrong" });
    }
});

module.exports = {
    getAllBlog,
    getBlogById,
    addBlog,
    updateBlog,
    deleteBlog,
};
