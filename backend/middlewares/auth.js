const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        //-On extrait le token du header Authorization de la requête
        const token = req.headers.authorization.split(' ')[1];
        //-On décode le token que l'on a extrait
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        //-On extrait maintenant l'ID de l'utilisateur authentifié
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        res.status(401).json({ error });
    }
};