const {getAllCategory,getParentCategory, getCategoryById, addCategory, updateCategory, deleteCategory}  = require("../controller/categoryController");
const router = require("express").Router();

//get all categories
router.get("/", getAllCategory);

//get all parent categories
router.get("/parentcategory", getParentCategory);

//get category by id
router.get("/:id", getCategoryById);

//add category
router.post("/", addCategory);

//update category
router.put("/:id", updateCategory);

//delete category
router.delete("/:id",deleteCategory);


module.exports = router;