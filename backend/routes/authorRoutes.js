const {getAllAuthor,addAuthor,updateAuthor,deleteAuthor}  = require("../controller/authorController");
const upload = require('../middleware/imageMulter')
const router = require("express").Router();

//get all categories
router.get("/", getAllAuthor);

//add category
router.post("/",upload.single('image'),addAuthor);

//update category
router.put("/:id",upload.single('image'), updateAuthor);

//delete category
router.delete("/:id",deleteAuthor);



module.exports = router;