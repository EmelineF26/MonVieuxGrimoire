const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();
console.log(process.env);

mongoose.connect('mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASSWORD+'@'+process.env.DB_HOST,
  { useNewUrlParser: true,
    useUnifiedTopology: true }) 
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//On définit une route de validation avec Express validator pour le nom d'utilisateur et le mot de passe
app.post('/user',
  //On définit les règles de validation
  [
      body('username').isLength({ min: 6 }).withMessage('Le username choisi doit comporter au moins 6 caractères.'),
      body('email').isEmail().withMessage('Veuillez entrer une adresse email valide.'),
      body('password').isLength({ min: 6 }).withMessage('Le mot de passe choisi doit comporter au moins 6 caractères.')
  ],
  //On crée un middleware qui traite les résultats de la validation
  (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }
      //En cas de succès, on traite la requête
      res.send('Utilisateur créé avec succès !');
  }
);


app.use(express.json());
app.use(bodyParser.json());


//On crée le middleware pour gérer les en-têtes CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);


module.exports = app;