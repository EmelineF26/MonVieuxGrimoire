const express = require('express');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const sharp = require('../middlewares/sharp-config');
const router = express.Router();
const booksCtrl = require('../controllers/booksController');

router.get('/', booksCtrl.getAllBooks);
router.get('/bestrating', booksCtrl.bestRatings);
router.get('/:id', booksCtrl.getOneBook);

router.post('/:id/rating', auth, booksCtrl.bookRating);
router.post('/', auth, function(req, res, next) {
    multer(req, res, function(error) {
        if (error) {
            return next(error);
        }
        next();
    })
}, sharp, booksCtrl.createBook);

router.put('/:id', auth, multer, sharp, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router;