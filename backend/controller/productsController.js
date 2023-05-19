const con = require("../config");
const asyncHandler = require("express-async-handler");

// get all blogs
const getAllproduct = (req, res) => {
    con.query("select * from products", (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
};

//Add blog
const addproduct = asyncHandler(async (req, res) => {
    const {product_name, product_price, product_slug, strength,parentcategory,subcategory, othercompany, otherprice, aboutheader, abouteditor, newsheader, newseditor, advanceheader, advanceeditor,segregation, status,date} = req.body;
    const image = req.file ? req.file.filename : req.body.image
    con.query(
        "INSERT INTO products (image, product_name, product_price, product_slug, strength,parentcategory,subcategory, othercompany, otherprice, aboutheader, abouteditor, newsheader, newseditor, advanceheader, advanceeditor,segregation, status,date) value (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [image, product_name, product_price, product_slug, strength,parentcategory,subcategory, othercompany, otherprice, aboutheader, abouteditor, newsheader, newseditor, advanceheader, advanceeditor,segregation, status,date],
        (err, result) => {
            if (err) console.log(err);
        }
    );
    res.status(200).json({ message: "successfully created" });
});

const updateproduct = asyncHandler(async (req, res) => {
    const { product_name, product_price, product_slug, strength,parentcategory,subcategory, othercompany, otherprice, aboutheader, abouteditor, newsheader, newseditor, advanceheader, advanceeditor,segregation, status,date} = req.body;
    const id = req.params.id;
    const feature_image = req.file ? req.file.filename : req.body.image
    console.log(req.body)
    con.query('UPDATE `products` SET  image=?, product_name=?, product_price=?, product_slug=?, strength=?,parentcategory=?,subcategory=? , othercompany=?, otherprice=?, aboutheader=?, abouteditor=?, newsheader=?, newseditor=?, advanceheader=?, advanceeditor=?,segregation=?, status=? ,date=? WHERE id IN (?)',
        [feature_image, product_name, product_price, product_slug, strength,parentcategory,subcategory, othercompany, otherprice, aboutheader, abouteditor, newsheader, newseditor, advanceheader, advanceeditor,segregation, status,date, id], (err, result) => {
            if (err) console.log(err)
            //  res.send(result)
        })
    res.status(200).json({ message: "blog updated" });
})

const deleteproduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const newid = JSON.parse(`[${id}]`)

    con.query('DELETE FROM products WHERE id IN (?)', [newid], (err, result) => {
        if (err) console.log(err)
        res.send(result)
    })
    // res.status(200).json({ message: "Category deleted" });
})

// updateblogStatus
const updateproductStatus = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const status = req.body.status
    con.query(`UPDATE products SET status=${status} WHERE id=?`, [id], (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
    // res.status(200).json({ message: "Category deleted" });
});


module.exports = {
    getAllproduct,
    addproduct,
    updateproduct,
    deleteproduct,
    updateproductStatus
};
