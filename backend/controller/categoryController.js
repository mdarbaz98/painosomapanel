const con = require("../config");

// const getAllCategory = (req, resp) => {
//     con.query("select * from category", (err, res) => {
//         if (err) {
//             resp.send(err);
//         } else {
//             resp.send(res);
//         }
//     });
// }

// const getParentCategory = (req, resp) => {
//     con.query("select * from category where parent_category ='0'", (err, res) => {
//         if (err) {
//             resp.send(err);
//         } else {
//             resp.send(res);
//         }
//     });
// };

// const getSubCategory = (req, resp) => {
//     con.query("select * from category where parent_category !='0'", (err, res) => {
//         if (err) {
//             resp.send(err);
//         } else {
//             resp.send(res);
//         }
//     });
// };

// const getCategoryById = (req, resp) => {
//     const id = req.params.id;
//     con.query("select * from category where id = ?", [id], (err, res) => {
//         if (err) {
//             resp.send(err);
//         } else {
//             resp.send(res);
//         }
//     });
// };

// const addCategory = (req, resp) => {
//     const {name, parentName, categoryDesc, CategorySlug, CategoryTitle, metaDesc} = req.body;

//         con.query('INSERT INTO category (category_name,parent_category,category_description,category_slug,category_title,meta_description) value (?,?,?,?,?,?)',[name,parentName,categoryDesc,CategorySlug,CategoryTitle,metaDesc], (err, result) => {
//             if(err) console.log(err)
//         })
//     resp.send('working');
// };

// const updateCategory = (req, resp) => {
//     const id = req.params.id;
//     const {name, parentName, categoryDesc, CategorySlug, CategoryTitle, metaDesc} = req.body;

//     con.query('UPDATE category SET category_name = ?, parent_category = ?, category_description = ?, category_slug = ?, category_title = ?, meta_description = ? WHERE id = ?',[name,parentName,categoryDesc,CategorySlug,CategoryTitle,metaDesc,id], (err, result) => {
//         if(err) console.log(err)
//     })
//     resp.send('working')
// };

// const deleteCategory = (req, resp) => {
//     const id = req.params.id;
//     const arrayIds = JSON.parse(`[${id}]`)
//     con.query('DELETE FROM category WHERE id IN (?)',[arrayIds], (err, result) => {
//         if(err) console.log(err)
//     }
//     )
//     resp.send('working')
// };


// module.exports = {
//     getAllCategory,
//     getParentCategory,
//     getSubCategory,
//     getCategoryById,
//     addCategory,
//     updateCategory,
//     deleteCategory
// };


// category get

const getAllCategory =  (req, res) => {
    con.query('select * from categories', (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
}

// parent category

const getParentCategory =(req,res)=>{
    con.query(`SELECT * FROM categories WHERE parent_category = 0`,(err,result)=>{
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
}

app.get("/api/category/:id", (req, res) => {
    const id = req.params.id
    con.query(`SELECT categoryname FROM category WHERE id=${id}`, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

// category post

app.post("/api/category", (req, res) => {
    const { cat_name, cat_slug, cat_title, cat_desc, parent_category, status} = req.body;
    console.log(req.body)
    con.query('INSERT INTO `categories`( `cat_name`, `cat_slug`, `cat_title`, `cat_desc`, `parent_category`, `status`) VALUES (?,?,?,?,?,?)', [cat_name, cat_slug, cat_title, cat_desc, parent_category, status], (err, response) => {
        if (err) console.log(err)
    })
    res.send('record added')
})

// category delete

app.delete("/api/category/:id", (req, res) => {
    const id = req.params.id;
    const newid = JSON.parse(`[${id}]`)
    console.log(newid);

    con.query('DELETE FROM categories WHERE id IN (?)', [newid], (err, response) => {
        // if(err) console.log(err)
        res.send(response)
    })
})

// category update

app.put("/api/category/:id", (req, res) => {
    const { cat_name, cat_slug, cat_title, cat_desc, parent_category, status} = req.body;
    const id = req.params.id;
    console.log(req.body)
    con.query('UPDATE `categories` SET cat_name=? ,cat_slug=? ,cat_title=? ,cat_desc=? ,parent_category=? ,status=? WHERE id IN (?)', [cat_name, cat_slug, cat_title, cat_desc, parent_category, status, id], (err, result) => {
        if(err){
            console.log(err)
        }
        else{
            console.log(result)
            res.send('updated')
        }
    })
})