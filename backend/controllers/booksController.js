const Book = require('../models/bookModel');
const fs = require('fs');


//- GET : Récupération de tous les livres

exports.getAllBooks = (req, res, next) => {
    //Le but est ici de renvoyer un tableau avec tous les livres de la base de données
    Book.find()
    .then(
        (books) => { res.status(200).json(books) }
    )
    .catch(error => res.status(404).json({ error }));
};


//- POST : Création d'un livre

exports.createBook = (req, res, next) => {
    //-On stocke la requête demandée sous format JSON
    console.log('createBook', req.body.book, req.file.filename);
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
        rating: [],
        averageRating: 0,
    });
    //-On enregistre le livre créé dans la base de données
    book.save()
    .then(() => {res.status(201).json({ message: "Livre enregistré avec succès !"})})
    .catch(error => {res.status(400).json({ error })})
};


//- GET : Récupération d'un livre

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};


//- PUT : Modification d'un livre

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        //On stocke une nouvelle fois la requête demandée au format JSON
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;
    //On recherche le livre demandé dans la base de données à l'aide de son ID
    Book.findOne({_id: req.params.id})
    .then((book) => {
    //On vérifie les autorisations de l'utilisateur connecté pour savoir si il peut modifier le livre choisi
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Requête non autorisée !' });
      } else {
        //Une fois les autorisations vérifiées, on sauvegarde les nouvelles informations du livre
          Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
          .then(() => res.status(200).json({message: 'Livre modifié avec succès !'}))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    })
  };