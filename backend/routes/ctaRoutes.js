const Router = require('express').Router();
const {getAllCta, addCta, updateCta, deleteCta} = require('../controller/ctaController')

//get all tha cta
Router.get('/',getAllCta);

//get all tha cta
Router.post('/',addCta);

//get all tha cta
Router.put('/:id',updateCta);

//get all tha cta
Router.delete('/:id',deleteCta);

module.exports = Router;