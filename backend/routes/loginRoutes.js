const loginUser = require('../controller/loginController')
const router = require('express').Router();


router.post('/',loginUser);


module.exports = router;