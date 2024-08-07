const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
app.use(express.json());

require('dotenv').config();
console.log(process.env);

//Connexion à MongoDB Atlas
mongoose.connect('mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASSWORD+'@'+process.env.DB_HOST,
  { useNewUrlParser: true,
    useUnifiedTopology: true }) 
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//On crée le middleware pour gérer les en-têtes CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

function errorHandler ( req, res ) {
  if (res.headersSent) {
    return
  }
  res.status(404).json({ message: "Le end point demandé n'existe pas."})
};
app.use(errorHandler);

module.exports = app;