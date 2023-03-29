const con = require("../config");
const asyncHandler = require("express-async-handler");

// get All category

const getAllCategory = asyncHandler(async(req, res) => {
    con.query('select * from categories', (err, result) => {
        if (err) console.log(err)
        res.send(result)
    })
    // res.status(200).json({ message: "Fetched all category" });
})

// get parentcategory

const getParentCategory = asyncHandler(async(req,res)=>{
    con.query(`SELECT * FROM categories WHERE parent_category = 0`,(err,result)=>{
        if (err) console.log(err)
        res.send(result)
    })
    // res.status(200).json({ message: "Fetched parentcategory" });
})



// get sub-category by id
const getSubCategoryById = asyncHandler (async(req, res) => {
    const id = req.params.id
    con.query(`SELECT * FROM categories WHERE parent_category=${id}`, (err, result) => {
        if (err) console.log(err)
        res.send(result)
    })
    // res.status(200).json({ message: "Fetched category by id" });
})



// get category by id
const getCategoryById = asyncHandler (async(req, res) => {
    const id = req.params.id
    con.query(`SELECT cat_name FROM categories WHERE id=${id}`, (err, result) => {
        if (err) console.log(err)
        res.send(result)
    })
    // res.status(200).json({ message: "Fetched category by id" });
})

// category post

const addCategory =  asyncHandler(async(req, res) => {
    const { cat_name, cat_slug, cat_title, cat_desc, parent_category, status} = req.body;
    console.log(req.body)
    con.query('INSERT INTO `categories`( `cat_name`, `cat_slug`, `cat_title`, `cat_desc`, `parent_category`, `status`) VALUES (?,?,?,?,?,?)', [cat_name, cat_slug, cat_title, cat_desc, parent_category, status], (err, result) => {
        if (err) console.log(err)
         res.send(result)
    })
    // res.status(200).json({ message: "Added category" });
})

// category delete

const deleteCategory = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const newid = JSON.parse(`[${id}]`)

    con.query('DELETE FROM categories WHERE id IN (?)', [newid], (err, result) => {
        if(err) console.log(err)
         res.send(result)
    })
    // res.status(200).json({ message: "Category deleted" });
})

// category update

const updateCategory = asyncHandler(async(req, res) => {
    const { cat_name, cat_slug, cat_title, cat_desc, parent_category, status} = req.body;
    const id = req.params.id;
    con.query('UPDATE `categories` SET cat_name=? ,cat_slug=? ,cat_title=? ,cat_desc=? ,parent_category=? ,status=? WHERE id IN (?)', 
    [cat_name, cat_slug, cat_title, cat_desc, parent_category, status, id], (err, result) => {
        if(err) console.log(err)
         res.send(result)
    })
    // res.status(200)     .json({ message: "Category updated" });
})

module.exports = {
    getAllCategory,
    getCategoryById,
    getParentCategory,
    deleteCategory,
    updateCategory,
    addCategory,
    getSubCategoryById
}