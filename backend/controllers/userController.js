const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//- Création de compte
exports.signup = (req, res, next) => {
    //-On appelle la fonction hachage de bcrypt dans le mot de passe qui sera "salé" 10 fois
    bcrypt.hash(req.body.password, 10)
    //-On utilise le hash pour créer un nouvel utilisateur
    .then(hash => {
        //On crée une instance à partir du modèle User
        const user = new User({
            email: req.body.email,
            password: hash
        });
        //-On enregistre l'utilisateur dans la base de donées
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur crée avec succès !' }))
        .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

//- Connexion
exports.login = (req, res, next) => {
    //-On vérifie l'existence de l'utilisateur dans la base de données
    User.findOne({ email: req.body.email })
    .then(user => {
        if (user === null) {
            res.status(401).json({ message: 'Association identifiant/mot de passe incorrecte !'});
        } else {
            //-On compare le mot passe entré avec le hash qui est dans la base de données
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    res.status(401).json({ message: 'Association identifiant/mot de passe incorrecte !'});
                } else {
                    //-Si informations valides, on renvoie une réponse contenant le userId et un token jwt
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN_SECRET,
                            { expiresIn: '24h' }
                        )
                    });
                }
            })
            .catch(error => {
                res.status(500).json({ error });
            })
        }
    })
    .catch(error => {
        res.status(500).json({ error });
    })
};