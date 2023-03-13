const router = require("express").Router();
const {getParentCategory,getSubCategory,getChildCategory} = require('../controller/parentCategoryController');

router.get("/",getParentCategory);

router.get("/subcategory",getSubCategory);

router.get("/:id",getChildCategory);

module.exports = router