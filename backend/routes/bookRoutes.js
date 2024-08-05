const express = require('express');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const router = express.Router();
const booksCtrl = require('../controllers/booksController');

router.get('/', booksCtrl.getAllBooks);
router.get('/bestratings', booksCtrl.bestRatings);
router.get('/:id', booksCtrl.getOneBook);

router.post('/:id/rating', auth, booksCtrl.bookRating);
router.post('/', auth, multer, booksCtrl.createBook);

router.put('/:id', auth, multer, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router;