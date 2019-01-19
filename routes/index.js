const router = require('express').Router();
const IndexController = require('../controllers/IndexController');
router.route('/')
  .get(IndexController.index)
;
module.exports = router;
