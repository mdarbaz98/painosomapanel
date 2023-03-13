const con = require("../config");

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

const getChildCategory = (req, resp) => {
    const id = req.params.id
    con.query("select * from category where parent_category = ?",id, (err, res) => {
        if (err) {
            resp.send(err);
        } else {
            resp.send(res);
        }
    });
};

module.exports = {getParentCategory, getSubCategory,getChildCategory}