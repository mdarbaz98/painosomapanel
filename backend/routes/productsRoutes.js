const router = require('express').Router();
const { getAllproduct,addproduct, updateproduct,deleteproduct,updateproductStatus} = require('../controller/productsController')
const upload = require('../middleware/imageMulter')

//get all product
router.get("/", getAllproduct);

//add product
router.post("/",upload.single('image') ,addproduct);

//update product
router.put("/:id",upload.single('image') , updateproduct);

//update product status
router.put("/status/:id", updateproductStatus);

//delete product
router.delete("/:id",deleteproduct);


module.exports = router;