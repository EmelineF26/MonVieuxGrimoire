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
    .then((book) => { 
      if (book === null) {
        return res.status(404).json({ error: "Ce livre n'existe pas" });
      }
      res.status(200).json(book);
    })
    .catch((error) => { 
      res.status(404).json({ error: "Ce livre n'existe pas" });
    });
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
    //On vérifie que le livre existe bien dans la base de données
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé !' });
      }
    //Si le livre existe bien, on vérifie les autorisations de l'utilisateur connecté pour savoir si il peut modifier le livre choisi
      if (book.userId != req.auth.userId) {
        return res.status(401).json({ message: 'Requête non autorisée !' });
      }
        //Une fois les autorisations vérifiées, on sauvegarde les nouvelles informations du livre
          Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
          .then(() => res.status(200).json({message: 'Livre modifié avec succès !'}))
          .catch(error => res.status(400).json({ error }));
    })
    .catch((error) => {
      res.status(500).json({ error });
    })
};


//- DELETE : Supression d'un livre

exports.deleteBook = (req, res, next) => {
    //On recherche à nouveau le livre demandé dans la base de données à l'aide de son ID
    Book.findOne({ _id: req.params.id})
    .then(book => {
        //On vérifie les autorisations de l'utilisateur connecté pour savoir si il peut supprimer le livre choisi
        if (book.userId != req.auth.userId) {
          res.status(403).json({message: 'Requête non autorisée !'});
        } else {
          const filename = book.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            //Une fois les autorisations vérifiées, on supprime le livre
            Book.deleteOne({_id: req.params.id})
            .then(() => {res.status(200).json({message: 'Livre supprimé avec succès !'})})
            .catch(error => res.status(400).json({ error: "Impossible de supprimer ce livre" }));
          });
        }
    })
    .catch(error => {
        res.status(404).json({ error: "Ce livre n'existe pas" });
    })
};


//- GET : Obtenir les 3 livres ayant la meilleure note

exports.bestRatings = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => {
      if (books.length === 0) {
        //Si on a pas de livres dans la base de données, on renvoie une erreur 400
        return res.status(400).json({ error: "Aucun livre trouvé" });
      }
      res.status(200).json(books);
    })
    .catch((error) => res.status(500).json({ error }));
};


//- POST : Mettre une note au livre et en calculer la moyenne

exports.bookRating = (req, res) => {
  const { rating, userId } = req.body;

  if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return res.status(400).json({ error: "La note n'est pas valide" });
  }

  Book.findOne({ _id: req.params.id }).then((book) => {
    if (!book) {
      res.status(404).json({error: "Aucun livre n'a été trouvé"})
    }
    //On ajoute la note à l'array rating
    else {
      book.ratings.push({
        grade: rating,
        userId: req.auth.userId,
      });
    }
    //On calcule la somme des notes, puis de la moyenne
    const totalRatings = book.ratings.length;
    const sumRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
    const averageRating = sumRatings / totalRatings;

    //On met à jour la moyenne des notes dans le livre
    book.averageRating = averageRating;

    //On sauvegarde les modifications dans la base de données
    book.save().then((updatedBook) => {
      res.status(200).json(updatedBook);
    }).catch((error) => {
      res.status(500).json({ error: "Erreur lors de la mise à jour du livre" });
    });
  }).catch((error) => {
    res.status(500).json({ error: "Erreur lors de la recherche du livre" });
  });
};