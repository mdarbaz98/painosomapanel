const registerUser = require('../controller/registerController')
const router = require('express').Router();


router.post('/',registerUser);


module.exports = router;