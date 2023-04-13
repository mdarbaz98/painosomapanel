const router = require('express').Router();
const { getAllproduct,addproduct, updateproduct,deleteproduct,updateproductStatus} = require('../controller/productsController')
const upload = require('../middleware/imageMulter')

//get all blog
router.get("/", getAllproduct);

//add blog
router.post("/",upload.single('image') ,addproduct);

//update blog
router.put("/:id",upload.single('image') , updateproduct);

//update blog status
router.put("/status/:id", updateproductStatus);

//delete blog
router.delete("/:id",deleteproduct);


module.exports = router;