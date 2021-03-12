const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const UserController = require('../controllers/UserController.js');


router.get('/', UserController.findUser);
router.post('/show',UserController.show);
router.post('/store',upload.none(),UserController.store);
router.post('/update',UserController.update);
router.post('/remove',UserController.remove);

module.exports = router;
