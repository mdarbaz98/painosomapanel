const router = require("express").Router();
const {getAllBlog, getBlogById, addBlog, updateBlog, deleteBlog} =require('../controller/blogController');
const upload = require('../middleware/imageMulter')


//get all categories
router.get("/", getAllBlog);

//get category by id
router.get("/:id", getBlogById);

//add category
router.post("/",upload.single('image') ,addBlog);

//update category
router.put("/:id",upload.single('image') , updateBlog);

//delete category
router.delete("/:id",deleteBlog);


module.exports = router;