const sharp = require("sharp");
const fs = require("fs");

module.exports = async function (req, res, next) {
  //-On passe à la suite si req.file est undefined, si il n'y a pas d'image
  if (req.file === undefined) {
    return next();
  }

  //-On stocke le chemin de l'image dans "path"
  const path = req.file.path;

  //-On construit le nouveau chemin de l'image en le découpant pour ensuite réécrire la fin en modifiant le format de l'image
  const newPath = path.split(".").slice(0, -1).join(".").replace("-raw","-optimized") + Date.now() + ".jpg";
  // try {
    await sharp(path).jpeg({ quality: 70 }).resize(600, 400).toFile(newPath);
    req.file.path = newPath;
    req.file.filename = newPath.split("images\\")[1];
    fs.unlinkSync(path);
    next();
  // } catch (error) {
  //   res.status(500).json(error);
  // }
};
