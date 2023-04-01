const {getAllAuthor,addAuthor,updateAuthor,deleteAuthor}  = require("../controller/authorController");
const router = require("express").Router();

//get all categories
router.get("/", getAllAuthor);

//add category
router.post("/", addAuthor);

//update category
router.put("/:id", updateAuthor);

//delete category
router.delete("/:id",deleteAuthor);



module.exports = router;