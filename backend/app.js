const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');

// const stuffRoutes = require('./routes/stuff');

// mongoose.connect('mongodb+srv://emelinefarget:tR6nHzc4LWfiPc4i@coursp7.4ucxtzr.mongodb.net/?retryWrites=true&w=majority&appName=CoursP7',
//   { useNewUrlParser: true,
//     useUnifiedTopology: true }) 
//   .then(() => console.log('Connexion à MongoDB réussie !'))
//   .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/auth', userRoutes);
// app.use('/api/books', bookRoutes);
// app.use('/api/stuff', stuffRoutes);

module.exports = app;