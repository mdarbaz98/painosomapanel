const con = require("../config");

const getAllCategory = (req, resp) => {
    con.query("select * from category", (err, res) => {
        if (err) {
            resp.send(err);
        } else {
            resp.send(res);
        }
    });
}

const getParentCategory = (req, resp) => {
    con.query("select * from category where parent_category ='0'", (err, res) => {
        if (err) {
            resp.send(err);
        } else {
            resp.send(res);
        }
    });
};

const getSubCategory = (req, resp) => {
    con.query("select * from category where parent_category !='0'", (err, res) => {
        if (err) {
            resp.send(err);
        } else {
            resp.send(res);
        }
    });
};

const getCategoryById = (req, resp) => {
    const id = req.params.id;
    con.query("select * from category where id = ?", [id], (err, res) => {
        if (err) {
            resp.send(err);
        } else {
            resp.send(res);
        }
    });
};

const addCategory = (req, resp) => {
    const {name, parentName, categoryDesc, CategorySlug, CategoryTitle, metaDesc} = req.body;

        con.query('INSERT INTO category (category_name,parent_category,category_description,category_slug,category_title,meta_description) value (?,?,?,?,?,?)',[name,parentName,categoryDesc,CategorySlug,CategoryTitle,metaDesc], (err, result) => {
            if(err) console.log(err)
        })
    resp.send('working');
};

const updateCategory = (req, resp) => {
    const id = req.params.id;
    const {name, parentName, categoryDesc, CategorySlug, CategoryTitle, metaDesc} = req.body;

    con.query('UPDATE category SET category_name = ?, parent_category = ?, category_description = ?, category_slug = ?, category_title = ?, meta_description = ? WHERE id = ?',[name,parentName,categoryDesc,CategorySlug,CategoryTitle,metaDesc,id], (err, result) => {
        if(err) console.log(err)
    })
    resp.send('working')
};

const deleteCategory = (req, resp) => {
    const id = req.params.id;
    const arrayIds = JSON.parse(`[${id}]`)
    con.query('DELETE FROM category WHERE id IN (?)',[arrayIds], (err, result) => {
        if(err) console.log(err)
    }
    )
    resp.send('working')
};


module.exports = {
    getAllCategory,
    getParentCategory,
    getSubCategory,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory
};