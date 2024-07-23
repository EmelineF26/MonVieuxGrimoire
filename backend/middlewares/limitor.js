const rateLimit = require("express-rate-limit");

//On configure le middleware de limitations de requêtes par IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes (temps en millisecondes)
    max: 8, //On limite chaque IP à 8 requêtes par `window` (ici, par 15 minutes)
    message: 'Trop de requêtes effectuées, veuillez réessayer plus tard.',
    standardHeaders: true, //On inclut les en-têtes d'information sur la limitation de débit
  });

module.exports = limiter;