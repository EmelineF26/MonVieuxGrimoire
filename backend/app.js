const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
app.use(express.json());

require('dotenv').config();

//-Connexion à MongoDB Atlas
mongoose.connect('mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASSWORD+'@'+process.env.DB_HOST,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//-On crée le middleware pour gérer les en-têtes CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/images', express.static('images'));

//-Gestion de l'erreur liée aux mauvais fichiers envoyés
function errorHandler(error, req, res, next) {
  if (error.cause == "Invalid Data") {
    return res.status(400).json({ error: error.message });
  }
  res.status(500).json({ error });
}

app.use(errorHandler)

function endpointNotFoundHandler ( req, res ) {
  if (res.headersSent) {
    console.log('Réponse déjà envoyée');
    return
  }
  res.status(404).json({ message: "Le end point demandé n'existe pas."})
};

app.use(endpointNotFoundHandler);

module.exports = app;