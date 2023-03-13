const express = require("express");
const router = express.Router()
const upload = require('../middleware/imageMulter')
const {addImage}=require('../controller/imageController')

//get all categories
router.route('/').post(upload.array('image',5),addImage)


module.exports = router;