const router = require("express").Router();
const {getAllBlog,addBlog, updateBlog, deleteBlog,updateblogStatus,getdescBlog} =require('../controller/blogController');
const upload = require('../middleware/imageMulter')


//get all blog
router.get("/", getAllBlog);


//get all blog by desc
router.get("/desc", getdescBlog);

//add blog
router.post("/",upload.single('image') ,addBlog);

//update blog
router.put("/:id",upload.single('image') , updateBlog);

//update blog status
router.put("/status/:id", updateblogStatus);

//delete blog
router.delete("/:id",deleteBlog);


module.exports = router;