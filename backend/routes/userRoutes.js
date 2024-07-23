const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const limiter = require("../middlewares/limitor");
const userCtrl = require('../controllers/userController');

router.post('/signup',
      //On définit les règles de validation de Express validator
      [
          body('username').isLength({ min: 8, max: 50 }).withMessage('Le username choisi doit comporter au moins 8 caractères.'),
          body('email').isEmail().withMessage('Veuillez entrer une adresse email valide.'),
          body('password').isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('Le mot de passe choisi doit comporter au moins 8 caractères, 1 minuscule, 1 majuscule et 1 caractère spécial.')
      ],
      //On crée un middleware qui traite les résultats de la validation
      (req, res, next) => {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
          }
          //En cas de succès, on traite la requête
          next();
      },
        limiter, userCtrl.signup);
router.post('/login', limiter, userCtrl.login);


module.exports = router;