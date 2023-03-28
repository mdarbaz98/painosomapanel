const router = require("express").Router();
const {getAllBlog,addBlog, updateBlog, deleteBlog} =require('../controller/blogController');
const upload = require('../middleware/imageMulter')


//get all categories
router.get("/", getAllBlog);

//add category
router.post("/",upload.single('image') ,addBlog);

//update category
router.put("/:id",upload.single('image') , updateBlog);

//delete category
router.delete("/:id",deleteBlog);


module.exports = router;