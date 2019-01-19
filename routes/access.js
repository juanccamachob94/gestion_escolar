const router = require('express').Router();
const isAuthenticate = require('../middlewares/isAuthenticate');
const AccessController = require('../controllers/AccessController');
router.all('*',isAuthenticate);
router.route('/')
  .get(AccessController.index)
;
module.exports = router;
