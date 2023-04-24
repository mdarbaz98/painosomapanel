const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../public/assets/demo/images/gallery')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + file.mimetype.split('/')[1])
    }
  });

const upload = multer({ storage: storage });

module.exports = upload ;