const book = require('../models/bookModel');
const fs = require('fs');


//- GET : Récupération de tous les livres

exports.getAllBooks = (req, res, next) => {
    //Le but est ici de renvoyer un tableau avec tous les livres de la base de données
    book.find()
    .then(
        (books) => { res.status(200).json(books) }
    )
    .catch(error => res.status(404).json({ error }));
};


//- POST : Création d'un livre

exports.createBook = (req, res, next) => {
    //-On stocke la requête demandée sous format JSON
    const bookObject = JSON.parse(req.body.book);
    //-On supprime le mauvais _id venant du front
    delete bookObject._id;
    //-On supprime le "_userId" à qui on ne peut pas faire confiance
    delete bookObject._userId;
    //-On créée l'instance "create" avec le modèle "Book"
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        //Il manque la note du livre
    });
    //-On enregistre le livre créé dans la base de données
    book.save()
    .then(() => {res.status(201).json({ message: "Livre enregistré avec succès !"})})
    .catch(error => {res.status(400).json({ error })})
};


//- GET : Récupération d'un livre

exports.getOneBook = (req, res, next) => {
    book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};