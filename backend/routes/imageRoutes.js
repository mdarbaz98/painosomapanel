const Router = require('express').Router();
const {getAllImage, addImage, updateImage, deleteImage} = require('../controller/imageController')
const upload = require('../middleware/imageMulter')

//get all tha cta
Router.get('/',getAllImage);

//get all tha cta
Router.post('/',upload.single('image'), addImage);

//get all tha cta
Router.put('/:id',upload.single('image'), updateImage);

//get all tha cta
Router.delete('/:id',deleteImage);

module.exports = Router;