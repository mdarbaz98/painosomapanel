const {getAllCategory,getParentCategory, getCategoryById, addCategory, updateCategory,updateCategoryStatus, deleteCategory,getSubCategory}  = require("../controller/categoryController");
const router = require("express").Router();

//get all categories
router.get("/", getAllCategory);

//get all parent categories
router.get("/parentcategory", getParentCategory);

// get all subcategory

router.get("/subcategory",getSubCategory);

//get category by id
router.get("/:id", getCategoryById);

//add category
router.post("/", addCategory);

//update category
router.put("/:id", updateCategory);

//update category status
router.put("/status/:id", updateCategoryStatus);

//delete category
router.delete("/:id",deleteCategory);



module.exports = router;